/**
 * @statement Y4-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-01.a: Convert between units of length
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-MEA-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y4-MEA-01.a",
  depths: [1, 2, 4],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), pair: rng.pick([0, 1, 2]) }),
});
