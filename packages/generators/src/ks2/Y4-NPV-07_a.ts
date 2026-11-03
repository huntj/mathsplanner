/**
 * @statement Y4-NPV-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.a: Round to the nearest 10
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y4-NPV-07.a",
      { friendly: [11, 999], standard: [100, 9999], stretch: [1000, 9999] },
      { friendly: [10], standard: [10], stretch: [10] },
    ),
    [
      {
        statement: "Zoe rounds 63 to the nearest 10 and gets 60.",
        truth: true,
        right: "True. 63 is nearer to 60 than to 70.",
        wrong: [
          ["False. It is 70; rounding goes up.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. It is 100.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        claim: "A number ending in 5 rounds up to the next 10.",
        truth: "always",
        right: "Always. A 5 is exactly halfway, and halfway rounds up.",
        wrong: [
          ["Never. Halfway rounds down.", "NPV.ROUND.HALFWAY"],
          ["Sometimes. Only if it is odd."],
        ],
      },
      {
        statement: "Dev rounds 248 to the nearest 10 and gets 240.",
        truth: false,
        right: "False. 248 is nearer 250 than 240: the ones digit is 8.",
        wrong: [
          ["True. Rounding always goes down.", "NPV.ROUND.ALWAYS-DOWN"],
          ["True. Look at the tens digit, 4.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
    ],
  ),
);
