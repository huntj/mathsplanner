/**
 * @statement Y4-FR-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-04: Add and subtract fractions with the same denominator
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y4-FR-04",
    "same",
    { friendly: [5, 6, 7, 8], standard: [7, 8, 9, 10, 12], stretch: [9, 10, 11, 12] },
    false,
  ),
);
