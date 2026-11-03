/**
 * @statement Y2-FR-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-02.b: Recognise that 2/4 and ½ are equivalent
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-FR-02.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y2-FR-02.b", depths: [3, 4] }, [
    {
      claim: "2/4 is the same amount as 1/2.",
      truth: "always",
      right: "Always. 2 quarters make a half.",
      wrong: [
        ["Never. 2/4 is more.", "FR.COMPARE.NUMERATOR-ONLY"],
        ["Sometimes. Only for big shapes."],
      ],
    },
    {
      statement: "Kit says 3/4 of 8 is 6.",
      truth: true,
      right: "True. 1/4 of 8 is 2, so 3/4 is 3 × 2 = 6.",
      wrong: [["False. It is 2.", "FR.OF-AMOUNT.UNIT-ONLY"], ["False. It is 3."]],
    },
    {
      statement: "Leo says 1/4 is bigger than 1/2, because 4 is bigger than 2.",
      truth: false,
      right: "False. Cutting into 4 makes smaller pieces than cutting into 2, so 1/4 is smaller.",
      wrong: [
        ["True. Bigger number, bigger fraction.", "FR.COMPARE.NUMERATOR-ONLY"],
        ["True. Quarters are bigger."],
      ],
    },
  ]),
);
