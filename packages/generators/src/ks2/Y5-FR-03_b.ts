/**
 * @statement Y5-FR-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-03.b: Convert mixed numbers to improper fractions
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-03.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-FR-03.b", depths: [1, 4] }, [
    {
      statement: "Raj says $3\\frac{1}{2} = \\frac{7}{2}$.",
      truth: true,
      right: "True. 3 wholes is 6 halves, and 1 more half makes 7 halves.",
      wrong: [["False. It is 4/2.", "FR.MIXED.CONVERT"], ["False. It is 31/2."]],
    },
    {
      statement: "Ana says $2\\frac{3}{5} = \\frac{5}{5}$.",
      truth: false,
      right: "False. 2 wholes is 10 fifths, and 3 more makes 13/5.",
      wrong: [
        ["True. 2 + 3 = 5.", "FR.MIXED.CONVERT"],
        ["True. The whole number is added to the top."],
      ],
    },
    {
      claim: "A mixed number is bigger than 1.",
      truth: "always",
      right: "Always. It has at least one whole, plus a fraction.",
      wrong: [
        ["Sometimes. 1 1/2 is less than 1.", "FR.MIXED.CONVERT"],
        ["Never. It is a fraction."],
      ],
    },
  ]),
);
