/**
 * @statement Y2-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.b: Count in steps of 3 from 0
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y2-NPV-01.b", { friendly: [3], standard: [3], stretch: [3] }), [
    {
      statement: "Kai counts in 3s from 0. He says he will say 20.",
      truth: false,
      right: "False. 18, 21: counting in 3s jumps over 20.",
      wrong: [
        ["True. 20 is near 21.", "NPV.SEQUENCE.STEP-ONE"],
        ["True. You say every number in the end."],
      ],
    },
    {
      claim: "When you count in 3s from 0, you say 3, 6, 9.",
      truth: "always",
      right: "Always. Each step adds 3.",
      wrong: [
        ["Never. It goes 3, 4, 5.", "NPV.SEQUENCE.STEP-ONE"],
        ["Sometimes. Only on Mondays."],
      ],
    },
    {
      statement: "Ana counts in 3s from 0. She says 12 comes after 9.",
      truth: true,
      right: "True. 9 + 3 = 12.",
      wrong: [["False. 10 comes after 9.", "NPV.SEQUENCE.STEP-ONE"], ["False. 13 comes after 9."]],
    },
  ]),
);
