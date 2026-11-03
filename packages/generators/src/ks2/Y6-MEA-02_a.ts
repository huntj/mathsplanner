/**
 * @statement Y6-MEA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-02.a: Convert between units of length and mass
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-MEA-02.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y6-MEA-02.a",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.kind < 1 || p.kind > 3) reject("a question for this step");
        return p;
      },
    },
    [
      {
        statement: "Leo says 3.4 km is 3400 m.",
        truth: true,
        right: "True. 1 km = 1000 m, so 3.4 × 1000 = 3400 m.",
        wrong: [["False. It is 340 m.", "MEA.CONVERT.FACTOR"], ["False. It is 34 m."]],
      },
      {
        claim: "Changing kilograms to grams gives a bigger number.",
        truth: "always",
        right: "Always, for an amount above zero. Grams are smaller, so you need more of them.",
        wrong: [
          ["Never. Grams are smaller, so the number is smaller.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. Only for whole kilograms."],
        ],
      },
      {
        statement: "Pia says 750 g is heavier than 1.2 kg, because 750 is bigger than 1.2.",
        truth: false,
        right: "False. 1.2 kg = 1200 g, which is heavier than 750 g.",
        wrong: [
          ["True. Compare 750 and 1.2.", "MEA.CONVERT.FACTOR"],
          ["True. 1.2 kg is a short decimal.", "NPV.DECIMAL.LONGER-BIGGER"],
        ],
      },
    ],
  ),
);
