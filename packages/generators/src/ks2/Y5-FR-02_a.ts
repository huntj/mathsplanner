/**
 * @statement Y5-FR-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-02.a: Find equivalent fractions
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-02.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-FR-02.a" }, [
    {
      claim:
        "Multiplying the top and bottom of a fraction by the same number gives an equivalent fraction.",
      truth: "always",
      right: "Always. You cut every part into the same number of smaller parts.",
      wrong: [
        ["Never. The fraction gets bigger.", "FR.EQUIV.ADD-SAME"],
        ["Sometimes. Only when you multiply by 2."],
      ],
    },
    {
      claim:
        "Adding the same number to the top and bottom of a fraction gives an equivalent fraction.",
      truth: "sometimes",
      right:
        "Sometimes. Only for fractions equal to 1, like 2/2 → 5/5. Otherwise it changes: 1/2 → 2/3.",
      wrong: [
        ["Always. Do the same to the top and bottom.", "FR.EQUIV.ADD-SAME"],
        ["Never. Even 2/2 changes."],
      ],
    },
    {
      statement: "Kai says $\\frac{2}{3} = \\frac{8}{12}$.",
      truth: true,
      right: "True. Multiply the top and bottom by 4.",
      wrong: [
        ["False. It is 6/12.", "FR.EQUIV.ADD-SAME"],
        ["False. Thirds and twelfths cannot be equal."],
      ],
    },
  ]),
);
