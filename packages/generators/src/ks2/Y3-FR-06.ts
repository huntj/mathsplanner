/**
 * @statement Y3-FR-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-06: Compare and order unit fractions, and fractions with the same denominators
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareFractions("Y3-FR-06", "unit-same", {
      friendly: [2, 3, 4, 5],
      standard: [3, 4, 5, 6, 8, 10],
      stretch: [5, 6, 7, 8, 9, 10, 12],
    }),
    [
      {
        statement: "Sam says 1/2 is bigger than 1/4.",
        truth: true,
        right: "True. Halves are bigger pieces than quarters.",
        wrong: [
          ["False. 4 is bigger than 2.", "FR.UNIT.BIGGER-DENOMINATOR"],
          ["False. They are the same."],
        ],
      },
      {
        claim:
          "Of two fractions with the same denominator, the bigger numerator is the bigger fraction.",
        truth: "always",
        right: "Always. The pieces are the same size, so more pieces is more.",
        wrong: [
          ["Never. The smaller number is bigger.", "FR.UNIT.BIGGER-DENOMINATOR"],
          ["Sometimes. Only for quarters."],
        ],
      },
      {
        statement: "Pia says 2/5 is bigger than 4/5, because 2 is smaller.",
        truth: false,
        right: "False. Both are fifths: 4 fifths is more than 2 fifths.",
        wrong: [
          ["True. Smaller numbers mean bigger fractions.", "FR.COMPARE.NUMERATOR-ONLY"],
          ["True. 2/5 has fewer parts left over."],
        ],
      },
    ],
  ),
);
