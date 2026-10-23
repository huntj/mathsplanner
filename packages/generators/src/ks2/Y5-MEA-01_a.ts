/**
 * @statement Y5-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-01.a: Convert between km, m, cm and mm
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-MEA-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-MEA-01.a",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.pair > 2) reject("a question for this step");
    return p;
  },
});
