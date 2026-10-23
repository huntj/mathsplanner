/**
 * @statement Y5-FR-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-04.a: Add and subtract fractions with the same denominator
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y5-FR-04.a",
    "same",
    { friendly: [3, 4, 5], standard: [5, 6, 7, 8], stretch: [7, 8, 9, 10, 12] },
    true,
  ),
);
