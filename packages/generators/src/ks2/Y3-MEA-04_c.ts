/**
 * @statement Y3-MEA-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-04.c: Use the 24-hour clock
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-MEA-04.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-MEA-04.c", depths: [2, 3, 4] }, [
    {
      statement: "Mia says 15:00 is 3 pm.",
      truth: true,
      right: "True. Take 12 from hours after midday: 15 − 12 = 3.",
      wrong: [["False. It is 5 pm.", "MEA.TIME.24-HOUR"], ["False. It is 15 pm."]],
    },
    {
      claim: "Times after midday have an hour of 12 or more on a 24-hour clock.",
      truth: "always",
      right: "Always. 1 pm is 13:00, 2 pm is 14:00, and so on.",
      wrong: [
        ["Never. They start again at 1.", "MEA.TIME.24-HOUR"],
        ["Sometimes. Only in the evening."],
      ],
    },
    {
      statement: "Leo says 8 pm is 18:00.",
      truth: false,
      right: "False. Add 12 to pm hours: 8 + 12 = 20, so 20:00.",
      wrong: [["True. Add 10.", "MEA.TIME.24-HOUR"], ["True. 8 pm is 08:00."]],
    },
  ]),
);
