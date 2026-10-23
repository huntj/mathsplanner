/**
 * @statement Y5-MD-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-08.a: Recognise and use square numbers and ²
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-08.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-MD-08.a",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, power: 2 as const, n: rng.int(3, numbers === "stretch" ? 15 : 12) };
  },
});
