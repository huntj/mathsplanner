/**
 * @statement Y6-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-02: Compare and order fractions, including fractions > 1
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";

export default defineGenerator(
  compareFractions("Y6-FR-02", "any", {
    friendly: [3, 4, 5, 6],
    standard: [4, 5, 6, 7, 8],
    stretch: [5, 6, 7, 8, 9, 12],
  }),
);
