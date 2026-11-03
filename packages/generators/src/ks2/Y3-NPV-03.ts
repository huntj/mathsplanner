/**
 * @statement Y3-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-03: Compare and order numbers up to 1000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareNumbers("Y3-NPV-03", {
      friendly: [100, 999],
      standard: [100, 999],
      stretch: [100, 999],
    }),
    [
      {
        statement: "Sam says 405 is bigger than 395.",
        truth: true,
        right: "True. Compare the hundreds first: 4 hundreds is more than 3 hundreds.",
        wrong: [
          ["False. 9 is bigger than 0.", "NPV.COMPARE.FIRST-DIGIT"],
          ["False. They are about the same."],
        ],
      },
      {
        claim: "A 3-digit number is bigger than a 2-digit number.",
        truth: "always",
        right:
          "Always. The smallest 3-digit number, 100, is bigger than the biggest 2-digit number, 99.",
        wrong: [
          ["Sometimes. 99 is bigger than 100.", "NPV.COMPARE.FIRST-DIGIT"],
          ["Never. Count the nines."],
        ],
      },
      {
        statement: "Pia writes 268 < 248.",
        truth: false,
        right: "False. Both have 2 hundreds; 6 tens is more than 4 tens, so 268 > 248.",
        wrong: [
          ["True. The < sign points to the bigger number.", "NPV.COMPARE.SIGN-DIRECTION"],
          ["True. 248 ends in 8."],
        ],
      },
    ],
  ),
);
