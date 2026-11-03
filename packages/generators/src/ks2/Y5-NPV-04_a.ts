/**
 * @statement Y5-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-04.a: Round to the nearest 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y5-NPV-04.a",
      { friendly: [1000, 99999], standard: [1000, 999999], stretch: [10000, 999999] },
      { friendly: [10, 100], standard: [10, 100, 1000], stretch: [10, 100, 1000] },
    ),
    [
      {
        statement: "Ali rounds 4,736 to the nearest hundred and gets 4,700.",
        truth: true,
        right: "True. The tens digit is 3, which is less than 5, so round down.",
        wrong: [
          ["False. It is 4,800, as there is a 6.", "NPV.ROUND.WRONG-PLACE"],
          ["False. It is 5,000."],
        ],
      },
      {
        statement: "Bea rounds 2,850 to the nearest hundred and gets 2,800.",
        truth: false,
        right: "False. 2,850 is exactly halfway, and halfway rounds up: 2,900.",
        wrong: [
          ["True. Halfway rounds down.", "NPV.ROUND.HALFWAY"],
          ["True. Rounding always goes down.", "NPV.ROUND.ALWAYS-DOWN"],
        ],
      },
      {
        claim: "A number rounded to the nearest 10 ends in 0.",
        truth: "always",
        right: "Always. Rounding to the nearest 10 gives a multiple of 10.",
        wrong: [
          ["Sometimes. Only if it was nearly a multiple of 10.", "NPV.ROUND.WRONG-PLACE"],
          ["Never. It keeps its ones digit."],
        ],
      },
    ],
  ),
);
