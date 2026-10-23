/**
 * @statement FM-FP1-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-02.b: Work with the ellipse
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-02.ts";

const own = concept(
  "FM-FP1-02.b",
  ["GEO.CONIC"],
  [
    {
      question: "Where does the ellipse $\\frac{x^2}{25} + \\frac{y^2}{9} = 1$ cross the x-axis?",
      correct: "$(\\pm 5, 0)$",
      wrong: [
        ["$(\\pm 25, 0)$", "Set y = 0: x² = 25, so x = ±5.", "ALG.CIRCLE.RADIUS-SQUARED"],
        [
          "$(\\pm 3, 0)$",
          "3 is the semi-axis along y; the x-intercepts come from 25.",
          "GEO.CONIC",
        ],
      ],
      why: "With $y = 0$, $x^2 = 25$ so $x = \\pm 5$.",
    },
  ],
  [
    {
      statement: "Di says the eccentricity of an ellipse can be greater than 1.",
      truth: false,
      right: "False. An ellipse has 0 ≤ e < 1. e = 1 gives a parabola and e > 1 a hyperbola.",
      wrong: [
        ["True. Long thin ellipses have e > 1.", "GEO.CONIC"],
        ["True. e is the ratio of the semi-axes.", "GEO.CONIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-02.b" };

export default defineGenerator(mixFamilies("FM-FP1-02.b", { 1: own, 2: base, 4: own }));
