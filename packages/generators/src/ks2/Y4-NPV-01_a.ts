/**
 * @statement Y4-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.a: Count in multiples of 6, 7 and 9
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    countInSteps("Y4-NPV-01.a", { friendly: [6, 9], standard: [6, 7, 9], stretch: [6, 7, 9] }),
    [
      {
        statement: "Leo counts in 6s from 0. He says he will say 45.",
        truth: false,
        right: "False. Counting in 6s gives multiples of 6: 42, 48 … 45 is not one of them.",
        wrong: [
          ["True. 45 is between 42 and 48.", "NPV.SEQUENCE.STEP-ONE"],
          ["True. Every number comes up in the end."],
        ],
      },
      {
        claim: "When you count in 9s from 0, the digits of each number add up to a multiple of 9.",
        truth: "always",
        right: "Always. 9 → 9, 18 → 1 + 8 = 9, 27 → 9, and 99 → 18.",
        wrong: [
          ["Sometimes. Only up to 90.", "NPV.SEQUENCE.STEP-ONE"],
          ["Never. The digits are random."],
        ],
      },
      {
        claim: "Counting in 7s from 0 gives odd numbers only.",
        truth: "never",
        right: "Never. The numbers go odd, even, odd, even: 7, 14, 21, 28 …",
        wrong: [["Always. 7 is odd, so its multiples are odd."], ["Sometimes. Only after 50."]],
      },
    ],
  ),
);
