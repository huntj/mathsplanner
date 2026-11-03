/**
 * @statement Y6-NPV-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-NPV-03.a: Use negative numbers in context
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-NPV-03.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-NPV-03.a", depths: [1, 4] }, [
    {
      statement: "The temperature is −3°C and rises by 5 degrees. Leo says it is now 2°C.",
      truth: true,
      right: "True. Count up from −3: 3 steps to 0, then 2 more to 2°C.",
      wrong: [["False. It is 8°C, as 3 + 5 = 8.", "NPV.NEGATIVE.MIRROR"], ["False. It is −8°C."]],
    },
    {
      statement: "Kim says −7°C is warmer than −2°C, because 7 is bigger than 2.",
      truth: false,
      right: "False. −7 is further below zero, so −7°C is colder.",
      wrong: [
        ["True. Bigger numbers are warmer.", "NPV.NEGATIVE.MIRROR"],
        ["True. Both are cold, so the bigger number wins."],
      ],
    },
    {
      claim: "A temperature below zero is colder than any temperature above zero.",
      truth: "always",
      right: "Always. Every temperature below 0°C is lower than every temperature above 0°C.",
      wrong: [
        ["Sometimes. −1°C is warmer than 10°C.", "NPV.NEGATIVE.MIRROR"],
        ["Never. It depends on the numbers."],
      ],
    },
  ]),
);
