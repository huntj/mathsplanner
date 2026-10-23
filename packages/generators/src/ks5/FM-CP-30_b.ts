/**
 * @statement FM-CP-30.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-30.b: Model damped oscillations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-30.ts";

const own = concept(
  "FM-CP-30.b",
  ["CALC.SHM", "CALC.AUXILIARY"],
  [
    {
      question: "The motion $\\ddot{x} + 6\\dot{x} + 5x = 0$ is damped.",
      ask: "What type of damping is it?",
      correct: "Heavy damping",
      wrong: [
        [
          "Light damping",
          "The auxiliary equation has discriminant 36 − 20 > 0: two real roots.",
          "CALC.AUXILIARY",
        ],
        [
          "Critical damping",
          "Critical damping needs a repeated root: 36 − 20 is not 0.",
          "CALC.AUXILIARY",
        ],
      ],
      why: "$m^2 + 6m + 5 = 0$ has real distinct roots $-1$ and $-5$: heavy damping, no oscillation.",
    },
    {
      question: "The motion $\\ddot{x} + 2\\dot{x} + 10x = 0$ is damped.",
      ask: "What type of damping is it?",
      correct: "Light damping",
      wrong: [
        ["Heavy damping", "The discriminant 4 − 40 is negative: complex roots.", "CALC.AUXILIARY"],
        ["Critical damping", "Critical damping needs a zero discriminant.", "CALC.AUXILIARY"],
      ],
      why: "$m^2 + 2m + 10 = 0$ has roots $-1 \\pm 3i$: light damping, decaying oscillations.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-30.b" };

export default defineGenerator(mixFamilies("FM-CP-30.b", { 1: own, 2: own, 4: base }));
