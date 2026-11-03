/**
 * @statement Y5-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-01: Compare and order fractions whose denominators are all multiples of the same number
import { defineGenerator } from "@mathsplanner/core";
import { compareFractions } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareFractions("Y5-FR-01", "multiples", {
      friendly: [2, 3, 4, 5],
      standard: [3, 4, 5, 6],
      stretch: [4, 5, 6, 8],
    }),
    [
      {
        statement: "Sam says $\\frac{5}{8} > \\frac{1}{2}$.",
        truth: true,
        right: "True. 1/2 = 4/8, and 5/8 is more than 4/8.",
        wrong: [
          ["False. 8 is bigger than 2, so 5/8 is smaller.", "FR.UNIT.BIGGER-DENOMINATOR"],
          ["False. They are equal."],
        ],
      },
      {
        statement: "Ella says $\\frac{3}{4} < \\frac{5}{8}$, because 3 is less than 5.",
        truth: false,
        right: "False. 3/4 = 6/8, which is more than 5/8.",
        wrong: [
          ["True. Compare the tops.", "FR.COMPARE.NUMERATOR-ONLY"],
          ["True. Eighths are bigger than quarters.", "FR.UNIT.BIGGER-DENOMINATOR"],
        ],
      },
      {
        claim:
          "Of two fractions with the same denominator, the one with the bigger numerator is bigger.",
        truth: "always",
        right: "Always. The parts are the same size, so more parts is more.",
        wrong: [
          ["Never. The smaller numerator is bigger.", "FR.UNIT.BIGGER-DENOMINATOR"],
          ["Sometimes. Only for halves."],
        ],
      },
    ],
  ),
);
