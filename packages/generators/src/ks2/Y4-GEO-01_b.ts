/**
 * @statement Y4-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-GEO-01.b: Classify quadrilaterals by their properties
import { defineGenerator } from "@mathsplanner/core";
import type { ShapeKind } from "@mathsplanner/diagrams";
import { QUADRILATERALS } from "../shared/shapes.ts";
import parent, { RIDDLES } from "./Y4-GEO-01.ts";

const def = parent.definition;
const POOL: ShapeKind[] = QUADRILATERALS.filter((k) => k !== "square");
const RIDDLE_POOL = RIDDLES.map((r, i) => (POOL.includes(r.kind) ? i : -1)).filter((i) => i >= 0);

export default defineGenerator({
  ...def,
  id: "Y4-GEO-01.b",
  depths: [1, 2, 4],
  params: (rng, numbers) => ({
    ...def.params(rng, numbers),
    kind: rng.pick(POOL),
    riddle: rng.pick(RIDDLE_POOL),
    claim: rng.pick([0, 1, 2]),
  }),
});
