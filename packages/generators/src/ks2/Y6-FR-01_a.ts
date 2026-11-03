/**
 * @statement Y6-FR-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-01.a: Simplify fractions using common factors
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-FR-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-FR-01.a", depths: [1, 4] }, [
    {
      claim:
        "Dividing the top and bottom of a fraction by the same number gives an equal fraction.",
      truth: "always",
      right: "Always. You are just sharing both into the same number of groups.",
      wrong: [
        ["Never. The fraction gets smaller.", "FR.EQUIV.ADD-SAME"],
        ["Sometimes. Only when you divide by 2."],
      ],
    },
    {
      claim: "A fraction with an odd numerator can be simplified.",
      truth: "sometimes",
      right: "Sometimes. 3/9 simplifies to 1/3, but 3/8 cannot be simplified.",
      wrong: [
        ["Never. Odd numbers cannot be halved.", "FR.EQUIV.ADD-SAME"],
        ["Always. Every fraction simplifies."],
      ],
    },
    {
      statement: "Ivy says $\\frac{15}{20}$ in its simplest form is $\\frac{3}{4}$.",
      truth: true,
      right: "True. 5 is the biggest number that divides 15 and 20: 15 ÷ 5 = 3 and 20 ÷ 5 = 4.",
      wrong: [
        ["False. It is 14/19, taking 1 from each.", "FR.EQUIV.ADD-SAME"],
        ["False. 15/20 cannot be simplified."],
      ],
    },
  ]),
);
