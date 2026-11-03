/**
 * @statement Y4-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-05: Order and compare numbers beyond 1000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    compareNumbers("Y4-NPV-05", {
      friendly: [1000, 9999],
      standard: [1000, 9999],
      stretch: [1000, 99999],
    }),
    [
      {
        statement: "Sol says 4,305 is bigger than 4,035.",
        truth: true,
        right: "True. Both have 4 thousands; then 3 hundreds is more than 0 hundreds.",
        wrong: [
          ["False. They use the same digits, so they are equal.", "NPV.COMPARE.FIRST-DIGIT"],
          ["False. 4,035 has a 5 at the end."],
        ],
      },
      {
        claim: "A 4-digit number is bigger than a 3-digit number.",
        truth: "always",
        right:
          "Always. The smallest 4-digit number, 1000, is bigger than the biggest 3-digit number, 999.",
        wrong: [
          ["Sometimes. 999 is bigger than 1000.", "NPV.COMPARE.FIRST-DIGIT"],
          ["Never. It depends on the first digit."],
        ],
      },
      {
        statement: "Pia writes 2,999 < 2,909.",
        truth: false,
        right:
          "False. Both have 2 thousands and 9 hundreds; then 9 tens is more than 0 tens, so 2,999 > 2,909.",
        wrong: [
          ["True. The arrow points to the bigger number.", "NPV.COMPARE.SIGN-DIRECTION"],
          ["True. 2,909 has a 0, so it is bigger."],
        ],
      },
    ],
  ),
);
