// Lessons redrafted with variation in their learning stage (docs/proposals/lesson-variation.md):
// a method card, an example beside a question like it, a faded example, a set that changes one
// thing at a time, and a set that moves the unknown. Each redraft is keyed by the id of the lesson
// it replaces, and may split it into several. Teachers see redrafts in place of the originals.
// Pupils see a redraft too once its id is in LIVE_REDRAFTS: the owner's choice for the pilot is
// that its lessons go to pupils each time they improve.
import { circleTheorems } from "./redraft-gh-circle-theorems.ts";
import { gfCalculationStepped } from "./redraft-gf-calculation.ts";
import { pilotRedrafts } from "./redraft-pilot.ts";
import { y7AnglesStepped } from "./redraft-y7-angles.ts";
import { y7AreaStepped } from "./redraft-y7-area.ts";
import { y7AveragesStepped } from "./redraft-y7-averages.ts";
import { y7CalculatingStepped } from "./redraft-y7-calculating.ts";
import { y7EquationsStepped } from "./redraft-y7-equations.ts";
import { y7FactorsStepped } from "./redraft-y7-factors.ts";
import { y7FdpStepped } from "./redraft-y7-fdp.ts";
import { y7LinesStepped } from "./redraft-y7-lines.ts";
import { y7MeasuresStepped } from "./redraft-y7-measures.ts";
import { y7NotationStepped } from "./redraft-y7-notation.ts";
import { y7OrderStepped } from "./redraft-y7-order.ts";
import { y7PlaceValueStepped } from "./redraft-y7-place-value.ts";
import { y7PowersStepped } from "./redraft-y7-powers.ts";
import { y7ProbabilityStepped } from "./redraft-y7-probability.ts";
import { y7RatioStepped } from "./redraft-y7-ratio.ts";
import { y7RoundingStepped } from "./redraft-y7-rounding.ts";
import { y7SimplifyingStepped } from "./redraft-y7-simplifying.ts";
import { y8ConstructionsStepped } from "./redraft-y8-constructions.ts";
import { y8DataStepped } from "./redraft-y8-data.ts";
import { y8EquationsStepped } from "./redraft-y8-equations.ts";
import { y8GraphsStepped } from "./redraft-y8-graphs.ts";
import { y8MeasureStepped } from "./redraft-y8-measure.ts";
import { y8NumberStepped } from "./redraft-y8-number.ts";
import { y8RatesStepped } from "./redraft-y8-rates.ts";
import { y8ShapesStepped } from "./redraft-y8-shapes.ts";
import { y8TransformationsStepped } from "./redraft-y8-transformations.ts";
import { y9EquationsStepped } from "./redraft-y9-equations.ts";
import { y9FactorisingStepped } from "./redraft-y9-factorising.ts";
import { y9GraphsStepped } from "./redraft-y9-graphs.ts";
import { y9IndicesStepped } from "./redraft-y9-indices.ts";
import { y9ProbabilityStepped } from "./redraft-y9-probability.ts";
import { y9SimilarityStepped } from "./redraft-y9-similarity.ts";
import { y9StraightLineStepped } from "./redraft-y9-straight-line.ts";
import { y9TrigonometryStepped } from "./redraft-y9-trigonometry.ts";
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
  ...y7MeasuresStepped,
  ...y7LinesStepped,
  ...y7AreaStepped,
  ...y7AveragesStepped,
  ...y7ProbabilityStepped,
  ...y8NumberStepped,
  ...y8MeasureStepped,
  ...y8EquationsStepped,
  ...y8ShapesStepped,
  ...y8GraphsStepped,
  ...y8RatesStepped,
  ...y8ConstructionsStepped,
  ...y8TransformationsStepped,
  ...y8DataStepped,
  ...y9IndicesStepped,
  ...y9SimilarityStepped,
  ...y9FactorisingStepped,
  ...y9StraightLineStepped,
  ...y9TrigonometryStepped,
  ...y9EquationsStepped,
  ...y9GraphsStepped,
  ...y9ProbabilityStepped,
  ...gfCalculationStepped,
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
