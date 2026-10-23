/**
 * @statement Y2-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-06.b: Tell and write the time to five minutes
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y2-MEA-06.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-MEA-06.b",
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    if (p.minutes % 15 === 0) reject("not a quarter or half hour");
    return p;
  },
});
