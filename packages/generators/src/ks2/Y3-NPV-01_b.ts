/**
 * @statement Y3-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.b: Count in multiples of 50 and 100
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    countInSteps("Y3-NPV-01.b", { friendly: [100], standard: [50, 100], stretch: [50, 100] }),
    [
      {
        claim: "Counting in 100s from 0 gives numbers that end in 00.",
        truth: "always",
        right: "Always. Each step adds one hundred, so the tens and ones stay 0.",
        wrong: [["Sometimes. 150 is one.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 1."]],
      },
      {
        statement: "Mia counts in 50s from 0. She says she will say 225.",
        truth: false,
        right: "False. Counting in 50s gives numbers ending in 50 or 00: 200, 250 …",
        wrong: [
          ["True. 225 is between 200 and 250.", "NPV.SEQUENCE.STEP-ONE"],
          ["True. Every number comes up in the end."],
        ],
      },
      {
        statement: "Kai counts in 50s from 0 and says the fourth number he says is 200.",
        truth: true,
        right: "True. 50, 100, 150, 200.",
        wrong: [["False. It is 54.", "NPV.SEQUENCE.STEP-ONE"], ["False. It is 400."]],
      },
    ],
  ),
);
