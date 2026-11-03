/**
 * @statement Y4-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-04: Count backwards through zero to include negative numbers
import { defineGenerator } from "@mathsplanner/core";
import { negatives } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    negatives(
      "Y4-NPV-04",
      { friendly: [-5, 5], standard: [-10, 10], stretch: [-20, 20] },
      { friendly: [1], standard: [1, 2], stretch: [2, 5] },
    ),
    [
      {
        statement: "Mia counts back in ones from 2: 2, 1, 0, −1, −2.",
        truth: true,
        right: "True. After 0, counting back goes to the negative numbers.",
        wrong: [
          ["False. After 0 it goes 1, 2.", "NPV.NEGATIVE.MIRROR"],
          ["False. You cannot count back past 0."],
        ],
      },
      {
        claim: "−5 is smaller than −1.",
        truth: "always",
        right: "Always. −5 is further below zero than −1.",
        wrong: [
          ["Never. 5 is bigger than 1.", "NPV.NEGATIVE.ORDER"],
          ["Sometimes. It depends on the weather."],
        ],
      },
      {
        statement: "Leo counts back 5 from 3 and says he gets −3.",
        truth: false,
        right: "False. 3, 2, 1, 0, −1, −2: counting back 5 from 3 gives −2.",
        wrong: [
          ["True. 3 mirrored is −3.", "NPV.NEGATIVE.MIRROR"],
          ["True. Take away 5 and change the sign."],
        ],
      },
    ],
  ),
);
