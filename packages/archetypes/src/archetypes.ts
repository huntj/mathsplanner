// The 15 archetypes: the question patterns every statement shares. A generator supplies the
// maths (a correct answer, how it goes wrong, how to show it) and an archetype builds the stem,
// options, marking and solution layout. See "Archetypes" in docs/design.md.
import {
  reject,
  toLatex,
  type AnswerValue,
  type ArchetypeId,
  type ConditionInput,
  type DiagramSpec,
  type LatexValue,
  type Misconception,
  type Option,
  type PartDraft,
  type QuestionDraft,
  type Rich,
  type Rng,
  type SolutionStep,
  type Validator,
} from "@mathsplanner/core";
import { answerLatex, number, exact, toAnswerSpec, toAnswerValue, type Answer } from "./answers.ts";
import { Collector, figure, type RichInput } from "./rich.ts";

/** A predictable wrong answer and what to tell a student who gives it. */
export interface Wrong {
  /** A code from data/misconceptions.json. */
  code: string;
  value: Answer;
  feedback: RichInput;
  /** Statement ID to step back to. */
  remediate?: string;
}

/** A wrong option in a choice question, optionally tied to a misconception. */
export interface Distractor {
  content: RichInput;
  code?: string;
  feedback?: RichInput;
  remediate?: string;
}

export interface StepInput {
  say: RichInput;
  math?: LatexValue;
  figure?: DiagramSpec;
}

interface Common {
  marks?: number;
  calculator?: boolean;
  tags?: string[];
  solution?: StepInput[];
}

export class ArchetypeError extends Error {
  constructor(archetype: ArchetypeId, message: string) {
    super(`${archetype}: ${message}`);
    this.name = "ArchetypeError";
  }
}

const LETTERS = "ABCDEFGHIJ";

function solutionSteps(c: Collector, steps: StepInput[] | undefined): SolutionStep[] {
  return (steps ?? []).map((s) => ({
    say: c.rich(s.say),
    ...(s.math === undefined ? {} : { math: toLatex(s.math) }),
    ...(s.figure === undefined ? {} : { diagram: c.add(s.figure) }),
  }));
}

function draft(
  archetype: ArchetypeId,
  c: Collector,
  stem: Rich,
  parts: PartDraft[],
  common: Common,
): QuestionDraft {
  const solution = solutionSteps(c, common.solution);
  return {
    archetype,
    stem,
    diagrams: c.diagrams,
    parts,
    ...(solution.length ? { solution } : {}),
    meta: {
      ...(common.calculator === undefined ? {} : { calculator: common.calculator }),
      ...(common.tags === undefined ? {} : { tags: common.tags }),
    },
  };
}

function misconceptions(c: Collector, wrong: readonly Wrong[] | undefined): Misconception[] {
  return (wrong ?? []).map((w) => ({
    code: w.code,
    answer: toAnswerValue(w.value),
    feedback: c.rich(w.feedback),
    ...(w.remediate === undefined ? {} : { remediate: w.remediate }),
  }));
}

/** Shuffles choices and gives them neutral letter IDs, so the markup never reveals the answer. */
function lettered<T>(
  rng: Rng | undefined,
  items: readonly T[],
): { item: T; id: string; original: number }[] {
  const order = items.map((_, i) => i);
  const shuffled = rng ? rng.shuffle(order) : order;
  return shuffled.map((original, k) => ({
    item: items[original] as T,
    id: LETTERS[k] ?? `O${k}`,
    original,
  }));
}

// --- single-answer archetypes ---------------------------------------------------------------

export interface SingleInput extends Common {
  /** The question, with any figures inline. */
  question: RichInput;
  /** The part's prompt, e.g. "Work out the size of angle x." */
  ask?: RichInput;
  answer: Answer;
  wrong?: Wrong[];
}

function single(archetype: ArchetypeId, input: SingleInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.question);
  return draft(
    archetype,
    c,
    stem,
    [
      {
        prompt: c.rich(input.ask),
        answer: toAnswerSpec(input.answer),
        misconceptions: misconceptions(c, input.wrong),
        ...(input.marks === undefined ? {} : { marks: input.marks }),
      },
    ],
    input,
  );
}

/** Depth 1. Answer a direct question. */
export function standard(input: SingleInput): QuestionDraft {
  return single("standard", input);
}

