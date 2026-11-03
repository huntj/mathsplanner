/**
 * @statement Y3-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.c: Find 10 or 100 more or less than a number
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    moreOrLess(
      "Y3-NPV-01.c",
      { friendly: [100, 899], standard: [100, 899], stretch: [100, 989] },
      { friendly: [10], standard: [10, 100], stretch: [10, 100] },
    ),
    [
      {
        statement: "Ana says 10 more than 356 is 366.",
        truth: true,
        right: "True. The tens digit goes up by 1: 5 tens becomes 6 tens.",
        wrong: [["False. It is 357.", "NPV.PLACE.TENS-ONES-MIXUP"], ["False. It is 456."]],
      },
      {
        claim: "Finding 100 more changes the hundreds digit.",
        truth: "always",
        right:
          "Always. Adding 100 adds one hundred, so the hundreds digit goes up (and 9 hundreds becomes 10).",
        wrong: [
          ["Never. It changes the ones.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["Sometimes. Only for small numbers."],
        ],
      },
      {
        statement: "Ben says 100 less than 627 is 617.",
        truth: false,
        right: "False. 100 less changes the hundreds digit: 527.",
        wrong: [
          ["True. Take 1 from the tens.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["True. Less means take away 10."],
        ],
      },
    ],
  ),
);
