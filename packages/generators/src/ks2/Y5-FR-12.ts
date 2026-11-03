/**
 * @statement Y5-FR-12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-12: Solve problems requiring knowing percentage and decimal equivalents of ½, ¼, ⅕, ⅖, ⅘
// and fractions with denominator 10 or 25
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    percentages(
      "Y5-FR-12",
      { friendly: [2, 4, 5], standard: [2, 4, 5, 10], stretch: [4, 5, 10, 25] },
      true,
    ),
    [
      {
        statement: "Leo says $\\frac{1}{4} = 25\\%$.",
        truth: true,
        right: "True. 1/4 = 25/100, which is 25%.",
        wrong: [["False. It is 4%.", "FR.PERCENT.DIGITS"], ["False. It is 14%."]],
      },
      {
        statement: "Mia says 20% of 40 is 2, because 40 ÷ 20 = 2.",
        truth: false,
        right: "False. 20% is 1/5, and 1/5 of 40 is 8.",
        wrong: [
          ["True. Divide by the percentage.", "FR.OF-AMOUNT.UNIT-ONLY"],
          ["True. 20% means divide by 20."],
        ],
      },
      {
        claim: "$\\frac{2}{5}$ is the same as 40%.",
        truth: "always",
        right: "Always. 2/5 = 4/10 = 40/100 = 40%.",
        wrong: [
          ["Never. 2/5 is 25%.", "FR.PERCENT.DIGITS"],
          ["Sometimes. Only in money problems."],
        ],
      },
    ],
  ),
);
