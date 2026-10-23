/**
 * @statement Y5-MD-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-07.b: Multiply and divide decimals by 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-07.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-MD-07.b",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, d: p.d || 1 };
  },
});
