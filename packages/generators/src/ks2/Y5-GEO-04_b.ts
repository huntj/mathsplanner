/**
 * @statement Y5-GEO-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-GEO-04.b: Use angles at a point (360°)
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-GEO-04.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-GEO-04.b",
  depths: [1, 2, 3, 4, 5],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.kind !== "point") reject("a question for this step");
    return p;
  },
});
