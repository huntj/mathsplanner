/**
 * @statement Y4-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-06.b: Convert years to months and weeks to days
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y4-MEA-06.ts";

const def = parent.definition;
const PER = [60, 60, 12, 7];

export default defineGenerator({
  ...def,
  id: "Y4-MEA-06.b",
  depths: [1, 2],
  params(rng, numbers) {
    const kind = rng.pick([2, 3]);
    const p = { ...def.params(rng, numbers), kind };
    if (p.small >= (PER[kind] ?? 60)) reject("fewer than one of the bigger unit");
    return p;
  },
});
