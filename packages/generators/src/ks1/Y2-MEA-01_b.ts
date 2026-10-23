/**
 * @statement Y2-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.b: Measure mass in kg and g
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-MEA-01.b",
  depths: [1, 4],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), kind: "scales" as const }),
});
