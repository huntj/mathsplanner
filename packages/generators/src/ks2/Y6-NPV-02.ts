/**
 * @statement Y6-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-NPV-02: Round any whole number to a required degree of accuracy
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y6-NPV-02",
      { friendly: [10000, 999999], standard: [100000, 9999999], stretch: [1000000, 9999999] },
      { friendly: [100, 1000], standard: [1000, 10000, 100000], stretch: [10000, 100000, 1000000] },
    ),
    [
      {
        statement: "Kai rounds $2{,}463{,}000$ to the nearest million and gets $2{,}000{,}000$.",
        truth: true,
        right: "True. The hundred thousands digit is 4, which is less than 5, so round down.",
        wrong: [
          ["False. It rounds to 3,000,000, because it has a 6 in it.", "NPV.ROUND.WRONG-PLACE"],
          ["False. It rounds to 2,500,000."],
        ],
      },
      {
        statement: "Mia rounds $748{,}500$ to the nearest thousand and gets $748{,}000$.",
        truth: false,
        right: "False. 748,500 is exactly halfway, and halfway rounds up: 749,000.",
        wrong: [
          ["True. Halfway rounds down.", "NPV.ROUND.HALFWAY"],
          ["True. Rounding always makes a number smaller.", "NPV.ROUND.ALWAYS-DOWN"],
        ],
      },
      {
        claim: "Rounding a number to the nearest 1000 makes it smaller.",
        truth: "sometimes",
        right: "Sometimes. 4,300 rounds down to 4,000, but 4,700 rounds up to 5,000.",
        wrong: [
          ["Always. Rounding takes digits away.", "NPV.ROUND.ALWAYS-DOWN"],
          ["Never. Rounding always goes up."],
        ],
      },
    ],
  ),
);
