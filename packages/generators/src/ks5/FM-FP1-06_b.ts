/**
 * @statement FM-FP1-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-06.b: Solve differential equations by reducing them with a substitution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-06.ts";

const own = concept(
  "FM-FP1-06.b",
  ["CALC.SEPARABLE"],
  [
    {
      question: "The substitution $y = vx$ is used in $\\frac{dy}{dx} = \\frac{x + y}{x}$.",
      ask: "Which equation in v does it give?",
      correct: "$v + x\\frac{dv}{dx} = 1 + v$",
      wrong: [
        [
          "$\\frac{dv}{dx} = 1 + v$",
          "dy/dx = v + x dv/dx by the product rule.",
          "CALC.PRODUCT-RULE",
        ],
        [
          "$x\\frac{dv}{dx} = 1 + v$",
          "Keep the v from the product rule on the left.",
          "CALC.PRODUCT-RULE",
        ],
      ],
      why: "$\\frac{dy}{dx} = v + x\\frac{dv}{dx}$ and $\\frac{x + vx}{x} = 1 + v$, so $x\\frac{dv}{dx} = 1$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-06.b" };

export default defineGenerator(mixFamilies("FM-FP1-06.b", { 1: own, 2: base, 4: base }));
