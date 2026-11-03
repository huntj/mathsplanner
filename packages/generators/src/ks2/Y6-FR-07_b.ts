/**
 * @statement Y6-FR-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-07.b: Multiply and divide by 10, 100 and 1000 giving up to three decimal places
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-FR-07.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-FR-07.b", depths: [1, 4] }, [
    {
      statement: "Mia says $4.5 \\div 100 = 0.045$.",
      truth: true,
      right: "True. Dividing by 100 moves every digit two places to the right.",
      wrong: [
        ["False. It is 450.", "NPV.POWERS10.WRONG-WAY"],
        ["False. It is 4.500.", "NPV.POWERS10.APPEND-ZEROS"],
      ],
    },
    {
      statement: "Leo says $0.37 \\times 10 = 0.370$.",
      truth: false,
      right: "False. Multiplying by 10 moves every digit one place to the left: 3.7.",
      wrong: [
        ["True. Add a zero to multiply by 10.", "NPV.POWERS10.APPEND-ZEROS"],
        ["True. The point does not move."],
      ],
    },
    {
      claim: "Dividing a number by 1000 makes it smaller.",
      truth: "sometimes",
      right: "Sometimes. It does for positive numbers, but 0 ÷ 1000 is still 0.",
      wrong: [
        ["Never. It makes it bigger.", "NPV.POWERS10.WRONG-WAY"],
        ["Always, even for 0.", "FR.DECIMAL.PLACE"],
      ],
    },
  ]),
);
