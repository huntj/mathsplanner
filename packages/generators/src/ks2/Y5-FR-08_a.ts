/**
 * @statement Y5-FR-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-08.a: Round decimals with two places to the nearest whole number
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    roundDecimals(
      "Y5-FR-08.a",
      { friendly: [[2, 0]], standard: [[2, 0]], stretch: [[2, 0]] },
      { friendly: 10, standard: 50, stretch: 99 },
    ),
    [
      {
        statement: "Sam rounds 6.72 to the nearest whole number and gets 7.",
        truth: true,
        right: "True. The tenths digit is 7, which is 5 or more, so round up.",
        wrong: [
          ["False. It is 6; rounding goes down.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. It is 6.7.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        claim:
          "A decimal between 3 and 4 rounds to 3 or 4 when rounded to the nearest whole number.",
        truth: "always",
        right: "Always. The nearest whole number to it must be one of its two neighbours.",
        wrong: [
          ["Sometimes. It might round to 5.", "NPV.ROUND.WRONG-PLACE"],
          ["Never. Decimals round to 0."],
        ],
      },
      {
        statement: "Mia rounds 9.38 to the nearest whole number and gets 10.",
        truth: false,
        right: "False. The tenths digit is 3, so round down to 9.",
        wrong: [
          ["True. The 8 rounds it up.", "NPV.ROUND.WRONG-PLACE"],
          ["True. Decimals always round up."],
        ],
      },
    ],
  ),
);
