/**
 * @statement Y2-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.a: Count in steps of 2 and 5 from 0
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-NPV-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-NPV-01.a",
  depths: [1, 3, 4],
  params: (rng, numbers) => ({
    ...def.params(rng, numbers),
    step: rng.pick([2, 5] as const),
    claim: rng.int(0, 1),
  }),
});
