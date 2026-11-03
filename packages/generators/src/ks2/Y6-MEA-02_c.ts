/**
 * @statement Y6-MEA-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-02.c: Convert between units of time
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-MEA-02.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y6-MEA-02.c",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.kind < 4) reject("a question for this step");
        return p;
      },
    },
    [
      {
        statement: "Ivy says 3 hours is 180 minutes.",
        truth: true,
        right: "True. 1 hour = 60 minutes, and 3 × 60 = 180.",
        wrong: [["False. It is 300 minutes.", "MEA.CONVERT.FACTOR"], ["False. It is 30 minutes."]],
      },
      {
        statement: "Ben says 2.5 hours is 2 hours 50 minutes.",
        truth: false,
        right: "False. 0.5 hours is half an hour, 30 minutes: 2 hours 30 minutes.",
        wrong: [
          ["True. The .5 is 50 minutes.", "MEA.TIME.DECIMAL"],
          ["True. Hours work like decimals.", "MEA.TIME.DECIMAL"],
        ],
      },
      {
        claim: "There are 100 minutes in an hour.",
        truth: "never",
        right: "Never. There are 60 minutes in an hour.",
        wrong: [
          ["Always. Time works in hundreds like other units.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. On digital clocks."],
        ],
      },
    ],
  ),
);
