/**
 * @statement Y5-MD-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-07.a: Multiply and divide whole numbers by 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-07.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-MD-07.a",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        return { ...p, d: 0 };
      },
    },
    [
      {
        statement: "Mo says $460 \\div 10 = 46$.",
        truth: true,
        right: "True. Dividing by 10 moves every digit one place to the right.",
        wrong: [["False. It is 4,600.", "NPV.POWERS10.WRONG-WAY"], ["False. It is 460.0."]],
      },
      {
        statement: "Pia says $35 \\times 100 = 350$.",
        truth: false,
        right: "False. Multiplying by 100 moves every digit two places to the left: 3,500.",
        wrong: [
          ["True. Add one zero.", "NPV.POWERS10.APPEND-ZEROS"],
          ["True. 35 and 100 make 350."],
        ],
      },
      {
        claim: "Multiplying a whole number by 1000 makes it 1000 times bigger.",
        truth: "always",
        right: "Always, for a number bigger than 0. Every digit moves three places to the left.",
        wrong: [
          ["Sometimes. Only if it ends in 0.", "NPV.POWERS10.APPEND-ZEROS"],
          ["Never. It adds 1000.", "NPV.POWERS10.WRONG-WAY"],
        ],
      },
    ],
  ),
);
