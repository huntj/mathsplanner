/**
 * @statement Y6-MEA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-02.a: Convert between units of length and mass
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-MEA-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y6-MEA-02.a",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.kind < 1 || p.kind > 3) reject("a question for this step");
    return p;
  },
});
