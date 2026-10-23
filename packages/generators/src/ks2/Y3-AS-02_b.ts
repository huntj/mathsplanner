/**
 * @statement Y3-AS-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-02.b: Subtract numbers with up to three digits using column subtraction
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y3-AS-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y3-AS-02.b",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.op !== "subtract") reject("subtraction only");
    return p;
  },
});
