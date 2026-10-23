/**
 * @statement Y5-FR-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-05.b: Multiply mixed numbers by whole numbers
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-05.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y5-FR-05.b",
  depths: [1, 4],
  params(rng, numbers) {
    const p = def.params(rng, numbers);
    return { ...p, w: rng.int(1, 3) };
  },
});
