/**
 * @statement Y4-NPV-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.b: Round to the nearest 100
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y4-NPV-07.b",
      { friendly: [101, 999], standard: [100, 9999], stretch: [1000, 9999] },
      { friendly: [100], standard: [100], stretch: [100] },
    ),
    [
      {
        statement: "Gus rounds 730 to the nearest 100 and gets 700.",
        truth: true,
        right: "True. The tens digit is 3, so round down.",
        wrong: [
          ["False. It is 800.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. It is 730 already.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        claim: "Rounding to the nearest 100 gives a number ending in 00.",
        truth: "always",
        right: "Always. The answer is a multiple of 100.",
        wrong: [
          ["Sometimes. It can end in 50.", "NPV.ROUND.WRONG-PLACE"],
          ["Never. It keeps its tens."],
        ],
      },
      {
        statement: "Kit rounds 1,962 to the nearest 100 and gets 1,900.",
        truth: false,
        right: "False. The tens digit is 6, so round up: 2,000.",
        wrong: [
          ["True. Just drop the last two digits.", "NPV.ROUND.ALWAYS-DOWN"],
          ["True. Halfway goes down.", "NPV.ROUND.HALFWAY"],
        ],
      },
    ],
  ),
);
