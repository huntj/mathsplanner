/**
 * @statement Y6-MEA-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-02.b: Convert between units of volume and capacity
import { defineGenerator, reject } from "@mathsplanner/core";
import parent from "./Y6-MEA-02.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y6-MEA-02.b",
      depths: [1, 2, 4],
      params(rng, numbers) {
        const p = def.params(rng, numbers);
        if (p.kind !== 0) reject("a question for this step");
        return p;
      },
    },
    [
      {
        statement: "Sam says 1.75 l is 1750 ml.",
        truth: true,
        right: "True. 1 l = 1000 ml, so 1.75 × 1000 = 1750 ml.",
        wrong: [["False. It is 175 ml.", "MEA.CONVERT.FACTOR"], ["False. It is 17.5 ml."]],
      },
      {
        claim: "1 cm³ holds 1 ml.",
        truth: "always",
        right: "Always. A 1 cm cube holds exactly 1 ml, so 1000 cm³ is 1 litre.",
        wrong: [
          ["Never. Volume and capacity are different things.", "MEA.CONVERT.FACTOR"],
          ["Sometimes. Only for water."],
        ],
      },
      {
        statement: "A jug holds 2 l. Mo pours out 600 ml and says 1.4 l is left.",
        truth: true,
        right: "True. 2 l = 2000 ml, and 2000 − 600 = 1400 ml = 1.4 l.",
        wrong: [
          ["False. 2 − 600 is less than nothing.", "MEA.CONVERT.FACTOR"],
          ["False. 1.6 l is left.", "NPV.DECIMAL.LONGER-BIGGER"],
        ],
      },
    ],
  ),
);
