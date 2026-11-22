// Lessons redrafted with variation in their learning stage (docs/proposals/lesson-variation.md):
// a method card, an example beside a question like it, a faded example, a set that changes one
// thing at a time, and a set that moves the unknown. Each redraft is keyed by the id of the lesson
// it replaces, and may split it into several. Teachers see redrafts in place of the originals.
// Pupils see a redraft too once its id is in LIVE_REDRAFTS: the owner's choice for the pilot is
// that its lessons go to pupils each time they improve.
import { circleTheorems } from "./redraft-gh-circle-theorems.ts";
import { pilotRedrafts } from "./redraft-pilot.ts";
import { y7AnglesStepped } from "./redraft-y7-angles.ts";
import { y7CalculatingStepped } from "./redraft-y7-calculating.ts";
import { y7EquationsStepped } from "./redraft-y7-equations.ts";
import { y7FactorsStepped } from "./redraft-y7-factors.ts";
import { y7FdpStepped } from "./redraft-y7-fdp.ts";
import { y7NotationStepped } from "./redraft-y7-notation.ts";
import { y7OrderStepped } from "./redraft-y7-order.ts";
import { y7PlaceValueStepped } from "./redraft-y7-place-value.ts";
import { y7PowersStepped } from "./redraft-y7-powers.ts";
import { y7RatioStepped } from "./redraft-y7-ratio.ts";
import { y7RoundingStepped } from "./redraft-y7-rounding.ts";
import { y7SimplifyingStepped } from "./redraft-y7-simplifying.ts";
import type { UnitLesson } from "./types.ts";

/**
 * Lessons rebuilt on the stepped template in the year-by-year rollout
 * (docs/proposals/lesson-stepped.md). The owner approved the template for every lesson, so these
 * go to pupils as soon as they are merged.
 */
const ROLLOUT: [string, UnitLesson[]][] = [
  ...y7PlaceValueStepped,
  ...y7RoundingStepped,
  ...y7PowersStepped,
  ...y7OrderStepped,
  ...y7SimplifyingStepped,
  ...y7FactorsStepped,
  ...y7CalculatingStepped,
  ...y7FdpStepped,
  ...y7RatioStepped,
  ...y7EquationsStepped,
  ...y7NotationStepped,
  ...y7AnglesStepped,
];

export const REDRAFTS: ReadonlyMap<string, UnitLesson[]> = new Map<string, UnitLesson[]>([
  ["gh-circles/circle-theorems", circleTheorems],
  ...pilotRedrafts,
  ...ROLLOUT,
]);

/** Redrafts pupils see as well as teachers, by the id of the lesson they replace. */
export const LIVE_REDRAFTS: ReadonlySet<string> = new Set([
  "gh-circles/circle-theorems",
  "y7-angles/half-turn",
  "y7-fdp/percentages",
  "y8-area/circle-area",
  "y9-trigonometry/sine",
  "gf-ratio-1/part-part",
  ...ROLLOUT.map(([id]) => id),
]);
