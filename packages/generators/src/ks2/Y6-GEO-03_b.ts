/**
 * @statement Y6-GEO-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-03.b: Find unknown angles in triangles
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-GEO-03.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y6-GEO-03.b",
  depths: [1, 2, 5],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.angles.length !== 3) reject("a question for this step");
    return p;
  },
});
