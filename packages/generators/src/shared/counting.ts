// Counting pictures for early number, and reading their counts back for verify.
import type { DiagramSpec, Question } from "@mathsplanner/core";
import type { CounterArrangement, CounterShape, CountersSpec } from "@mathsplanner/diagrams";

/** A neutral description for a picture whose count is the answer, so it is not given away. */
export const TO_COUNT = "A group of objects to count.";

export const SHAPES: CounterShape[] = ["circle", "star", "square", "triangle"];
export const SHAPE_PLURAL: Record<CounterShape, string> = {
  circle: "counters",
  star: "stars",
  square: "squares",
  triangle: "triangles",
};

export function objects(
  n: number,
  options: {
    shape?: CounterShape;
    arrangement?: CounterArrangement;
    seed?: number;
    second?: number;
    hidden?: boolean;
  } = {},
): CountersSpec {
  const { second = 0 } = options;
  return {
    type: "counters",
    layout: "objects",
    counts: second ? [n - second, second] : [n],
    shape: options.shape ?? "circle",
    arrangement: options.arrangement ?? "row",
    ...(options.seed === undefined ? {} : { seed: options.seed }),
    ...(options.hidden ? { description: TO_COUNT } : {}),
  };
}

/** Counters in ten frames, as many full frames as needed; `second` outlines the last few. */
export function tenFrames(
  n: number,
  options: { second?: number; hidden?: boolean } = {},
): CountersSpec {
  const frames: number[] = [];
  for (let left = n; left > 0 || frames.length === 0; left -= 10)
    frames.push(Math.min(10, Math.max(0, left)));
  const second = options.second
    ? frames.map((f, i) => (i === frames.length - 1 ? Math.min(f, options.second ?? 0) : 0))
    : undefined;
  return {
    type: "counters",
    layout: "ten-frame",
    frames,
    ...(second ? { second } : {}),
    ...(options.hidden ? { description: "Counters in ten frames, to count." } : {}),
  };
}

export const fingers = (n: number, hidden = false): CountersSpec => ({
  type: "counters",
  layout: "fingers",
  count: n,
  ...(hidden ? { description: "Hands holding up some fingers, to count." } : {}),
});

export const tally = (n: number, hidden = false): CountersSpec => ({
  type: "counters",
  layout: "tally",
  count: n,
  ...(hidden ? { description: "Tally marks, to count." } : {}),
});

export const partWhole = (whole: string, parts: string[]): CountersSpec => ({
  type: "counters",
  layout: "part-whole",
  whole,
  parts,
});

/** What one counter or block is worth in each place-value column. */
export const PLACE_VALUE: Record<string, number> = {
  HTh: 100_000,
  TTh: 10_000,
  Th: 1000,
  H: 100,
  T: 10,
  O: 1,
};

/** A number as place-value counters (or base-10 blocks), one column per digit. */
export function placeValue(
  n: number,
  options: { style?: "counters" | "blocks"; columns?: string[]; hidden?: boolean } = {},
): CountersSpec {
  const columns =
    options.columns ??
    (n >= 1000 ? ["Th", "H", "T", "O"] : n >= 100 ? ["H", "T", "O"] : ["T", "O"]);
  const counts = columns.map((c) => Math.floor(n / (PLACE_VALUE[c] ?? 1)) % 10);
  return {
    type: "counters",
    layout: "place-value",
    columns,
    counts,
    ...(options.style ? { style: options.style } : {}),
    ...(options.hidden
      ? { description: `A place-value chart with columns ${columns.join(", ")}, showing a number.` }
      : {}),
  };
}

/** How many things a counting picture shows, read from the spec rather than the parameters. */
export function countOf(spec: DiagramSpec | undefined): number {
  const s = spec as CountersSpec | undefined;
  if (!s || s.type !== "counters") return Number.NaN;
  switch (s.layout) {
    case "objects":
      return s.counts.reduce((a, b) => a + b, 0);
    case "ten-frame":
      return s.frames.reduce((a, b) => a + b, 0);
    case "array":
      return s.rows * s.columns;
    case "fingers":
    case "tally":
      return s.count;
    case "place-value":
      return s.counts.reduce(
        (sum, c, i) => sum + c * (PLACE_VALUE[s.columns[i] ?? ""] ?? Number.NaN),
        0,
      );
    default:
      return Number.NaN;
  }
}

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** A whole number from 0 to 999 999 in words, British style: "three hundred and five". */
export function numberWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999_999) throw new RangeError(`no words for ${n}`);
  if (n < 20) return WORDS[n] ?? "";
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${WORDS[n % 10]}` : ""}`;
  if (n < 1000) {
    const rest = n % 100;
    return `${WORDS[Math.floor(n / 100)]} hundred${rest ? ` and ${numberWords(rest)}` : ""}`;
  }
  const rest = n % 1000;
  const joiner = rest === 0 ? "" : rest < 100 ? " and " : " ";
  return `${numberWords(Math.floor(n / 1000))} thousand${rest ? `${joiner}${numberWords(rest)}` : ""}`;
}

/** The picture chosen as correct in a choose-the-diagram question. */
export function chosenFigure(question: Question): DiagramSpec | undefined {
  const answer = question.parts[0]?.answer;
  if (answer?.type !== "choice") return undefined;
  const node = answer.options
    .find((o) => o.id === answer.correct)
    ?.content.find((n) => n.t === "diagram");
  return node?.t === "diagram" ? question.diagrams[node.i] : undefined;
}

/** The text of the option chosen as correct, for checking a choice question. */
export function chosenText(question: Question, part = 0): string {
  const answer = question.parts[part]?.answer;
  if (answer?.type !== "choice") return "";
  const option = answer.options.find((o) => o.id === answer.correct);
  return (option?.content ?? []).map((n) => (n.t === "diagram" ? "" : n.v)).join("");
}

/** The number a question's first part expects, or NaN. */
export const numberAnswer = (question: Question, part = 0): number => {
  const answer = question.parts[part]?.answer;
  return answer?.type === "number" ? answer.value : Number.NaN;
};

/** The LaTeX a question's exact-answer part expects, or "". */
export const exactAnswer = (question: Question, part = 0): string => {
  const answer = question.parts[part]?.answer;
  return answer?.type === "exact" ? answer.value : "";
};
