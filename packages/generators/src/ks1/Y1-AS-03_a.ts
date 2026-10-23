/**
 * @statement Y1-AS-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-03.a: Add one-digit numbers within 20, including zero
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y1-AS-03.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-AS-03.a",
  params(rng, numbers) {
    const p = { ...def.params(rng, numbers), add: true };
    if (p.a > 9 || p.a + p.b > 20) reject("two one-digit numbers");
    return p;
  },
});
