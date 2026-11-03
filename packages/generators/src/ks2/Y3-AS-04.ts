/**
 * @statement Y3-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-AS-04: Solve problems, including missing number problems, using number facts, place value and
// more complex addition and subtraction
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    missingNumbers("Y3-AS-04", { friendly: [50, 300], standard: [101, 500], stretch: [101, 999] }),
    [
      {
        statement: "To find the missing number in □ + 25 = 60, Ivy works out 60 − 25.",
        truth: true,
        right: "True. The missing number plus 25 makes 60, so it is 60 − 25 = 35.",
        wrong: [
          ["False. Work out 60 + 25.", "AS.INVERSE.SAME-OPERATION"],
          ["False. The answer is 25."],
        ],
      },
      {
        claim: "The = sign means both sides are worth the same.",
        truth: "always",
        right: "Always. 7 = 3 + 4 means 7 and 3 + 4 are the same amount.",
        wrong: [
          ["Never. It means 'the answer comes next'.", "AS.EQUALS.ANSWER-NEXT"],
          ["Sometimes. Only when the answer is on the right."],
        ],
      },
      {
        statement: "Leo says 10 = 4 + 5 is true, because the answer can go on either side.",
        truth: false,
        right:
          "False. 4 + 5 = 9, not 10. The answer can go on either side, but both sides must be equal.",
        wrong: [
          ["True. Swapping sides makes it right.", "AS.EQUALS.ANSWER-NEXT"],
          ["True. 10 is close to 9."],
        ],
      },
    ],
  ),
);
