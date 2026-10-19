// Import rules that come from the map itself rather than the ID scheme.
import type { FurtherMathsOption, Stage } from "@mathsplanner/core";

/** Option column wording in the map, mapped to option codes. */
export const OPTION_NAMES: Record<string, FurtherMathsOption> = {
  "Further Pure 1": "FP1",
  "Further Pure 2": "FP2",
  "Further Statistics 1": "FS1",
  "Further Statistics 2": "FS2",
  "Further Mechanics 1": "FM1",
  "Further Mechanics 2": "FM2",
  "Decision Maths 1": "D1",
  "Decision Maths 2": "D2",
};

/**
 * Whether a statement is statutory: national curriculum content (Y1 to Y9) and the Reception
 * Early Learning Goals. Nursery (Development Matters) and every qualification specification are not.
 */
export function isStatutory(stage: Stage, text: string): boolean {
  if (/^Y[1-9]$/.test(stage)) return true;
  if (stage === "R") return /\bELG\b/.test(text);
  return false;
}
