/**
 * @statement Y1-POS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-POS-01.b: Describe whole and half turns
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y1-POS-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-POS-01.b",
  version: "1.0.0",
  depths: [1, 2, 3],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), quarters: 2 as const }),
});
