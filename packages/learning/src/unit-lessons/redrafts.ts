// Lessons redrafted with variation in their learning stage (docs/proposals/lesson-variation.md):
// a method card, an example beside a question like it, a faded example, a set that changes one
// thing at a time, and a set that moves the unknown. Each redraft is keyed by the id of the lesson
// it replaces, and may split it into several. Teachers see redrafts in place of the originals.
// Pupils see a redraft too once its id is in LIVE_REDRAFTS: the owner's choice for the pilot is
// that its lessons go to pupils each time they improve.
import { circleTheorems } from "./redraft-gh-circle-theorems.ts";
import { pilotRedrafts } from "./redraft-pilot.ts";
import type { UnitLesson } from "./types.ts";

export const REDRAFTS: ReadonlyMap<string, UnitLesson[]> = new Map<string, UnitLesson[]>([
  ["gh-circles/circle-theorems", circleTheorems],
  ...pilotRedrafts,
]);

/** Redrafts pupils see as well as teachers, by the id of the lesson they replace. */
export const LIVE_REDRAFTS: ReadonlySet<string> = new Set([
  "gh-circles/circle-theorems",
  "y7-angles/half-turn",
  "y7-fdp/percentages",
  "y8-area/circle-area",
  "y9-trigonometry/sine",
  "gf-ratio-1/part-part",
]);
