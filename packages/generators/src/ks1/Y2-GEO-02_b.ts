/**
 * @statement Y2-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-GEO-02.b: Count the edges and vertices of 3D shapes
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-GEO-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-GEO-02.b",
  depths: [1, 4],
  params: (rng, numbers) => ({
    ...def.params(rng, numbers),
    ask: rng.pick(["edges", "vertices"] as const),
  }),
});
