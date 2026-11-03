/**
 * @statement Y5-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-01.b: Convert between kg and g
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-MEA-01.b",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.pair !== 3) reject("a question for this step");
        return p;
      },
    },
    [
      {
        statement: "Sol says 3,500 g is 35 kg.",
        truth: false,
        right: "False. 1000 g = 1 kg, so 3,500 g = 3.5 kg.",
        wrong: [["True. Divide by 100.", "MEA.CONVERT.FACTOR"], ["True. Take off the two zeros."]],
      },
      {
        statement: "Ana says 1.2 kg is 1,200 g.",
        truth: true,
        right: "True. 1.2 × 1000 = 1,200.",
        wrong: [["False. It is 120 g.", "MEA.CONVERT.FACTOR"], ["False. It is 12 g."]],
      },
      {
        claim: "There are 1000 grams in a kilogram.",
        truth: "always",
        right: "Always. Kilo means a thousand.",
        wrong: [
          ["Never. There are 100.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. It depends what is being weighed."],
        ],
      },
    ],
  ),
);
