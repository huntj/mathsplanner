/**
 * @statement Y6-GEO-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-03.c: Find unknown angles in quadrilaterals
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-GEO-03.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y6-GEO-03.c",
  depths: [1, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.angles.length !== 4) reject("a question for this step");
    return { ...p, claim: 1 };
  },
});
