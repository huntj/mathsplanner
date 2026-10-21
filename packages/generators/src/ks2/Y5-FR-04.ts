/**
 * @statement Y5-FR-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-04: Add and subtract fractions with the same denominator and denominators that are
// multiples of the same number
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y5-FR-04",
    "related",
    { friendly: [2, 3, 4], standard: [3, 4, 5], stretch: [4, 5, 6] },
    false,
  ),
);
