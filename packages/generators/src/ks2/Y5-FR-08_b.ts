/**
 * @statement Y5-FR-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-08.b: Round decimals with two places to one decimal place
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    roundDecimals(
      "Y5-FR-08.b",
      { friendly: [[2, 1]], standard: [[2, 1]], stretch: [[2, 1]] },
      { friendly: 10, standard: 50, stretch: 99 },
    ),
    [
      {
        statement: "Leo rounds 4.36 to one decimal place and gets 4.4.",
        truth: true,
        right: "True. The hundredths digit is 6, so round the tenths up: 4.4.",
        wrong: [
          ["False. It is 4.3; you always round down.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. It is 4.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        statement: "Kim rounds 7.25 to one decimal place and gets 7.2.",
        truth: false,
        right: "False. The hundredths digit is 5, which rounds up: 7.3.",
        wrong: [
          ["True. Halfway rounds down.", "NPV.ROUND.HALFWAY"],
          ["True. Rounding makes numbers smaller.", "NPV.ROUND.ALWAYS-DOWN"],
        ],
      },
      {
        claim: "A number rounded to one decimal place has one digit after the point.",
        truth: "always",
        right:
          "Always. Even when it is 0, as in 5.0, you write the tenths digit to show the accuracy.",
        wrong: [
          ["Sometimes. 4.96 rounds to 5.", "NPV.ROUND.WRONG-PLACE"],
          ["Never. It has two digits."],
        ],
      },
    ],
  ),
);
