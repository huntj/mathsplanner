/**
 * @statement Y1-NPV-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.b: Count in 2s
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y1-NPV-02.b", { friendly: [2], standard: [2], stretch: [2] }), [
    {
      statement: "Ben counts in 2s from 0: 2, 4, 6, 8.",
      truth: true,
      right: "True. Each step adds 2.",
      wrong: [["False. It goes 2, 3, 4.", "NPV.SEQUENCE.STEP-ONE"], ["False. It goes 2, 4, 8."]],
    },
    {
      claim: "Counting in 2s from 0 gives even numbers.",
      truth: "always",
      right: "Always. 2, 4, 6, 8, 10: they are all even.",
      wrong: [["Sometimes. 5 is in it.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They are odd."]],
    },
    {
      statement: "Kim counts in 2s from 0 and says 7.",
      truth: false,
      right: "False. Counting in 2s goes 6, 8 and jumps over 7.",
      wrong: [["True. 7 comes after 6.", "NPV.SEQUENCE.STEP-ONE"], ["True. You say every number."]],
    },
  ]),
);
