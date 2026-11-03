/**
 * @statement Y5-FR-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-05.a: Multiply proper fractions by whole numbers
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-05.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-FR-05.a",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        return { ...p, w: 0 };
      },
    },
    [
      {
        statement: "Kit says $3 \\times \\frac{2}{7} = \\frac{6}{7}$.",
        truth: true,
        right: "True. 3 lots of 2 sevenths is 6 sevenths.",
        wrong: [["False. It is 6/21.", "FR.MULTIPLY.BOTH"], ["False. It is 5/7."]],
      },
      {
        claim: "Multiplying a fraction by a whole number changes the denominator.",
        truth: "never",
        right:
          "Never. The parts stay the same size; you just have more of them, so only the numerator changes.",
        wrong: [
          ["Always. Multiply the top and the bottom.", "FR.MULTIPLY.BOTH"],
          ["Sometimes. When the answer is more than 1."],
        ],
      },
      {
        statement: "Sol says $4 \\times \\frac{1}{4} = 1$.",
        truth: true,
        right: "True. 4 quarters make 1 whole.",
        wrong: [["False. It is 4/16.", "FR.MULTIPLY.BOTH"], ["False. It is 1/16."]],
      },
    ],
  ),
);