/** Depth 2. Work backwards from the answer to a starting value. */
export function reverse(input: SingleInput): QuestionDraft {
  return single("reverse", input);
}

export interface VariedFormInput extends Omit<SingleInput, "question" | "ask"> {
  /** Alternative layouts or wordings of the same question; one is chosen. */
  forms: { question: RichInput; ask?: RichInput }[];
  rng: Rng;
}

/** Depth 2. The same skill in an unfamiliar layout or wording. */
export function variedForm(input: VariedFormInput): QuestionDraft {
  if (input.forms.length === 0) throw new ArchetypeError("varied-form", "needs at least one form");
  const form = input.rng.pick(input.forms);
  return single("varied-form", {
    ...input,
    question: form.question,
    ...(form.ask === undefined ? {} : { ask: form.ask }),
  });
}

export interface MissingValueInput extends Common {
  /** Text before the relation, e.g. a figure or "Fill in the box." */
  intro?: RichInput;
  /** Values and operators in order: [47, "+", 133, "=", 180]. Strings are LaTeX. */
  relation: (number | Exclude<LatexValue, string> | string)[];
  /** Index of the value to hide. */
  hide: number;
  /** Units for every value, e.g. "°". */
  units?: string;
  wrong?: Wrong[];
}

/** Depth 2. Find a value hidden in any position of a relationship. */
export function missingValue(input: MissingValueInput): QuestionDraft {
  const hidden = input.relation[input.hide];
  if (hidden === undefined || typeof hidden === "string") {
    throw new ArchetypeError("missing-value", `item ${input.hide} is not a value`);
  }
  const answer: Answer =
    typeof hidden === "number"
      ? number(hidden, input.units ? { units: input.units } : {})
      : exact(hidden);
  const show = (v: (typeof input.relation)[number], i: number) => {
    if (i === input.hide) return "\\square";
    if (typeof v === "string") return v;
    const value =
      typeof v === "number" ? number(v, input.units ? { units: input.units } : {}) : exact(v);
    return answerLatex(value);
  };
  const latex = input.relation.map(show).join(" ");
  const c = new Collector();
  const stem = c.rich([
    input.intro ?? "Find the missing number.",
    { t: "math", v: latex, display: true },
  ]);
  return draft(
    "missing-value",
    c,
    stem,
    [
      {
        prompt: c.rich("What goes in the box?"),
        answer: toAnswerSpec(answer),
        misconceptions: misconceptions(c, input.wrong),
        ...(input.marks === undefined ? {} : { marks: input.marks }),
      },
    ],
    input,
  );
}

// --- choice archetypes ----------------------------------------------------------------------

interface ChoiceSetup {
  correct: RichInput;
  distractors: Distractor[];
  rng: Rng;
}

function choicePart(
  c: Collector,
  setup: ChoiceSetup,
  prompt: RichInput,
  marks?: number,
): PartDraft {
  if (setup.distractors.length === 0)
    throw new ArchetypeError("standard", "a choice needs at least one distractor");
  const items: Distractor[] = [{ content: setup.correct }, ...setup.distractors];
  const options = lettered(setup.rng, items);
  const correct = options.find((o) => o.original === 0)?.id ?? "A";
  return {
    prompt: c.rich(prompt),
    answer: {
      type: "choice",
      options: options.map((o) => ({ id: o.id, content: c.rich(o.item.content) })),
      correct,
    },
    misconceptions: options
      .filter((o) => o.original > 0 && o.item.code !== undefined)
      .map((o) => ({
        code: o.item.code ?? "",
        answer: { type: "choice", id: o.id } satisfies AnswerValue,
        feedback: c.rich(o.item.feedback ?? ""),
        ...(o.item.remediate === undefined ? {} : { remediate: o.item.remediate }),
      })),
    ...(marks === undefined ? {} : { marks }),
  };
}

export interface ChooseTheDiagramInput extends Common {
  question: RichInput;
  correct: DiagramSpec;
  distractors: { figure: DiagramSpec; code?: string; feedback?: RichInput; remediate?: string }[];
  ask?: RichInput;
  rng: Rng;
}

/** Depth 3. Pick the diagram that shows the maths. */
export function chooseTheDiagram(input: ChooseTheDiagramInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.question);
  const part = choicePart(
    c,
    {
      correct: figure(input.correct),
      distractors: input.distractors.map((d) => ({ ...d, content: figure(d.figure) })),
      rng: input.rng,
    },
    input.ask ?? "Which diagram shows this?",
    input.marks,
  );
  return draft("choose-the-diagram", c, stem, [part], input);
}

