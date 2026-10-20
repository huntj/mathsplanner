// defineGenerator wraps a generator definition with seeding, retries and checks, so a generator
// file only supplies the maths. See "Writing a generator" in docs/design.md.
import { parseId } from "./ids.ts";
import {
  ARCHETYPES,
  DEPTHS,
  NUMBERS,
  type AnswerSpec,
  type AnswerValue,
  type ArchetypeId,
  type Depth,
  type DiagramSpec,
  type Numbers,
  type Part,
  type Question,
  type QuestionMeta,
  type Rich,
  type SolutionStep,
} from "./question.ts";
import { createRng, Reject, type Rng } from "./random.ts";
import type { Statement } from "./statement.ts";

/** Checks the response to an open-construction part. */
export type Validator = (values: AnswerValue[]) => boolean;

/** A condition answer as a generator writes it: the validator travels outside the JSON. */
export type ConditionDraft = Extract<AnswerSpec, { type: "condition" }> & { check: Validator };

export type PartDraft = Omit<Part, "answer" | "misconceptions" | "marks"> & {
  answer: AnswerSpec | ConditionDraft;
  marks?: number;
  misconceptions?: Part["misconceptions"];
};

/** What build returns (archetypes produce these from Phase 4). */
export interface QuestionDraft {
  archetype: ArchetypeId;
  stem: Rich;
  diagrams?: DiagramSpec[];
  parts: PartDraft[];
  solution?: SolutionStep[];
  meta?: Partial<QuestionMeta>;
}

export interface AnswerBounds {
  min?: number;
  max?: number;
  /** Most decimal places a numeric answer may have. */
  dp?: number;
}

export interface GeneratorDefinition<P> {
  /** Statement ID, e.g. "Y6-FR-03". */
  id: string;
  /** Semver; bump it whenever a change would alter the question for an existing key. */
  version: string;
  /** Every depth this generator supports. */
  depths: readonly Depth[];
  /** Every misconception code its questions can contain. */
  misconceptions: readonly string[];
  /** Picks parameters. They depend only on rng and the numbers setting, not on depth. */
  params(rng: Rng, numbers: Numbers): P;
  /** Rejects parameter sets that make bad questions. */
  accept?(params: P, numbers: Numbers): boolean;
  /** Builds the question at one depth. May call reject() to draw new parameters. */
  build(params: P, depth: Depth, rng: Rng): QuestionDraft;
  /** The worked solution, used when build does not supply one. */
  solution?(params: P, depth: Depth): SolutionStep[];
  /** Recomputes the answer a different way; used by the quality checks. */
  verify?(params: P, question: Question): boolean;
  /**
   * How nice numeric answers must be at each numbers setting; the quality checks enforce it.
   * For example { friendly: { min: 10, max: 170, dp: 0 } }.
   */
  bounds?: Partial<Record<Numbers, AnswerBounds>>;
  /** Parameter draws before giving up. Default 1000. */
  maxAttempts?: number;
}

export interface GenerateRequest {
  depth: Depth;
  numbers: Numbers;
  seed: number;
  /** If given, must match the generator's version. */
  version?: string;
}

export interface Generated<P> {
  question: Question;
  params: P;
  /** Validators for condition parts, by part index. */
  validators: ReadonlyMap<number, Validator>;
}

export interface Generator<P = unknown> {
  readonly id: string;
  readonly version: string;
  readonly depths: readonly Depth[];
  readonly misconceptions: readonly string[];
  readonly definition: GeneratorDefinition<P>;
  /** The question for a key: the same request always gives the same question. */
  generate(request: GenerateRequest): Question;
  /** The question with its parameters and condition validators, for marking and checks. */
  generateFull(request: GenerateRequest): Generated<P>;
}

export class GenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GenerationError";
  }
}

const SEMVER = /^\d+\.\d+\.\d+$/;
const MISCONCEPTION_CODE = /^[A-Z0-9]+(?:\.[A-Z0-9]+(?:-[A-Z0-9]+)*)+$/;

function checkDefinition<P>(def: GeneratorDefinition<P>): void {
  const problems: string[] = [];
  if (!parseId(def.id)) problems.push(`"${def.id}" is not a statement ID`);
  if (!SEMVER.test(def.version)) problems.push(`version "${def.version}" is not x.y.z`);
  if (def.depths.length === 0) problems.push("depths is empty");
  if (new Set(def.depths).size !== def.depths.length) problems.push("depths has duplicates");
  for (const d of def.depths) if (!DEPTHS.includes(d)) problems.push(`depth ${d} is not 1 to 5`);
  for (const code of def.misconceptions) {
    if (!MISCONCEPTION_CODE.test(code)) problems.push(`misconception code "${code}" is malformed`);
  }
  if (problems.length > 0) {
    throw new GenerationError(`defineGenerator(${def.id}): ${problems.join("; ")}`);
  }
}

