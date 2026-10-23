/**
 * @statement Y4-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-GEO-01.a: Classify triangles by their properties
import { defineGenerator } from "@mathsplanner/core";
import type { ShapeKind } from "@mathsplanner/diagrams";
import { TRIANGLES } from "../shared/shapes.ts";
import parent, { RIDDLES } from "./Y4-GEO-01.ts";

const def = parent.definition;
const POOL: ShapeKind[] = TRIANGLES;
const RIDDLE_POOL = RIDDLES.map((r, i) => (POOL.includes(r.kind) ? i : -1)).filter((i) => i >= 0);

export default defineGenerator({
  ...def,
  id: "Y4-GEO-01.a",
  depths: [1, 2, 4],
  params: (rng, numbers) => ({
    ...def.params(rng, numbers),
    kind: rng.pick(POOL),
    riddle: rng.pick(RIDDLE_POOL),
    claim: rng.pick([3]),
  }),
});
