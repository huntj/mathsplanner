/**
 * @statement Y4-AS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-AS-01.b: Subtract numbers with up to 4 digits using column subtraction
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y4-AS-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y4-AS-01.b",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.op !== "subtract") reject("subtraction only");
    return p;
  },
});