export interface ExplainTheErrorInput extends Common {
  /** The mistaken claim, e.g. "Sam says angle x is 250°." */
  claim: RichInput;
  correct: RichInput;
  distractors: Distractor[];
  ask?: RichInput;
  rng: Rng;
}

/** Depth 4. Pick the correct explanation of a mistake. */
export function explainTheError(input: ExplainTheErrorInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.claim);
  const part = choicePart(
    c,
    input,
    input.ask ?? "Which explanation of the mistake is correct?",
    input.marks,
  );
  return draft("explain-the-error", c, stem, [part], input);
}

export interface SpotTheMistakeInput extends Common {
  question: RichInput;
  /** The lines of working, one of which is wrong. */
  lines: RichInput[];
  /** Index of the first wrong line. */
  mistake: number;
  /** Misconception behind the wrong line, if any. */
  code?: string;
  feedback?: RichInput;
}

/** Depth 4. Find the first wrong line in some working. */
export function spotTheMistake(input: SpotTheMistakeInput): QuestionDraft {
  if (!(input.mistake >= 0 && input.mistake < input.lines.length)) {
    throw new ArchetypeError(
      "spot-the-mistake",
      `mistake ${input.mistake} is not one of the ${input.lines.length} lines`,
    );
  }
  const c = new Collector();
  const stem = [
    ...c.rich(input.question),
    ...input.lines.flatMap((line, i) => [
      { t: "text" as const, v: ` Line ${i + 1}: ` },
      ...c.rich(line),
    ]),
  ];
  const options: Option[] = input.lines.map((_, i) => ({
    id: LETTERS[i] ?? `L${i}`,
    content: [{ t: "text", v: `Line ${i + 1}` }],
  }));
  return draft(
    "spot-the-mistake",
    c,
    stem,
    [
      {
        prompt: c.rich("Which line contains the first mistake?"),
        answer: { type: "choice", options, correct: options[input.mistake]?.id ?? "A" },
        misconceptions: [],
        ...(input.marks === undefined ? {} : { marks: input.marks }),
      },
    ],
    {
      ...input,
      solution: input.solution ?? (input.feedback ? [{ say: input.feedback }] : []),
    },
  );
}

export interface CompareMethodsInput extends Common {
  question: RichInput;
  /** Methods to compare; exactly one is the answer. */
  methods: { working: RichInput; best: boolean; code?: string; feedback?: RichInput }[];
  /** "works": which method is correct; "efficient": which correct method is quickest. */
  ask: "works" | "efficient";
  rng: Rng;
}

/** Depth 4. Judge which method works, or which is most efficient. */
export function compareMethods(input: CompareMethodsInput): QuestionDraft {
  const best = input.methods.filter((m) => m.best);
  if (best.length !== 1)
    throw new ArchetypeError(
      "compare-methods",
      `needs exactly one best method, not ${best.length}`,
    );
  const c = new Collector();
  const stem = c.rich(input.question);
  const part = choicePart(
    c,
    {
      correct: best[0]?.working ?? "",
      distractors: input.methods
        .filter((m) => !m.best)
        .map((m) => ({
          content: m.working,
          ...(m.code ? { code: m.code } : {}),
          ...(m.feedback ? { feedback: m.feedback } : {}),
        })),
      rng: input.rng,
    },
    input.ask === "works" ? "Which method is correct?" : "Which method is the most efficient?",
    input.marks,
  );
  return draft("compare-methods", c, stem, [part], input);
}

// --- choice with reason ---------------------------------------------------------------------

export interface Reason {
  text: RichInput;
  correct?: boolean;
  code?: string;
}

function reasonPart(
  archetype: ArchetypeId,
  c: Collector,
  prompt: RichInput,
  options: Option[],
  correctOption: string,
  reasons: Reason[],
  rng: Rng,
  marks: number | undefined,
): PartDraft {
  const right = reasons.filter((r) => r.correct);
  if (right.length !== 1)
    throw new ArchetypeError(archetype, `needs exactly one correct reason, not ${right.length}`);
  if (reasons.length < 2) throw new ArchetypeError(archetype, "needs at least two reasons");
  const ordered = lettered(rng, reasons).map(({ item, id }) => ({ item, id: `R${id}` }));
  return {
    prompt: c.rich(prompt),
    answer: {
      type: "choice-with-reason",
      options,
      correct: correctOption,
      reasons: ordered.map(({ item, id }) => ({ id, content: c.rich(item.text) })),
      correctReason: ordered.find(({ item }) => item.correct)?.id ?? "",
    },
    misconceptions: [],
    marks: marks ?? 2,
  };
}

