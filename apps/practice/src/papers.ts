// Year tests and unit tests. A year test draws from every statement in one year (or course); a
// unit test draws from one topic across the years chosen. Topics group the strands of every stage,
// since each stage names its strands differently (NPV and FR in the primary years, N in GCSE,
// P1 to P10 for A level pure).
import type { Statement } from "@mathsplanner/core";

export const STAGE_NAMES: Record<string, string> = {
  N: "Nursery",
  R: "Reception",
  Y1: "Year 1",
  Y2: "Year 2",
  Y3: "Year 3",
  Y4: "Year 4",
  Y5: "Year 5",
  Y6: "Year 6",
  Y7: "Year 7",
  Y8: "Year 8",
  Y9: "Year 9",
  GF: "GCSE Foundation",
  GH: "GCSE Higher",
  AL: "A level Maths",
  FM: "Further Maths",
  CM: "Core Maths",
};

export const stageName = (stage: string) => STAGE_NAMES[stage] ?? stage;

export const TOPICS = [
  { id: "number", name: "Number" },
  { id: "algebra", name: "Algebra" },
  { id: "ratio", name: "Ratio and proportion" },
  { id: "geometry", name: "Geometry and measures" },
  { id: "statistics", name: "Statistics" },
  { id: "probability", name: "Probability" },
  { id: "calculus", name: "Calculus" },
  { id: "mechanics", name: "Mechanics" },
  { id: "further-pure", name: "Further pure" },
  { id: "decision", name: "Decision maths" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

export const topicName = (id: string) => TOPICS.find((t) => t.id === id)?.name ?? id;

const PRIMARY: Record<string, TopicId> = {
  NPV: "number",
  AS: "number",
  MD: "number",
  FR: "number",
  ALG: "algebra",
  PAT: "algebra",
  RAT: "ratio",
  GEO: "geometry",
  POS: "geometry",
  MEA: "geometry",
  STA: "statistics",
  PRO: "probability",
};
const GCSE: Record<string, TopicId> = {
  N: "number",
  A: "algebra",
  R: "ratio",
  G: "geometry",
  P: "probability",
  S: "statistics",
};
const A_LEVEL: Record<string, TopicId> = {
  P1: "algebra",
  P2: "algebra",
  P3: "algebra",
  P4: "algebra",
  P5: "geometry",
  P6: "algebra",
  P7: "calculus",
  P8: "calculus",
  P9: "calculus",
  P10: "geometry",
  S1: "statistics",
  S2: "statistics",
  S3: "probability",
  S4: "probability",
  S5: "statistics",
  M6: "mechanics",
  M7: "mechanics",
  M8: "mechanics",
  M9: "mechanics",
};
const FURTHER: Record<string, TopicId> = {
  CP: "further-pure",
  FP1: "further-pure",
  FP2: "further-pure",
  FS1: "statistics",
  FS2: "statistics",
  FM1: "mechanics",
  FM2: "mechanics",
  D1: "decision",
  D2: "decision",
};
const CORE: Record<string, TopicId> = {
  A: "statistics",
  P: "probability",
  LP: "algebra",
  SG: "algebra",
};

/** The topic a statement belongs to, for unit tests. */
export function topicOf(s: Pick<Statement, "stage" | "strand">): TopicId | undefined {
  const table =
    s.stage === "GF" || s.stage === "GH"
      ? GCSE
      : s.stage === "AL"
        ? A_LEVEL
        : s.stage === "FM"
          ? FURTHER
          : s.stage === "CM"
            ? CORE
            : PRIMARY;
  return table[s.strand];
}

/**
 * The statements a year test draws from. A GCSE Higher paper also covers the content both tiers
 * share, so it includes the Foundation statements.
 */
export function yearPool(statements: readonly Statement[], stage: string): string[] {
  const stages = stage === "GH" ? ["GF", "GH"] : [stage];
  return statements.filter((s) => stages.includes(s.stage)).map((s) => s.id);
}

/** The statements a unit test draws from: one topic in the chosen stages. */
export function unitPool(
  statements: readonly Statement[],
  topic: string,
  stages: readonly string[],
): string[] {
  return statements
    .filter((s) => stages.includes(s.stage) && topicOf(s) === topic)
    .map((s) => s.id);
}
