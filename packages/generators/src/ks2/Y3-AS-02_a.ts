/**
 * @statement Y3-AS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-02.a: Add numbers with up to three digits using column addition
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y3-AS-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y3-AS-02.a",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.op !== "add") reject("addition only");
    return p;
  },
});