export interface AlwaysSometimesNeverInput extends Common {
  claim: RichInput;
  truth: "always" | "sometimes" | "never";
  reasons: Reason[];
  rng: Rng;
}

/** Depth 4. Judge a general claim and pick the reason. */
export function alwaysSometimesNever(input: AlwaysSometimesNeverInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.claim);
  const options: Option[] = [
    { id: "A", content: [{ t: "text", v: "Always true" }] },
    { id: "B", content: [{ t: "text", v: "Sometimes true" }] },
    { id: "C", content: [{ t: "text", v: "Never true" }] },
  ];
  const correct = { always: "A", sometimes: "B", never: "C" }[input.truth];
  const part = reasonPart(
    "always-sometimes-never",
    c,
    "Is this always, sometimes or never true?",
    options,
    correct,
    input.reasons,
    input.rng,
    input.marks,
  );
  return draft("always-sometimes-never", c, stem, [part], input);
}

export interface TrueOrFalseWhyInput extends Common {
  statement: RichInput;
  truth: boolean;
  reasons: Reason[];
  rng: Rng;
}

/** Depth 4. Judge a statement and pick the reason. */
export function trueOrFalseWhy(input: TrueOrFalseWhyInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.statement);
  const options: Option[] = [
    { id: "A", content: [{ t: "text", v: "True" }] },
    { id: "B", content: [{ t: "text", v: "False" }] },
  ];
  const part = reasonPart(
    "true-or-false-why",
    c,
    "Is this true or false?",
    options,
    input.truth ? "A" : "B",
    input.reasons,
    input.rng,
    input.marks,
  );
  return draft("true-or-false-why", c, stem, [part], input);
}

export interface OddOneOutInput extends Common {
  question?: RichInput;
  /** Exactly one item is the odd one out. */
  items: { content: RichInput; odd?: boolean }[];
  reasons: Reason[];
  rng: Rng;
}

/** Depth 4. Find the item that breaks the pattern, and say why. */
export function oddOneOut(input: OddOneOutInput): QuestionDraft {
  const odd = input.items.filter((i) => i.odd);
  if (odd.length !== 1)
    throw new ArchetypeError("odd-one-out", `needs exactly one odd item, not ${odd.length}`);
  const c = new Collector();
  const stem = c.rich(input.question ?? "Which is the odd one out?");
  const ordered = lettered(input.rng, input.items);
  const options = ordered.map(({ item, id }) => ({ id, content: c.rich(item.content) }));
  const correct = ordered.find(({ item }) => item.odd)?.id ?? "A";
  const part = reasonPart(
    "odd-one-out",
    c,
    "Choose the odd one out and the reason.",
    options,
    correct,
    input.reasons,
    input.rng,
    input.marks,
  );
  return draft("odd-one-out", c, stem, [part], input);
}

// --- representations ------------------------------------------------------------------------

export interface MatchRepresentationsInput extends Common {
  question?: RichInput;
  /** Pairs that belong together, e.g. a diagram and its description. */
  pairs: [RichInput, RichInput][];
  rng: Rng;
}

/** Depth 3. Match symbols, diagrams and words. */
export function matchRepresentations(input: MatchRepresentationsInput): QuestionDraft {
  if (input.pairs.length < 2)
    throw new ArchetypeError("match-representations", "needs at least two pairs");
  const c = new Collector();
  const stem = c.rich(input.question ?? "Match each one on the left to one on the right.");
  const left = input.pairs.map(([l], i) => ({ id: String(i + 1), content: c.rich(l) }));
  const right = lettered(
    input.rng,
    input.pairs.map(([, r]) => r),
  );
  const rightOptions = right.map(({ item, id }) => ({ id, content: c.rich(item) }));
  const correct = input.pairs.map((_, i): [string, string] => [
    String(i + 1),
    right.find((r) => r.original === i)?.id ?? "",
  ]);
  return draft(
    "match-representations",
    c,
    stem,
    [
      {
        prompt: [],
        answer: { type: "match", left, right: rightOptions, correct },
        misconceptions: [],
        marks: input.marks ?? input.pairs.length - 1,
      },
    ],
    input,
  );
}