/** Throws unless value is plain JSON: no functions, class instances, NaN or undefined values. */
export function assertPlainJson(value: unknown, path = "question"): void {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new GenerationError(`${path} is ${value}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => assertPlainJson(v, `${path}[${i}]`));
    return;
  }
  if (typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) throw new GenerationError(`${path}.${k} is undefined`);
      assertPlainJson(v, `${path}.${k}`);
    }
    return;
  }
  const kind = typeof value === "object" ? value.constructor?.name : typeof value;
  throw new GenerationError(`${path} is a ${kind}, not plain JSON (format values with toLatex)`);
}

function diagramRefs(rich: Rich): number[] {
  return rich.flatMap((node) => (node.t === "diagram" ? [node.i] : []));
}

function finish<P>(
  def: GeneratorDefinition<P>,
  request: GenerateRequest,
  params: P,
  draft: QuestionDraft,
): Generated<P> {
  const where = `${def.id} depth ${request.depth} ${request.numbers} seed ${request.seed}`;
  if (!ARCHETYPES.includes(draft.archetype)) {
    throw new GenerationError(`${where}: unknown archetype "${draft.archetype}"`);
  }
  if (draft.parts.length === 0) throw new GenerationError(`${where}: question has no parts`);

  const validators = new Map<number, Validator>();
  const parts: Part[] = draft.parts.map((p, i) => {
    let answer: AnswerSpec = p.answer;
    if ("check" in p.answer) {
      const { check, ...spec } = p.answer;
      validators.set(i, check);
      answer = spec;
    }
    const misconceptions = p.misconceptions ?? [];
    for (const m of misconceptions) {
      if (!def.misconceptions.includes(m.code)) {
        throw new GenerationError(`${where}: part ${i} uses undeclared misconception ${m.code}`);
      }
    }
    return {
      ...(p.label === undefined ? {} : { label: p.label }),
      prompt: p.prompt,
      answer,
      marks: p.marks ?? 1,
      misconceptions,
    };
  });

  const diagrams = draft.diagrams ?? [];
  const solution =
    draft.solution && draft.solution.length > 0
      ? draft.solution
      : (def.solution?.(params, request.depth) ?? []);
  const refs = [
    ...diagramRefs(draft.stem),
    ...parts.flatMap((p) => diagramRefs(p.prompt)),
    ...solution.flatMap((s) => [
      ...diagramRefs(s.say),
      ...(s.diagram === undefined ? [] : [s.diagram]),
    ]),
  ];
  for (const i of refs) {
    if (!Number.isInteger(i) || i < 0 || i >= diagrams.length) {
      throw new GenerationError(`${where}: diagram ${i} does not exist`);
    }
  }

  const marks = parts.reduce((sum, p) => sum + p.marks, 0);
  const question: Question = {
    key: {
      statementId: def.id,
      depth: request.depth,
      numbers: request.numbers,
      seed: request.seed,
      version: def.version,
    },
    archetype: draft.archetype,
    stem: draft.stem,
    diagrams,
    parts,
    solution,
    meta: {
      calculator: draft.meta?.calculator ?? false,
      marks: draft.meta?.marks ?? marks,
      minutes: draft.meta?.minutes ?? marks,
      tags: draft.meta?.tags ?? [],
    },
  };
  assertPlainJson(question);
  return { question, params, validators };
}

export function defineGenerator<P>(definition: GeneratorDefinition<P>): Generator<P> {
  checkDefinition(definition);
  const def = definition;

  const generateFull = (request: GenerateRequest): Generated<P> => {
    const { depth, numbers, seed, version } = request;
    if (!def.depths.includes(depth)) {
      throw new GenerationError(`${def.id} does not support depth ${depth}`);
    }
    if (!NUMBERS.includes(numbers))
      throw new GenerationError(`unknown numbers setting "${numbers}"`);
    if (!Number.isSafeInteger(seed) || seed < 0) {
      throw new GenerationError(`seed must be a non-negative integer, not ${seed}`);
    }
    if (version !== undefined && version !== def.version) {
      throw new GenerationError(`${def.id} is version ${def.version}, not ${version}`);
    }

    // Parameters come from a stream that ignores depth, so one seed shows the same numbers at
    // every depth unless a depth rejects them. Each build gets its own depth-specific stream.
    const paramsRng = createRng(`${def.id}|${numbers}|${seed}`);
    const attempts = def.maxAttempts ?? 1000;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        const params = def.params(paramsRng, numbers);
        if (def.accept && !def.accept(params, numbers)) continue;
        const buildRng = createRng(`${def.id}|${numbers}|${seed}|depth ${depth}|${attempt}`);
        return finish(def, request, params, def.build(params, depth, buildRng));
      } catch (error) {
        if (error instanceof Reject) continue;
        throw error;
      }
    }
    throw new GenerationError(
      `${def.id} depth ${depth} ${numbers} seed ${seed}: no acceptable parameters in ${attempts} attempts`,
    );
  };

  return {
    id: def.id,
    version: def.version,
    depths: def.depths,
    misconceptions: def.misconceptions,
    definition: def,
    generate: (request) => generateFull(request).question,
    generateFull,
  };
}

export interface RegistryEntry {
  generator: Generator;
  statement: Statement;
}

export interface Registry {
  get(id: string): RegistryEntry | undefined;
  entries(): RegistryEntry[];
}

/** Attaches statement metadata to generators, failing on unknown or duplicate statement IDs. */
export function createRegistry(
  generators: readonly Generator[],
  statements: readonly Statement[],
): Registry {
  const byId = new Map(statements.map((s) => [s.id, s]));
  const entries = new Map<string, RegistryEntry>();
  for (const generator of generators) {
    const statement = byId.get(generator.id);
    if (!statement) throw new GenerationError(`generator ${generator.id}: unknown statement ID`);
    if (entries.has(generator.id)) {
      throw new GenerationError(`generator ${generator.id} is registered twice`);
    }
    entries.set(generator.id, { generator, statement });
  }
  return { get: (id) => entries.get(id), entries: () => [...entries.values()] };
}
