/**
 * @statement Y3-FR-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-05: Add and subtract fractions with the same denominator within one whole, e.g. 5/7 + 1/7 =
// 6/7
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y3-FR-05",
    "same",
    { friendly: [4, 5], standard: [5, 6, 7, 8], stretch: [7, 8, 9, 10, 12] },
    true,
  ),
);
