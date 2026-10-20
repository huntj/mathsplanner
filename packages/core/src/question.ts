// The Question schema: plain, serialisable JSON with no rendering code, so the same object drives
// the web app, print export and any future consumer. See "Question schema" in docs/design.md.

/** How well the student must understand: fluency (1) to problem solving (5). */
export type Depth = 1 | 2 | 3 | 4 | 5;
export const DEPTHS: readonly Depth[] = [1, 2, 3, 4, 5];

/** How awkward the arithmetic is. */
export type Numbers = "friendly" | "standard" | "stretch";
export const NUMBERS: readonly Numbers[] = ["friendly", "standard", "stretch"];

/** Everything needed to regenerate a question exactly. */
export interface QuestionKey {
  statementId: string;
  depth: Depth;
  numbers: Numbers;
  /** A non-negative safe integer. */
  seed: number;
  /** The generator's version. */
  version: string;
}

export const ARCHETYPES = [
  "standard",
  "missing-value",
  "reverse",
  "varied-form",
  "match-representations",
  "choose-the-diagram",
  "draw-or-plot",
  "spot-the-mistake",
  "explain-the-error",
  "always-sometimes-never",
  "true-or-false-why",
  "odd-one-out",
  "compare-methods",
  "open-construction",
  "multi-step-context",
] as const;
export type ArchetypeId = (typeof ARCHETYPES)[number];

/** Text and maths interleaved; maths is LaTeX, rendered by KaTeX. */
export type RichNode =
  | { t: "text"; v: string }
  | { t: "math"; v: string; display?: boolean }
  | { t: "diagram"; i: number };
export type Rich = RichNode[];

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const DIAGRAM_TYPES = [
  "geometry",
  "cartesian",
  "number-line",
  "bar-model",
  "counters",
  "measure",
  "chart",
  "probability",
  "network",
  "complex",
  "vector",
] as const;
export type DiagramType = (typeof DIAGRAM_TYPES)[number];

/**
 * What to draw; @mathsplanner/diagrams decides how and defines each type's fields. Specs must be
 * plain JSON, which defineGenerator checks.
 */
export interface DiagramSpec {
  type: DiagramType;
  [field: string]: unknown;
}

/** One option in a choice, multi-select, order or match answer. */
export interface Option {
  id: string;
  content: Rich;
}

/**
 * Exact required forms for `exact` answers. A right value in the wrong form gets a specific
 * message rather than a cross.
 */
export type AnswerForm =
  | "simplest"
  | "mixed-number"
  | "improper"
  | "factorised"
  | "expanded"
  | "standard-form"
  | "surd"
  | "decimal";

export type Accuracy = { exact: true } | { tolerance: number } | { dp: number } | { sf: number };

/**
 * Decides both the input widget and how a response is marked. Values are LaTeX strings or
 * numbers so the Question stays plain JSON. Marking rules arrive with Phase 5.
 */
export type AnswerSpec =
  | { type: "number"; value: number; accuracy: Accuracy; units?: string }
  | { type: "exact"; value: string; form?: AnswerForm }
  | { type: "coordinate"; x: string; y: string; tolerance?: number }
  | { type: "choice"; options: Option[]; correct: string }
  | { type: "multi-select"; options: Option[]; correct: string[]; partialCredit?: boolean }
  | {
      type: "choice-with-reason";
      options: Option[];
      correct: string;
      reasons: Option[];
      correctReason: string;
    }
  | { type: "order"; options: Option[]; correct: string[] }
  | { type: "match"; left: Option[]; right: Option[]; correct: [string, string][] }
  | {
      type: "plot";
      target: DiagramSpec;
      tolerance: number;
      /**
       * What the student places: named points of a geometry target (in its units), or "arm" for
       * the free end of a protractor's second arm (tolerance in degrees).
       */
      place: string[];
    }
  | { type: "condition"; inputs: ConditionInput[]; describe: Rich }
  | { type: "free-text"; markScheme: Rich };

/** What a `condition` part asks for; a validator function checks the conditions. */
export type ConditionInput = "number" | "exact" | "coordinate";

/** A response, or the wrong answer a misconception produces. */
export type AnswerValue =
  | { type: "number"; value: number }
  | { type: "exact"; latex: string }
  | { type: "coordinate"; x: string; y: string }
  | { type: "choice"; id: string }
  | { type: "choices"; ids: string[] }
  | { type: "choice-with-reason"; id: string; reason: string }
  | { type: "order"; ids: string[] }
  | { type: "match"; pairs: [string, string][] }
  | { type: "values"; values: AnswerValue[] }
  /** Points placed on a plot, by the names in its `place` list. */
  | { type: "points"; points: Record<string, [number, number]> }
  | { type: "text"; text: string };

/**
 * A predictable wrong answer. In a choice-with-reason part, a `choice` answer names a wrong reason,
 * whichever option goes with it.
 */
export interface Misconception {
  /** A code from data/misconceptions.json, e.g. "FR.ADD.TOPS-AND-BOTTOMS". */
  code: string;
  answer: AnswerValue;
  feedback: Rich;
  /** Statement ID to step back to. */
  remediate?: string;
}

export interface Part {
  /** "(a)" */
  label?: string;
  prompt: Rich;
  answer: AnswerSpec;
  marks: number;
  misconceptions: Misconception[];
}

export interface SolutionStep {
  say: Rich;
  math?: string;
  /** Index into Question.diagrams. */
  diagram?: number;
}

export interface QuestionMeta {
  calculator: boolean;
  marks: number;
  minutes: number;
  tags: string[];
}

export interface Question {
  key: QuestionKey;
  archetype: ArchetypeId;
  stem: Rich;
  /** Referenced from Rich nodes by index. */
  diagrams: DiagramSpec[];
  parts: Part[];
  solution: SolutionStep[];
  meta: QuestionMeta;
}
