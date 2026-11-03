/**
 * @statement Y6-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-02: Compare and order fractions, including fractions > 1
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareFractions("Y6-FR-02", "any", {
      friendly: [3, 4, 5, 6],
      standard: [4, 5, 6, 7, 8],
      stretch: [5, 6, 7, 8, 9, 12],
    }),
    [
      {
        statement: "Ben says $\\frac{3}{5} > \\frac{4}{7}$.",
        truth: true,
        right: "True. With denominator 35: 3/5 = 21/35 and 4/7 = 20/35.",
        wrong: [
          ["False. 4 is bigger than 3.", "FR.COMPARE.NUMERATOR-ONLY"],
          ["False. 7 is bigger than 5.", "FR.UNIT.BIGGER-DENOMINATOR"],
        ],
      },
      {
        statement: "Pia says $\\frac{1}{8} > \\frac{1}{6}$, because 8 is bigger than 6.",
        truth: false,
        right: "False. Sharing into 8 gives smaller parts than sharing into 6, so 1/8 < 1/6.",
        wrong: [
          ["True. A bigger denominator means a bigger fraction.", "FR.UNIT.BIGGER-DENOMINATOR"],
          ["True. Compare the bottoms."],
        ],
      },
      {
        claim: "A fraction bigger than 1 has a numerator bigger than its denominator.",
        truth: "always",
        right: "Always. More parts than make a whole means more than 1.",
        wrong: [
          ["Sometimes. 5/7 is bigger than 1.", "FR.COMPARE.NUMERATOR-ONLY"],
          ["Never. Fractions are less than 1."],
        ],
      },
    ],
  ),
);
