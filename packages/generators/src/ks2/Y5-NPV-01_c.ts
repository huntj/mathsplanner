/**
 * @statement Y5-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-01.c: Order and compare numbers to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareNumbers("Y5-NPV-01.c", {
      friendly: [10000, 99999],
      standard: [100000, 999999],
      stretch: [100000, 999999],
    }),
    [
      {
        statement: "Sam says $305{,}000 > 300{,}500$.",
        truth: true,
        right: "True. Both have 3 hundred thousands; then 5 thousands is more than 0 thousands.",
        wrong: [
          ["False. 300,500 has a 5 further along, so it is bigger.", "NPV.COMPARE.FIRST-DIGIT"],
          ["False. They are equal."],
        ],
      },
      {
        statement: "Ava says $89{,}999$ is bigger than $100{,}000$, because 8 is bigger than 1.",
        truth: false,
        right: "False. 100,000 has six digits and 89,999 has five, so 100,000 is bigger.",
        wrong: [
          ["True. Compare the first digits.", "NPV.COMPARE.FIRST-DIGIT"],
          ["True. 89,999 has more nines.", "NPV.COMPARE.SIGN-DIRECTION"],
        ],
      },
      {
        claim: "A 6-digit whole number is bigger than a 5-digit whole number.",
        truth: "always",
        right:
          "Always. The smallest 6-digit number, 100,000, is bigger than the biggest 5-digit number, 99,999.",
        wrong: [
          ["Sometimes. It depends on the first digits.", "NPV.COMPARE.FIRST-DIGIT"],
          ["Never. Count the nines."],
        ],
      },
    ],
  ),
);
