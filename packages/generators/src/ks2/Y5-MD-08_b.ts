/**
 * @statement Y5-MD-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-08.b: Recognise and use cube numbers and ³
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-08.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-MD-08.b",
  depths: [1, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, power: 3 as const, n: rng.int(2, numbers === "stretch" ? 10 : 5) };
  },
});
