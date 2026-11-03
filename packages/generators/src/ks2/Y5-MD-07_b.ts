/**
 * @statement Y5-MD-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-07.b: Multiply and divide decimals by 10, 100 and 1000
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-MD-07.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y5-MD-07.b",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        return { ...p, d: p.d || 1 };
      },
    },
    [
      {
        statement: "Ana says $3.6 \\times 10 = 36$.",
        truth: true,
        right: "True. Every digit moves one place to the left: 3 ones become 3 tens.",
        wrong: [
          ["False. It is 3.60.", "NPV.POWERS10.APPEND-ZEROS"],
          ["False. It is 0.36.", "NPV.POWERS10.WRONG-WAY"],
        ],
      },
      {
        statement: "Dan says $7.2 \\div 100 = 720$.",
        truth: false,
        right: "False. Dividing by 100 moves every digit two places to the right: 0.072.",
        wrong: [
          ["True. Move two places.", "NPV.POWERS10.WRONG-WAY"],
          ["True. 100 makes it bigger."],
        ],
      },
      {
        claim: "Writing a 0 on the end of a decimal multiplies it by 10.",
        truth: "never",
        right: "Never. 4.5 and 4.50 are the same number. To multiply by 10, move the digits.",
        wrong: [
          ["Always. Adding a 0 multiplies by 10.", "NPV.POWERS10.APPEND-ZEROS"],
          ["Sometimes. Only with one decimal place."],
        ],
      },
    ],
  ),
);
