/**
 * @statement Y2-MEA-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.d: Measure capacity in l and ml
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-01.d",
      depths: [1, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), kind: "jug" as const }),
    },
    [
      {
        claim: "A jug with more water in it shows a higher number on its scale.",
        truth: "always",
        right: "Always, for the same jug. More water reaches higher up the scale.",
        wrong: [
          ["Never. More water shows less.", "MEA.SCALE.INTERVAL"],
          ["Sometimes. Only for big jugs."],
        ],
      },
      {
        statement:
          "A jug's scale goes up in 10s. The water is at the mark after 50 ml. Leo says it holds 60 ml.",
        truth: true,
        right: "True. Each mark is 10 ml: 50, 60.",
        wrong: [["False. It holds 51 ml.", "MEA.SCALE.INTERVAL"], ["False. It holds 50 ml."]],
      },
      {
        statement: "A jug's scale goes up in 100s. Raj says the mark after 200 ml is 201 ml.",
        truth: false,
        right: "False. Each mark is 100 ml: the next is 300 ml.",
        wrong: [
          ["True. Count on 1.", "MEA.SCALE.INTERVAL"],
          ["True. The marks always go up in 1s."],
        ],
      },
    ],
  ),
);
