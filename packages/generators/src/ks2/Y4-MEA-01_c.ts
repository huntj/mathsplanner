/**
 * @statement Y4-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-01.c: Convert between units of time
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-MEA-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y4-MEA-01.c",
  depths: [1, 2, 4],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), pair: rng.pick([5, 6]) }),
});
