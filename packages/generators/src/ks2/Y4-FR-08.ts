/**
 * @statement Y4-FR-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-08: Round decimals with one decimal place to the nearest whole number
import { defineGenerator } from "@mathsplanner/core";
import { roundDecimals } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    roundDecimals(
      "Y4-FR-08",
      { friendly: [[1, 0]], standard: [[1, 0]], stretch: [[1, 0]] },
      { friendly: 10, standard: 20, stretch: 99 },
    ),
    [
      {
        statement: "Gus rounds 7.8 to the nearest whole number and gets 8.",
        truth: true,
        right: "True. 7.8 is nearer to 8 than to 7.",
        wrong: [
          ["False. It is 7; you drop the decimal.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. It is 7.8 already."],
        ],
      },
      {
        claim: "A decimal with 4 tenths rounds down to the whole number below.",
        truth: "always",
        right: "Always. 4 tenths is less than half, so it is nearer the whole number below.",
        wrong: [
          ["Never. Decimals always round up."],
          ["Sometimes. Only for big numbers.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        statement: "Kim rounds 3.5 to the nearest whole number and gets 3.",
        truth: false,
        right: "False. 3.5 is exactly halfway, and halfway rounds up: 4.",
        wrong: [
          ["True. Halfway rounds down.", "NPV.ROUND.HALFWAY"],
          ["True. Just remove the .5.", "NPV.ROUND.ALWAYS-DOWN"],
        ],
      },
    ],
  ),
);
