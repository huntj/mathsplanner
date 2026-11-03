/**
 * @statement Y5-FR-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-05.b: Multiply mixed numbers by whole numbers
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-05.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-FR-05.b",
      depths: [1, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        return { ...p, w: rng.int(1, 3) };
      },
    },
    [
      {
        statement: "Dev says $2 \\times 1\\frac{1}{3} = 2\\frac{2}{3}$.",
        truth: true,
        right: "True. 2 × 1 = 2 and 2 × 1/3 = 2/3.",
        wrong: [
          ["False. It is 2 1/3.", "FR.MULTIPLY.BOTH"],
          ["False. It is 2 2/6.", "FR.MULTIPLY.BOTH"],
        ],
      },
      {
        statement: "Amy says $3 \\times 2\\frac{1}{2} = 6\\frac{1}{2}$.",
        truth: false,
        right: "False. 3 × 2 = 6 and 3 × 1/2 = 1 1/2, so it is 7 1/2.",
        wrong: [
          ["True. Multiply the whole number only.", "FR.MULTIPLY.BOTH"],
          ["True. The fraction part stays the same."],
        ],
      },
      {
        claim: "Multiplying a mixed number by 2 gives more than 2.",
        truth: "always",
        right: "Always. A mixed number is more than 1, so double it is more than 2.",
        wrong: [
          ["Sometimes. Only with big fractions.", "FR.MULTIPLY.BOTH"],
          ["Never. Fractions make things smaller."],
        ],
      },
    ],
  ),
);
