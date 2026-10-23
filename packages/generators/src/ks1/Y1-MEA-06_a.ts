/**
 * @statement Y1-MEA-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-06.a: Tell the time to the hour
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y1-MEA-06.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-MEA-06.a",
  depths: [1, 3],
  params(rng, numbers) {
    const p = { ...def.params(rng, numbers), half: false };
    // An hour later than 11 o'clock is 12 o'clock, which is already a wrong option.
    if (p.hour === 11) reject("distinct options");
    return p;
  },
});
