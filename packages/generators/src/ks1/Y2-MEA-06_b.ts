/**
 * @statement Y2-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-06.b: Tell and write the time to five minutes
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y2-MEA-06.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-06.b",
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.minutes % 15 === 0) reject("not a quarter or half hour");
        return p;
      },
    },
    [
      {
        claim: "The minute hand goes all the way round the clock in one hour.",
        truth: "always",
        right: "Always. Once round is 60 minutes.",
        wrong: [
          ["Never. It takes 12 hours.", "MEA.CLOCK.HOUR-AHEAD"],
          ["Sometimes. Only in the day."],
        ],
      },
      {
        statement: "The minute hand points to 9. Leo says it is quarter to the next hour.",
        truth: true,
        right: "True. At 9 there are 15 minutes left until the next hour.",
        wrong: [
          ["False. It is 9 minutes past.", "MEA.CLOCK.MINUTE-NUMBER"],
          ["False. It is quarter past.", "MEA.CLOCK.PAST-TO"],
        ],
      },
      {
        statement: "The minute hand points to 2. Kim says it is 2 minutes past.",
        truth: false,
        right: "False. Count in 5s round the clock: at 2 it is 10 minutes past.",
        wrong: [
          ["True. The minute hand shows the minutes.", "MEA.CLOCK.MINUTE-NUMBER"],
          ["True. 2 means 2."],
        ],
      },
    ],
  ),
);
