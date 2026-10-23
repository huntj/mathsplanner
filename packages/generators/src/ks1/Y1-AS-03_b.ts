/**
 * @statement Y1-AS-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-03.b: Subtract one-digit numbers within 20, including zero
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y1-AS-03.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-AS-03.b",
  params(rng, numbers) {
    const p = { ...def.params(rng, numbers), add: false };
    if (p.b > p.a) reject("answers from 0 up");
    return p;
  },
});