export interface DrawOrPlotInput extends Common {
  question: RichInput;
  /** What the student should end up with. */
  target: DiagramSpec;
  /** How far a drawn point or line may be from the target, in the target's units. */
  tolerance: number;
  /** The starting canvas: a grid, a half-drawn shape, a protractor. */
  canvas?: DiagramSpec;
}

/** Depth 3. Plot, shade or construct. Marked interactively from Phase 5. */
export function drawOrPlot(input: DrawOrPlotInput): QuestionDraft {
  const c = new Collector();
  const stem = c.rich(input.canvas ? [input.question, figure(input.canvas)] : input.question);
  return draft(
    "draw-or-plot",
    c,
    stem,
    [
      {
        prompt: [],
        answer: { type: "plot", target: input.target, tolerance: input.tolerance },
        misconceptions: [],
        ...(input.marks === undefined ? {} : { marks: input.marks }),
      },
    ],
    input,
  );
}

// --- problem solving ------------------------------------------------------------------------

export interface OpenConstructionInput extends Common {
  question: RichInput;
  /** What the student enters, e.g. two angles. */
  inputs: ConditionInput[];
  /** The conditions, for the mark scheme. */
  describe: RichInput;
  check: Validator;
  /** Whether a solution exists for these parameters; if not, new parameters are drawn. */
  exists: boolean;
  /** One valid answer, shown in the worked solution. */
  example?: RichInput;
}

/** Depth 5. Find an example that meets conditions; marked by checking the conditions. */
export function openConstruction(input: OpenConstructionInput): QuestionDraft {
  if (!input.exists) reject("open-construction: no solution exists for these parameters");
  const c = new Collector();
  const stem = c.rich(input.question);
  return draft(
    "open-construction",
    c,
    stem,
    [
      {
        prompt: [],
        answer: {
          type: "condition",
          inputs: input.inputs,
          describe: c.rich(input.describe),
          check: input.check,
        },
        misconceptions: [],
        marks: input.marks ?? 2,
      },
    ],
    {
      ...input,
      solution:
        input.solution ?? (input.example ? [{ say: ["For example: ", input.example] }] : []),
    },
  );
}

export interface MultiStepInput extends Common {
  /** The situation, with any figures. */
  context: RichInput;
  /** Parts in order; labelled (a), (b)… when there is more than one. */
  parts: { ask: RichInput; answer: Answer; wrong?: Wrong[]; marks?: number }[];
}

/** Depth 5. A non-routine problem that chains steps, often using prerequisites. */
export function multiStepContext(input: MultiStepInput): QuestionDraft {
  if (input.parts.length === 0)
    throw new ArchetypeError("multi-step-context", "needs at least one part");
  const c = new Collector();
  const stem = c.rich(input.context);
  const labelled = input.parts.length > 1;
  return draft(
    "multi-step-context",
    c,
    stem,
    input.parts.map((p, i) => ({
      ...(labelled ? { label: `(${String.fromCharCode(97 + i)})` } : {}),
      prompt: c.rich(p.ask),
      answer: toAnswerSpec(p.answer),
      misconceptions: misconceptions(c, p.wrong),
      ...(p.marks === undefined ? {} : { marks: p.marks }),
    })),
    input,
  );
}

// --- choice-marked versions of the single-answer archetypes ---------------------------------

export interface ChoiceInput extends Common {
  question: RichInput;
  ask?: RichInput;
  /** The right option. */
  correct: RichInput;
  /** Wrong options, each ideally tied to a misconception. */
  distractors: Distractor[];
  rng: Rng;
  /** Which single-answer pattern this is; marked by choice rather than by a typed value. */
  archetype?: "standard" | "varied-form" | "reverse";
}

/** A direct question answered by choosing, e.g. naming a shape or an angle type. */
export function choice(input: ChoiceInput): QuestionDraft {
  const archetype = input.archetype ?? "standard";
  const c = new Collector();
  const stem = c.rich(input.question);
  const part = choicePart(
    c,
    { correct: input.correct, distractors: input.distractors, rng: input.rng },
    input.ask ?? [],
    input.marks,
  );
  return draft(archetype, c, stem, [part], input);
}
