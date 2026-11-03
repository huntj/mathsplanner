/**
 * @statement Y4-NPV-07.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.c: Round to the nearest 1000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    rounding(
      "Y4-NPV-07.c",
      { friendly: [1001, 9999], standard: [1001, 9999], stretch: [1001, 9999] },
      { friendly: [1000], standard: [1000], stretch: [1000] },
    ),
    [
      {
        statement: "Ana rounds 6,480 to the nearest 1000 and gets 6,000.",
        truth: true,
        right: "True. The hundreds digit is 4, so round down.",
        wrong: [
          ["False. The 8 makes it round up to 7,000.", "NPV.ROUND.WRONG-PLACE"],
          ["False. It is 6,500."],
        ],
      },
      {
        claim: "Rounding to the nearest 1000 can make a number bigger.",
        truth: "sometimes",
        right: "Sometimes. 2,700 rounds up to 3,000, but 2,300 rounds down to 2,000.",
        wrong: [
          ["Never. Rounding makes numbers smaller.", "NPV.ROUND.ALWAYS-DOWN"],
          ["Always. Rounding goes up."],
        ],
      },
      {
        statement: "Ben rounds 8,509 to the nearest 1000 and gets 8,000.",
        truth: false,
        right: "False. The hundreds digit is 5, so round up: 9,000.",
        wrong: [
          ["True. 8,509 is in the eight thousands.", "NPV.ROUND.ALWAYS-DOWN"],
          ["True. Look at the ones digit, 9.", "NPV.ROUND.WRONG-PLACE"],
        ],
      },
    ],
  ),
);
