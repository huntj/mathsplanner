/**
 * @statement Y5-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-01: Compare and order fractions whose denominators are all multiples of the same number
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";

export default defineGenerator(
  compareFractions("Y5-FR-01", "multiples", {
    friendly: [2, 3, 4, 5],
    standard: [3, 4, 5, 6],
    stretch: [4, 5, 6, 8],
  }),
);
