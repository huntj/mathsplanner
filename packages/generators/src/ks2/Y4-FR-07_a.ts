/**
 * @statement Y4-FR-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-07.a: Divide a one- or two-digit number by 10
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-FR-07.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y4-FR-07.a",
      params: (rng, numbers) => ({ ...def.params(rng, numbers), by: 10 as const }),
    },
    [
      {
        statement: "Kai says $46 \\div 10 = 4.6$.",
        truth: true,
        right: "True. Dividing by 10 moves every digit one place to the right.",
        wrong: [
          ["False. It is 460.", "NPV.POWERS10.WRONG-WAY"],
          ["False. It is 0.46.", "FR.DECIMAL.PLACE"],
        ],
      },
      {
        claim: "Dividing a number by 10 makes it smaller.",
        truth: "always",
        right: "Always, for a number above 0. You share it into 10 parts and take one.",
        wrong: [
          ["Never. It makes it 10 times bigger.", "NPV.POWERS10.WRONG-WAY"],
          ["Sometimes. Only for big numbers."],
        ],
      },
      {
        statement: "Pia says $9 \\div 10 = 0.09$.",
        truth: false,
        right: "False. 9 ÷ 10 is 9 tenths, which is 0.9.",
        wrong: [
          ["True. Put the 9 after a zero.", "FR.DECIMAL.PLACE"],
          ["True. Dividing by 10 gives hundredths.", "FR.DECIMAL.PLACE"],
        ],
      },
    ],
  ),
);
