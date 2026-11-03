/**
 * @statement Y4-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.b: Count in multiples of 25
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y4-NPV-01.b", { friendly: [25], standard: [25], stretch: [25] }), [
    {
      statement: "Kim counts in 25s from 0 and says she will say 175.",
      truth: true,
      right: "True. 25, 50, 75, 100, 125, 150, 175.",
      wrong: [
        ["False. Multiples of 25 end in 00 or 50.", "NPV.SEQUENCE.STEP-ONE"],
        ["False. 175 is odd."],
      ],
    },
    {
      claim: "Every multiple of 25 ends in 00, 25, 50 or 75.",
      truth: "always",
      right: "Always. Four 25s make 100, so the last two digits go round 25, 50, 75, 00.",
      wrong: [["Sometimes. Some end in 30.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 5."]],
    },
    {
      statement: "Sam counts in 25s from 0 and says he will say 210.",
      truth: false,
      right: "False. The multiples of 25 near it are 200 and 225.",
      wrong: [
        ["True. 210 is a big round number.", "NPV.SEQUENCE.STEP-ONE"],
        ["True. 21 × 10 = 210."],
      ],
    },
  ]),
);
