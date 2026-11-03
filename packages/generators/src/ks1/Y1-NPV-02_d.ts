/**
 * @statement Y1-NPV-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.d: Count in 10s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y1-NPV-02.d", { friendly: [10], standard: [10], stretch: [10] }), [
    {
      statement: "Sam counts in 10s from 0: 10, 20, 30, 40.",
      truth: true,
      right: "True. Each step adds 10.",
      wrong: [
        ["False. It goes 10, 11, 12.", "NPV.SEQUENCE.STEP-ONE"],
        ["False. It goes 10, 20, 40."],
      ],
    },
    {
      claim: "Counting in 10s from 0, every number ends in 0.",
      truth: "always",
      right: "Always. 10, 20, 30 … all end in 0.",
      wrong: [["Sometimes. 15 is in it.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 1."]],
    },
    {
      statement: "Mia counts in 10s from 0 and says 35.",
      truth: false,
      right: "False. 30, 40: counting in 10s jumps over 35.",
      wrong: [
        ["True. 35 is between 30 and 40.", "NPV.SEQUENCE.STEP-ONE"],
        ["True. You say every number."],
      ],
    },
  ]),
);
