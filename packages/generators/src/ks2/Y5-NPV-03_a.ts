/**
 * @statement Y5-NPV-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-NPV-03.a: Interpret negative numbers in context
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-NPV-03.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-NPV-03.a", depths: [3, 4] }, [
    {
      statement: "The temperature is 4°C and falls by 6 degrees. Leo says it is now −2°C.",
      truth: true,
      right: "True. Count down 4 to 0, then 2 more to −2°C.",
      wrong: [["False. It is 2°C.", "NPV.NEGATIVE.MIRROR"], ["False. It is −10°C."]],
    },
    {
      statement: "Kim says −3 is bigger than −1.",
      truth: false,
      right: "False. On a number line −3 is further left, so −3 is smaller than −1.",
      wrong: [
        ["True. 3 is bigger than 1.", "NPV.NEGATIVE.ORDER"],
        ["True. Further from zero is bigger.", "NPV.NEGATIVE.MIRROR"],
      ],
    },
    {
      claim: "A negative number is smaller than zero.",
      truth: "always",
      right: "Always. Negative numbers are to the left of zero on a number line.",
      wrong: [
        ["Sometimes. −10 is bigger than 0.", "NPV.NEGATIVE.ORDER"],
        ["Never. Negatives are big numbers."],
      ],
    },
  ]),
);
