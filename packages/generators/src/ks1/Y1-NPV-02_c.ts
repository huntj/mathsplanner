/**
 * @statement Y1-NPV-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.c: Count in 5s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y1-NPV-02.c", { friendly: [5], standard: [5], stretch: [5] }), [
    {
      statement: "Raj counts in 5s from 0: 5, 10, 15, 20.",
      truth: true,
      right: "True. Each step adds 5.",
      wrong: [["False. It goes 5, 6, 7.", "NPV.SEQUENCE.STEP-ONE"], ["False. It goes 5, 10, 20."]],
    },
    {
      claim: "Counting in 5s from 0, every number ends in 5 or 0.",
      truth: "always",
      right: "Always. 5, 10, 15, 20 …",
      wrong: [["Sometimes. 12 is in it.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 1."]],
    },
    {
      statement: "Ola counts in 5s from 0 and says 22.",
      truth: false,
      right: "False. 20, 25: counting in 5s jumps over 22.",
      wrong: [["True. 22 is after 20.", "NPV.SEQUENCE.STEP-ONE"], ["True. You say every number."]],
    },
  ]),
);
