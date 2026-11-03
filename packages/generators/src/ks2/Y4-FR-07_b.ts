/**
 * @statement Y4-FR-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-07.b: Divide a one- or two-digit number by 100
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-FR-07.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y4-FR-07.b",
      params: (rng, numbers) => ({ ...def.params(rng, numbers), by: 100 as const }),
    },
    [
      {
        statement: "Sam says $5 \\div 100 = 0.05$.",
        truth: true,
        right: "True. Dividing by 100 moves the digits two places to the right: 5 hundredths.",
        wrong: [
          ["False. It is 0.5.", "FR.DECIMAL.PLACE"],
          ["False. It is 500.", "NPV.POWERS10.WRONG-WAY"],
        ],
      },
      {
        claim: "Dividing by 100 is the same as dividing by 10 and then by 10 again.",
        truth: "always",
        right: "Always. 10 × 10 = 100.",
        wrong: [
          ["Never. It is the same as dividing by 20.", "NPV.POWERS10.WRONG-WAY"],
          ["Sometimes. Only for multiples of 10."],
        ],
      },
      {
        statement: "Ana says $64 \\div 100 = 6.4$.",
        truth: false,
        right: "False. That is 64 ÷ 10. 64 ÷ 100 = 0.64.",
        wrong: [
          ["True. Move the digits one place.", "FR.DECIMAL.PLACE"],
          ["True. The point goes between the 6 and the 4.", "FR.DECIMAL.PLACE"],
        ],
      },
    ],
  ),
);
