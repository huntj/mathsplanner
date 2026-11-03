/**
 * @statement Y2-MEA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-02.a: Compare and order lengths
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-02.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-02.a",
      depths: [1, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), unit: rng.pick([0, 4]) }),
    },
    [
      {
        claim: "1 metre is longer than 50 cm.",
        truth: "always",
        right: "Always. 1 m is 100 cm.",
        wrong: [
          ["Never. 50 is bigger than 1.", "MEA.UNITS.MIXED"],
          ["Sometimes. It depends what you measure."],
        ],
      },
      {
        statement: "Sam says a 30 cm ruler is shorter than a 40 cm ruler.",
        truth: true,
        right: "True. 30 cm is less than 40 cm.",
        wrong: [
          ["False. 30 cm is longer.", "NPV.COMPARE.SIGN-DIRECTION"],
          ["False. They are the same."],
        ],
      },
      {
        statement: "Mia writes 75 cm > 1 m.",
        truth: false,
        right: "False. 1 m is 100 cm, so 75 cm < 1 m.",
        wrong: [
          ["True. 75 is bigger than 1.", "MEA.UNITS.MIXED"],
          ["True. The arrow opens to 75.", "NPV.COMPARE.SIGN-DIRECTION"],
        ],
      },
    ],
  ),
);
