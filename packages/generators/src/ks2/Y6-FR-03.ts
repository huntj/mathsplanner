/**
 * @statement Y6-FR-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-03: Add and subtract fractions with different denominators and mixed numbers
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";
import { mixFamilies } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y6-FR-03", {
    1: addFractions(
      "Y6-FR-03",
      "different",
      { friendly: [2, 3, 4, 5], standard: [3, 4, 5, 6, 7], stretch: [4, 5, 6, 7, 8, 9] },
      false,
      "simplest",
    ),
    2: addFractions(
      "Y6-FR-03",
      "mixed",
      { friendly: [2, 3, 4], standard: [3, 4, 5, 6], stretch: [4, 5, 6, 8] },
      false,
      "simplest",
    ),
    4: addFractions(
      "Y6-FR-03",
      "different",
      { friendly: [2, 3, 4, 5], standard: [3, 4, 5, 6, 7], stretch: [4, 5, 6, 7, 8, 9] },
      false,
      "simplest",
    ),
  }),
);
