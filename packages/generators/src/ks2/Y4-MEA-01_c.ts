/**
 * @statement Y4-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-01.c: Convert between units of time
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y4-MEA-01.c",
      depths: [1, 2, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), pair: rng.pick([5, 6]) }),
    },
    [
      {
        claim: "There are 60 minutes in an hour.",
        truth: "always",
        right: "Always. An hour is 60 minutes, and a minute is 60 seconds.",
        wrong: [["Never. There are 100.", "MEA.TIME.FACTS"], ["Sometimes. In the morning."]],
      },
      {
        statement: "Ali says a day has 24 hours.",
        truth: true,
        right: "True. A day is 24 hours from one midnight to the next.",
        wrong: [
          ["False. It has 12 hours.", "MEA.TIME.FACTS"],
          ["False. It has 100 hours.", "MEA.CONVERT.FACTOR"],
        ],
      },
      {
        statement: "Mia says 2 weeks is 12 days.",
        truth: false,
        right: "False. A week is 7 days, so 2 weeks is 14 days.",
        wrong: [
          ["True. A week is 6 days.", "MEA.TIME.FACTS"],
          ["True. 2 weeks is 10 days and 2 more."],
        ],
      },
    ],
  ),
);
