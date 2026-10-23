/**
 * @statement Y5-GEO-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-GEO-04.a: Use angles on a straight line (180°)
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-GEO-04.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-GEO-04.a",
  depths: [1, 2, 3, 4, 5],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.kind !== "line") reject("a question for this step");
    return p;
  },
});
