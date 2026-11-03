/**
 * @statement Y4-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-01.c: Count in multiples of 1000
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countInSteps("Y4-NPV-01.c", { friendly: [1000], standard: [1000], stretch: [1000] }), [
    {
      statement: "Ava counts in 1000s from 0 and says she will say 7,000.",
      truth: true,
      right: "True. 1000, 2000, … , 7000.",
      wrong: [
        ["False. She will say 7,100.", "NPV.SEQUENCE.STEP-ONE"],
        ["False. Counting in 1000s skips 7000."],
      ],
    },
    {
      claim: "Counting in 1000s from 0 gives numbers that end in 000.",
      truth: "always",
      right: "Always. Each step adds one thousand, so the last three digits stay 000.",
      wrong: [["Sometimes. 1,500 is one.", "NPV.SEQUENCE.STEP-ONE"], ["Never. They end in 1."]],
    },
    {
      statement: "Raj counts on in 1000s from 250. He says the next number after 3,250 is 3,350.",
      truth: false,
      right: "False. Adding 1000 changes the thousands digit: 4,250.",
      wrong: [
        ["True. Add one to the hundreds.", "NPV.SEQUENCE.STEP-ONE"],
        ["True. Counting on adds 100."],
      ],
    },
  ]),
);
