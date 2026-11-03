/**
 * @statement Y2-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-04: Recognise and use the inverse relationship between addition and subtraction to check
// and solve missing number problems
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    missingNumbers("Y2-AS-04", { friendly: [5, 30], standard: [11, 49], stretch: [21, 79] }),
    [
      {
        statement: "To find □ in □ + 6 = 15, Raj works out 15 − 6.",
        truth: true,
        right: "True. Take away undoes add: □ = 9.",
        wrong: [
          ["False. Work out 15 + 6.", "AS.INVERSE.SAME-OPERATION"],
          ["False. The answer is 6."],
        ],
      },
      {
        claim: "You can check 20 − 7 = 13 by working out 13 + 7.",
        truth: "always",
        right: "Always. Adding undoes taking away: 13 + 7 = 20.",
        wrong: [
          ["Never. Check with 20 − 7 again.", "AS.INVERSE.SAME-OPERATION"],
          ["Sometimes. Only for even numbers."],
        ],
      },
      {
        statement: "Kim says the missing number in 12 = □ + 4 is 16.",
        truth: false,
        right: "False. 8 + 4 = 12, so □ = 8.",
        wrong: [
          ["True. Add 12 and 4.", "AS.EQUALS.ANSWER-NEXT"],
          ["True. The biggest number goes in the box."],
        ],
      },
    ],
  ),
);
