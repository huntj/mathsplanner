/**
 * @statement Y1-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-06.b: Tell the time to half past the hour
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y1-MEA-06.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y1-MEA-06.b",
      params: (rng, numbers) => ({ ...def.params(rng, numbers), half: true }),
    },
    [
      {
        claim: "At half past, the minute hand points to 6.",
        truth: "always",
        right: "Always. Half way round the clock is the 6.",
        wrong: [
          ["Never. It points to 12.", "MEA.CLOCK.HANDS"],
          ["Sometimes. Only in the morning."],
        ],
      },
      {
        statement:
          "At 3 o'clock, Sam says the minute hand points to 12 and the hour hand points to 3.",
        truth: true,
        right: "True. O'clock means the minute hand is at 12.",
        wrong: [
          ["False. The minute hand points to 3.", "MEA.CLOCK.HANDS"],
          ["False. The hour hand points to 12.", "MEA.CLOCK.HANDS"],
        ],
      },
      {
        statement: "Kim says at half past 4 the hour hand points exactly at 5.",
        truth: false,
        right: "False. At half past 4 the hour hand is halfway between 4 and 5.",
        wrong: [
          ["True. It moves to the next number.", "MEA.CLOCK.HOUR-AHEAD"],
          ["True. Half past means the next hour.", "MEA.CLOCK.HOUR-AHEAD"],
        ],
      },
    ],
  ),
);
