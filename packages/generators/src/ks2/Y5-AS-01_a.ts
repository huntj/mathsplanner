/**
 * @statement Y5-AS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-AS-01.a: Add whole numbers with more than 4 digits using column addition
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-AS-01.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-AS-01.a",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.op !== "add") reject("addition only");
    return p;
  },
});
