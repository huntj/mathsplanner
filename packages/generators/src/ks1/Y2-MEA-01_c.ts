/**
 * @statement Y2-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-01.c: Measure temperature in °C
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

const def = parent.definition;

export default defineGenerator(
  withClaims(
    {
      ...def,
      id: "Y2-MEA-01.c",
      depths: [1, 4],
      params: (rng, numbers) => ({ ...def.params(rng, numbers), kind: "thermometer" as const }),
    },
    [
      {
        claim: "A thermometer shows how hot or cold something is.",
        truth: "always",
        right: "Always. It measures temperature in degrees.",
        wrong: [
          ["Never. It measures length.", "MEA.SCALE.INTERVAL"],
          ["Sometimes. Only in winter."],
        ],
      },
      {
        statement: "A thermometer goes up in 2s. Kai says one mark above 10 °C is 12 °C.",
        truth: true,
        right: "True. Each mark is 2 degrees: 10, 12.",
        wrong: [["False. It is 11 °C.", "MEA.SCALE.INTERVAL"], ["False. It is 20 °C."]],
      },
      {
        statement: "A thermometer goes up in 5s. Ana says the mark after 20 °C is 21 °C.",
        truth: false,
        right: "False. Each mark is 5 degrees: the next mark is 25 °C.",
        wrong: [
          ["True. Every mark is 1.", "MEA.SCALE.INTERVAL"],
          ["True. Numbers go up in 1s.", "MEA.SCALE.INTERVAL"],
        ],
      },
    ],
  ),
);
