/**
 * @statement Y4-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-02: Find 1000 more or less than a given number
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    moreOrLess(
      "Y4-NPV-02",
      { friendly: [1000, 8999], standard: [1000, 9999], stretch: [1000, 99999] },
      { friendly: [1000], standard: [1000], stretch: [1000] },
    ),
    [
      {
        claim: "Finding 1000 more changes only the thousands digit.",
        truth: "sometimes",
        right:
          "Sometimes. 4,500 → 5,500 changes only the thousands, but 9,500 → 10,500 changes the ten thousands too.",
        wrong: [
          ["Always. Only the thousands change.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["Never. The ones change too."],
        ],
      },
      {
        statement: "Ali says 1000 less than 6,210 is 5,210.",
        truth: true,
        right: "True. The thousands digit goes down by 1.",
        wrong: [["False. It is 6,110.", "NPV.PLACE.TENS-ONES-MIXUP"], ["False. It is 6,209."]],
      },
      {
        statement: "Bea says 1000 more than 2,045 is 2,145.",
        truth: false,
        right: "False. 1000 more changes the thousands digit: 3,045.",
        wrong: [
          ["True. Add 1 to the hundreds.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["True. 1000 more adds a zero."],
        ],
      },
    ],
  ),
);
