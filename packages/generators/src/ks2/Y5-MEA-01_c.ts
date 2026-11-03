/**
 * @statement Y5-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MEA-01.c: Convert between l and ml
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y5-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-MEA-01.c",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.pair !== 4) reject("a question for this step");
        return p;
      },
    },
    [
      {
        statement: "Kim says 2,500 ml is 25 l.",
        truth: false,
        right: "False. 1000 ml = 1 l, so 2,500 ml = 2.5 l.",
        wrong: [["True. Divide by 100.", "MEA.CONVERT.FACTOR"], ["True. Take off the two zeros."]],
      },
      {
        statement: "Gus says half a litre is 500 ml.",
        truth: true,
        right: "True. 1 l = 1000 ml, and half of 1000 is 500.",
        wrong: [["False. It is 50 ml.", "MEA.CONVERT.FACTOR"], ["False. It is 0.5 ml."]],
      },
      {
        claim: "Changing litres to millilitres gives a bigger number.",
        truth: "always",
        right:
          "Always, for any amount above zero. Millilitres are smaller, so you need more of them.",
        wrong: [
          ["Never. Millilitres are smaller, so the number is smaller.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. Only for whole litres."],
        ],
      },
    ],
  ),
);
