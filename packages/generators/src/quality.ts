// The automated quality checks from docs/design.md: every generator runs across 500 seeds at
// every depth and numbers setting it supports before it can be merged.
import {
  NUMBERS,
  type AnswerSpec,
  type AnswerValue,
  type Depth,
  type Generator,
  type Numbers,
  type Option,
  type Part,
  type Question,
} from "@mathsplanner/core";
import { renderDiagram } from "@mathsplanner/diagrams";
import { renderQuestion } from "@mathsplanner/render";
import catalogueFile from "../../../data/misconceptions.json" with { type: "json" };

export type QualityCheck =
  | "generates"
  | "determinism"
  | "verify"
  | "distractors"
  | "degeneracy"
  | "niceness"
  | "diagram truth"
  | "label collisions"
  | "accessibility"
  | "renders"
  | "solution"
  | "catalogue";

export interface QualityFailure {
  check: QualityCheck;
  depth?: Depth;
  numbers?: Numbers;
  seed?: number;
  message: string;
}

export interface QualityResult {
  runs: number;
  failures: QualityFailure[];
}

export interface QualityOptions {
  /** Seeds per depth and numbers setting. Default 500, or QUALITY_SEEDS if set. */
  seeds?: number;
}

const CATALOGUE = new Set(
  (catalogueFile as { misconceptions: { code: string }[] }).misconceptions.map((m) => m.code),
);

const json = (v: unknown) => JSON.stringify(v);

/** Whether a wrong answer would be marked right. */
function matchesCorrect(answer: AnswerSpec, wrong: AnswerValue): boolean {
  switch (answer.type) {
    case "number":
      return wrong.type === "number" && wrong.value === answer.value;
    case "exact":
      return wrong.type === "exact" && wrong.latex === answer.value;
    case "coordinate":
      return wrong.type === "coordinate" && wrong.x === answer.x && wrong.y === answer.y;
    case "choice":
      return wrong.type === "choice" && wrong.id === answer.correct;
    case "choice-with-reason":
      return wrong.type === "choice" && wrong.id === answer.correctReason;
    default:
      return false;
  }
}

function optionProblems(
  label: string,
  options: readonly Option[],
  correct: readonly string[],
): string[] {
  const problems: string[] = [];
  const ids = options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) problems.push(`${label} has repeated option IDs`);
  const contents = options.map((o) => json(o.content));
  if (new Set(contents).size !== contents.length)
    problems.push(`${label} has two identical options`);
  if (options.length < 2) problems.push(`${label} has fewer than two options`);
  for (const c of correct)
    if (!ids.includes(c)) problems.push(`${label} marks missing option ${c} as correct`);
  return problems;
}

function partProblems(part: Part, index: number): { distractors: string[]; degeneracy: string[] } {
  const label = `part ${index + 1}`;
  const distractors: string[] = [];
  const degeneracy: string[] = [];
  const a = part.answer;
  if (a.type === "number" && !Number.isFinite(a.value))
    degeneracy.push(`${label} answer is ${a.value}`);
  if (a.type === "choice") distractors.push(...optionProblems(label, a.options, [a.correct]));
  if (a.type === "multi-select") distractors.push(...optionProblems(label, a.options, a.correct));
  if (a.type === "choice-with-reason") {
    distractors.push(
      ...optionProblems(label, a.options, [a.correct]),
      ...optionProblems(`${label} reasons`, a.reasons, [a.correctReason]),
    );
  }
  if (a.type === "order") distractors.push(...optionProblems(label, a.options, a.correct));
  if (a.type === "match") {
    distractors.push(
      ...optionProblems(
        `${label} left`,
        a.left,
        a.correct.map(([l]) => l),
      ),
      ...optionProblems(
        `${label} right`,
        a.right,
        a.correct.map(([, r]) => r),
      ),
    );
  }
  const wrongs = part.misconceptions.map((m) => json(m.answer));
  if (new Set(wrongs).size !== wrongs.length)
    distractors.push(`${label} has two misconceptions with the same wrong answer`);
  for (const m of part.misconceptions) {
    if (matchesCorrect(a, m.answer))
      distractors.push(`${label} misconception ${m.code} gives the correct answer`);
  }
  return { distractors, degeneracy };
}

function decimals(v: number): number {
  const text = String(v);
  if (text.includes("e")) return 20;
  return text.includes(".") ? (text.split(".")[1]?.length ?? 0) : 0;
}

