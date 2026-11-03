/**
 * @statement Y2-MEA-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-06.a: Tell the time to quarter past and quarter to
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-06.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-06.a",
      params: (rng, numbers) => ({ ...def.params(rng, numbers), minutes: rng.pick([15, 45]) }),
    },
    [
      {
        claim: "When the minute hand points to 12, it is an o'clock time.",
        truth: "always",
        right: "Always. The minute hand at 12 means no minutes past.",
        wrong: [
          ["Never. It means 12 minutes.", "MEA.CLOCK.MINUTE-NUMBER"],
          ["Sometimes. Only at lunch time."],
        ],
      },
      {
        statement: "The minute hand points to 6. Sam says it is half past.",
        truth: true,
        right: "True. The minute hand at 6 is halfway round: 30 minutes past.",
        wrong: [
          ["False. It is 6 minutes past.", "MEA.CLOCK.MINUTE-NUMBER"],
          ["False. It is 6 o'clock."],
        ],
      },
      {
        statement: "The minute hand points to 3. Mia says it is 3 minutes past.",
        truth: false,
        right:
          "False. Each number is 5 minutes for the minute hand: at 3 it is quarter past, 15 minutes.",
        wrong: [
          ["True. The number shows the minutes.", "MEA.CLOCK.MINUTE-NUMBER"],
          ["True. 3 is 3."],
        ],
      },
    ],
  ),
);
