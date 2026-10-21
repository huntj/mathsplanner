/**
 * @statement Y4-FR-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-03: Solve problems to calculate quantities, and fractions to divide quantities, including
// non-unit fractions where the answer is a whole number
import { defineGenerator } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

export default defineGenerator(
  fractionOfAmount(
    "Y4-FR-03",
    { friendly: [3, 4, 5], standard: [3, 4, 5, 6, 8, 10], stretch: [6, 7, 8, 9, 10, 12] },
    { friendly: true, standard: true, stretch: true },
    { friendly: 10, standard: 12, stretch: 25 },
  ),
);
