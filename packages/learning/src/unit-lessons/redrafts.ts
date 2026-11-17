// Lessons redrafted with variation in their learning stage (docs/proposals/lesson-variation.md):
// a method card, an example beside a question like it, a faded example, a set that changes one
// thing at a time, and a set that moves the unknown. Each redraft is keyed by the id of the lesson
// it replaces, and may split it into several. Teachers see redrafts in place of the originals;
// once approved, a redraft moves into its unit's file and its entry here goes.
import { circleTheorems } from "./redraft-gh-circle-theorems.ts";
import { pilotRedrafts } from "./redraft-pilot.ts";
import type { UnitLesson } from "./types.ts";

export const REDRAFTS: ReadonlyMap<string, UnitLesson[]> = new Map<string, UnitLesson[]>([
  ["gh-circles/circle-theorems", circleTheorems],
  ...pilotRedrafts,
]);
