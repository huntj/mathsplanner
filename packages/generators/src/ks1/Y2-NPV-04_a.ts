/**
 * @statement Y2-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-04.a: Compare numbers up to 100 using <, > and =
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-NPV-04.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y2-NPV-04.a", depths: [1, 4] }, [
    {
      statement: "Raj says 52 > 25.",
      truth: true,
      right: "True. 52 has 5 tens and 25 has 2 tens.",
      wrong: [
        ["False. They have the same digits, so they are equal.", "NPV.COMPARE.ONES-FIRST"],
        ["False. 5 is bigger than 2, so 25 is bigger."],
      ],
    },
    {
      claim: "To compare two 2-digit numbers, you look at the tens first.",
      truth: "always",
      right: "Always. Tens are worth more than ones.",
      wrong: [
        ["Never. Look at the ones first.", "NPV.COMPARE.ONES-FIRST"],
        ["Sometimes. Only if the ones are the same."],
      ],
    },
    {
      statement: "Kim writes 61 < 59.",
      truth: false,
      right: "False. 61 has 6 tens and 59 has 5 tens, so 61 > 59.",
      wrong: [
        ["True. 9 is bigger than 1.", "NPV.COMPARE.ONES-FIRST"],
        ["True. The arrow points to the bigger number.", "NPV.COMPARE.SIGN-DIRECTION"],
      ],
    },
  ]),
);
