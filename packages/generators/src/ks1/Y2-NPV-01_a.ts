/**
 * @statement Y2-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.a: Count in steps of 2 and 5 from 0
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-NPV-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-NPV-01.a",
      depths: [1, 3, 4],
      params: (rng, numbers) => ({
        ...def.params(rng, numbers),
        step: rng.pick([2, 5] as const),
        claim: rng.int(0, 1),
      }),
    },
    [
      {
        statement: "Ben counts in 10s from 0. He says he will say 70.",
        truth: true,
        right: "True. 10, 20, 30, 40, 50, 60, 70.",
        wrong: [
          ["False. Counting in 10s goes 10, 11, 12.", "NPV.SEQUENCE.STEP-ONE"],
          ["False. 70 is too big."],
        ],
      },
      {
        claim: "When you count in 5s from 0, the numbers end in 0 or 5.",
        truth: "always",
        right: "Always. 5, 10, 15, 20 … they end in 5, then 0, then 5.",
        wrong: [["Sometimes. 5 + 5 is 11.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 2."]],
      },
      {
        statement: "Mia counts in 2s from 0. She says she will say 9.",
        truth: false,
        right: "False. Counting in 2s from 0 gives even numbers: 8, 10. 9 is odd.",
        wrong: [
          ["True. 9 comes after 8.", "NPV.SEQUENCE.STEP-ONE"],
          ["True. You say every number."],
        ],
      },
    ],
  ),
);
