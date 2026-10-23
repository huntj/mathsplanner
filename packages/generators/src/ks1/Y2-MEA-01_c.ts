/**
 * @statement Y2-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.c: Measure temperature in °C
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-MEA-01.c",
  depths: [1, 4],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), kind: "thermometer" as const }),
});
