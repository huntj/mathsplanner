/**
 * @statement Y5-MD-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-07.a: Multiply and divide whole numbers by 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-07.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-MD-07.a",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, d: 0 };
  },
});
