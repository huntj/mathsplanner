/**
 * @statement Y2-MEA-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-02.b: Compare and order masses
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-MEA-02.b",
  depths: [1, 2],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), unit: rng.pick([1, 3]) }),
});
