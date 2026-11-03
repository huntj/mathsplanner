/**
 * @statement Y6-FR-11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-11: Recall and use equivalences between simple fractions, decimals and percentages,
// including in different contexts
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    percentages(
      "Y6-FR-11",
      { friendly: [2, 4, 5, 10], standard: [4, 5, 10, 20, 25], stretch: [5, 20, 25, 50] },
      true,
    ),
    [
      {
        statement: "Leo says $\\frac{3}{4} = 0.75 = 75\\%$.",
        truth: true,
        right: "True. 3/4 = 75/100, which is 0.75 and 75%.",
        wrong: [
          ["False. 3/4 = 0.34.", "FR.PERCENT.DIGITS"],
          ["False. 3/4 = 34%.", "FR.PERCENT.DIGITS"],
        ],
      },
      {
        statement: "Mia says 20% of 60 is 3, because 60 ÷ 20 = 3.",
        truth: false,
        right: "False. 20% is 1/5, and 1/5 of 60 is 12.",
        wrong: [
          ["True. Divide by the percentage.", "FR.OF-AMOUNT.UNIT-ONLY"],
          ["True. 20% means 1/20."],
        ],
      },
      {
        claim: "A percentage less than 100% is the same as a decimal less than 1.",
        truth: "always",
        right: "Always. 100% is 1, so anything less than 100% is less than 1.",
        wrong: [
          ["Never. Percentages are bigger numbers.", "FR.PERCENT.DIGITS"],
          ["Sometimes. Only for percentages under 10%."],
        ],
      },
    ],
  ),
);
