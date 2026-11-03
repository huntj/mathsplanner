/**
 * @statement Y6-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-01.c: Order and compare numbers to 10 000 000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareNumbers("Y6-NPV-01.c", {
      friendly: [100000, 999999],
      standard: [1000000, 9999999],
      stretch: [1000000, 9999999],
    }),
    [
      {
        statement: "Sam says $4{,}050{,}000 > 4{,}005{,}000$.",
        truth: true,
        right:
          "True. Both have 4 millions; then 0 hundred thousands each, and 5 ten thousands is more than 0.",
        wrong: [
          ["False. 4,005,000 has a 5 nearer the front.", "NPV.COMPARE.FIRST-DIGIT"],
          ["False. They are equal, as they use the same digits."],
        ],
      },
      {
        statement:
          "Ava puts these in order, smallest first: $899{,}000$, $1{,}200{,}000$, $990{,}000$.",
        truth: false,
        right:
          "False. 990,000 is smaller than 1,200,000, so the order is 899,000, 990,000, 1,200,000.",
        wrong: [
          [
            "True. 1 is smaller than 9, so 1,200,000 comes before 990,000.",
            "NPV.COMPARE.FIRST-DIGIT",
          ],
          ["True. Numbers with more digits come first.", "NPV.COMPARE.SIGN-DIRECTION"],
        ],
      },
      {
        claim: "A whole number with more digits is bigger than one with fewer digits.",
        truth: "always",
        right:
          "Always. A 7-digit number is at least 1,000,000, and every 6-digit number is less than that.",
        wrong: [
          ["Sometimes. It depends on the first digits.", "NPV.COMPARE.FIRST-DIGIT"],
          ["Never. Compare the first digits instead.", "NPV.COMPARE.FIRST-DIGIT"],
        ],
      },
    ],
  ),
);
