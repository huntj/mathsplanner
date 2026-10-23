/**
 * @statement Y5-FR-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-05.a: Multiply proper fractions by whole numbers
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-05.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-FR-05.a",
  depths: [1, 2, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, w: 0 };
  },
});
