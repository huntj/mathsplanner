/**
 * @statement Y5-NPV-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-04.b: Round to the nearest 10 000 and 100 000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y5-NPV-04.b",
      { friendly: [10001, 99999], standard: [10001, 999999], stretch: [100001, 999999] },
      { friendly: [10000], standard: [10000, 100000], stretch: [10000, 100000] },
    ),
    [
      {
        statement: "Tom rounds 638,000 to the nearest 100,000 and gets 600,000.",
        truth: true,
        right: "True. The ten thousands digit is 3, which is less than 5, so round down.",
        wrong: [
          ["False. It is 700,000, because of the 8.", "NPV.ROUND.WRONG-PLACE"],
          ["False. It is 640,000."],
        ],
      },
      {
        statement: "Ella rounds 47,500 to the nearest 10,000 and gets 40,000.",
        truth: false,
        right: "False. The thousands digit is 7, so round up: 50,000.",
        wrong: [
          ["True. Rounding always goes down.", "NPV.ROUND.ALWAYS-DOWN"],
          ["True. Look at the hundreds digit, 5.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
      {
        claim: "Rounding to the nearest 100,000 can give 0.",
        truth: "sometimes",
        right: "Sometimes. Numbers below 50,000 round to 0, but bigger numbers do not.",
        wrong: [
          ["Never. Rounding cannot give 0.", "NPV.ROUND.ALWAYS-DOWN"],
          ["Always. Most numbers are smaller than 100,000."],
        ],
      },
    ],
  ),
);
