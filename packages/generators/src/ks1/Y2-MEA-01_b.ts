/**
 * @statement Y2-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.b: Measure mass in kg and g
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-01.b",
      depths: [1, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), kind: "scales" as const }),
    },
    [
      {
        claim: "To read a scale, you need to know what each small mark is worth.",
        truth: "always",
        right: "Always. The marks can go up in 1s, 2s, 5s or 10s.",
        wrong: [
          ["Never. Every mark is worth 1.", "MEA.SCALE.INTERVAL"],
          ["Sometimes. Only on rulers."],
        ],
      },
      {
        statement:
          "A scale goes 0, 10, 20 with one mark halfway between each number. Sam says the halfway mark between 10 and 20 is 15.",
        truth: true,
        right: "True. Halfway between 10 and 20 is 15.",
        wrong: [["False. It is 11.", "MEA.SCALE.INTERVAL"], ["False. It is 12."]],
      },
      {
        statement:
          "A ruler starts at 0. Mia measures a pencil from the 1 cm mark to the 7 cm mark and says it is 7 cm long.",
        truth: false,
        right: "False. From 1 to 7 is 6 cm. Start at 0, or take away the start.",
        wrong: [
          ["True. Read the end of the pencil.", "MEA.RULER.END"],
          ["True. Rulers start at 1."],
        ],
      },
    ],
  ),
);
