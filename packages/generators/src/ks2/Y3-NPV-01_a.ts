/**
 * @statement Y3-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.a: Count in multiples of 4 and 8
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y3-NPV-01.a", { friendly: [4], standard: [4, 8], stretch: [4, 8] }), [
    {
      statement: "Leo counts in 8s from 0. He says he will say 40.",
      truth: true,
      right: "True. 8, 16, 24, 32, 40.",
      wrong: [
        ["False. 40 is in the 10 times table, not the 8s.", "NPV.SEQUENCE.STEP-ONE"],
        ["False. Counting in 8s only gives odd numbers."],
      ],
    },
    {
      claim: "Counting in 4s from 0 gives even numbers.",
      truth: "always",
      right: "Always. 4 is even, so 4, 8, 12, 16 … are all even.",
      wrong: [["Sometimes. 4 × 3 = 13 is odd.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They are odd."]],
    },
    {
      claim: "When you count in 3s from 0, every number is odd.",
      truth: "never",
      right: "Never all of them. 3, 6, 9, 12: they go odd, even, odd, even.",
      wrong: [["Always. 3 is odd.", "NPV.SEQUENCE.STEP-ONE"], ["Sometimes. Only after 10."]],
    },
  ]),
);
