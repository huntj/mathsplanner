/**
 * @statement Y3-FR-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-06: Compare and order unit fractions, and fractions with the same denominators
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";

export default defineGenerator(
  compareFractions("Y3-FR-06", "unit-same", {
    friendly: [2, 3, 4, 5],
    standard: [3, 4, 5, 6, 8, 10],
    stretch: [5, 6, 7, 8, 9, 10, 12],
  }),
);
