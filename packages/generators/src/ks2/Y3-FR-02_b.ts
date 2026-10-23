/**
 * @statement Y3-FR-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-FR-02.b: Find non-unit fractions of a set of objects
import { defineGenerator, reject } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

const base = fractionOfAmount(
  "Y3-FR-02.b",
  { friendly: [3, 4], standard: [3, 4, 5, 8], stretch: [3, 4, 5, 6, 8] },
  { friendly: true, standard: true, stretch: true },
  { friendly: 5, standard: 10, stretch: 12 },
);

export default defineGenerator({
  ...base,
  params(rng, numbers) {
    const p = base.params(rng, numbers);
    if (p.n === 1) reject("a non-unit fraction");
    return p;
  },
});
