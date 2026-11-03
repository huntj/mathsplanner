/**
 * @statement Y1-AS-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-04.b: Solve missing number problems such as 7 = ? − 9
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    missingNumbers(
      "Y1-AS-04.b",
      { friendly: [2, 9], standard: [3, 10], stretch: [5, 10] },
      [0, 1, 2, 3, 4],
    ),
    [
      {
        statement: "To find the missing number in □ + 3 = 8, Leo works out 8 − 3.",
        truth: true,
        right: "True. Take away undoes add: □ = 5.",
        wrong: [
          ["False. Work out 8 + 3.", "AS.INVERSE.SAME-OPERATION"],
          ["False. The answer is 3."],
        ],
      },
      {
        claim: "The missing number in 10 = □ + 4 is 6.",
        truth: "always",
        right: "Always. 6 + 4 = 10.",
        wrong: [
          ["Never. It is 14.", "AS.EQUALS.ANSWER-NEXT"],
          ["Sometimes. It depends on the day."],
        ],
      },
      {
        statement: "Mia says the missing number in □ − 2 = 5 is 3.",
        truth: false,
        right: "False. Something take away 2 leaves 5, so it is 7.",
        wrong: [
          ["True. 5 − 2 = 3.", "AS.INVERSE.SAME-OPERATION"],
          ["True. Take the small number from the big one."],
        ],
      },
    ],
  ),
);