/** Runs every check on one generator. */
export function checkQuality(generator: Generator, options: QualityOptions = {}): QualityResult {
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
    ?.env;
  const seeds = options.seeds ?? (Number(env?.QUALITY_SEEDS) || 500);
  const def = generator.definition;
  const failures: QualityFailure[] = [];
  let runs = 0;

  for (const code of def.misconceptions) {
    if (!CATALOGUE.has(code))
      failures.push({ check: "catalogue", message: `${code} is not in data/misconceptions.json` });
  }
  if (!def.verify)
    failures.push({ check: "verify", message: "the generator has no verify function" });

  for (const depth of generator.depths) {
    for (const numbers of NUMBERS) {
      const bounds = def.bounds?.[numbers];
      for (let seed = 0; seed < seeds; seed++) {
        runs++;
        const at = { depth, numbers, seed };
        const fail = (check: QualityCheck, message: string) =>
          failures.push({ check, ...at, message });
        let question: Question;
        let params: unknown;
        try {
          ({ question, params } = generator.generateFull(at));
        } catch (error) {
          fail("generates", (error as Error).message);
          continue;
        }
        if (json(generator.generate(at)) !== json(question))
          fail("determinism", "the same key gave a different question");
        if (def.verify && !def.verify(params, question))
          fail("verify", "verify disagrees with the answer");
        if (question.solution.length === 0) fail("solution", "no worked solution");

        question.parts.forEach((part, i) => {
          const { distractors, degeneracy } = partProblems(part, i);
          for (const message of distractors) fail("distractors", message);
          for (const message of degeneracy) fail("degeneracy", message);
          if (bounds && part.answer.type === "number") {
            const v = part.answer.value;
            if (bounds.min !== undefined && v < bounds.min)
              fail("niceness", `answer ${v} is below ${bounds.min}`);
            if (bounds.max !== undefined && v > bounds.max)
              fail("niceness", `answer ${v} is above ${bounds.max}`);
            if (bounds.dp !== undefined && decimals(v) > bounds.dp)
              fail("niceness", `answer ${v} has more than ${bounds.dp} decimal places`);
          }
        });

        const diagrams = [
          ...question.diagrams,
          ...question.parts.flatMap((p) => (p.answer.type === "plot" ? [p.answer.target] : [])),
        ];
        for (const [i, spec] of diagrams.entries()) {
          try {
            const result = renderDiagram(spec);
            for (const p of result.problems) fail("diagram truth", `diagram ${i}: ${p}`);
            for (const c of result.collisions)
              fail("label collisions", `diagram ${i}: ${c.label} overlaps ${c.with}`);
            if (!result.description.trim())
              fail("accessibility", `diagram ${i} has no description`);
          } catch (error) {
            // Types the engine does not draw yet are placeholders, not failures.
            if (!/not supported yet/.test((error as Error).message))
              fail("diagram truth", `diagram ${i}: ${(error as Error).message}`);
          }
        }

        try {
          renderQuestion(question, { showAnswers: true, showSolution: true });
        } catch (error) {
          fail("renders", (error as Error).message);
        }
      }
    }
  }
  return { runs, failures };
}

/** A readable summary: counts per check and the first few examples. */
export function qualityReport(id: string, result: QualityResult, examples = 3): string {
  if (result.failures.length === 0)
    return `${id}: all checks passed across ${result.runs} questions.`;
  const byCheck = new Map<QualityCheck, QualityFailure[]>();
  for (const f of result.failures) byCheck.set(f.check, [...(byCheck.get(f.check) ?? []), f]);
  const lines = [`${id}: ${result.failures.length} failure(s) across ${result.runs} questions.`];
  for (const [check, list] of byCheck) {
    lines.push(`  ${check} (${list.length}):`);
    for (const f of list.slice(0, examples)) {
      const where = f.depth === undefined ? "" : `depth ${f.depth} ${f.numbers} seed ${f.seed}: `;
      lines.push(`    - ${where}${f.message}`);
    }
  }
  return lines.join("\n");
}

/** For generator tests: throws with a readable report unless every check passes. */
export function assertQuality(generator: Generator, options?: QualityOptions): void {
  const result = checkQuality(generator, options);
  if (result.failures.length > 0) throw new Error(qualityReport(generator.id, result));
}
