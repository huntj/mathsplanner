/**
 * @statement Y4-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MEA-01.b: Convert between units of mass and capacity
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y4-MEA-01.b",
      depths: [1, 2, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), pair: rng.pick([3, 4]) }),
    },
    [
      {
        claim: "There are 1000 millilitres in a litre.",
        truth: "always",
        right: "Always. Milli means a thousandth.",
        wrong: [
          ["Never. There are 100.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. It depends on the jug."],
        ],
      },
      {
        statement: "Bea says 3 kg is 3000 g.",
        truth: true,
        right: "True. 1 kg = 1000 g, so 3 kg = 3000 g.",
        wrong: [["False. It is 300 g.", "MEA.CONVERT.FACTOR"], ["False. It is 30 g."]],
      },
      {
        claim: "There are 100 grams in a kilogram.",
        truth: "never",
        right: "Never. There are 1000 grams in a kilogram.",
        wrong: [
          ["Always. Like 100 cm in a metre.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. For heavy things."],
        ],
      },
    ],
  ),
);
