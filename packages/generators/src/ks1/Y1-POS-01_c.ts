/**
 * @statement Y1-POS-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-POS-01.c: Describe quarter and three-quarter turns
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y1-POS-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-POS-01.c",
  version: "1.0.0",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, quarters: rng.pick([1, 3] as const) };
  },
});
