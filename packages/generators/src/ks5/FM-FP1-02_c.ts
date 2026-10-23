/**
 * @statement FM-FP1-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-02.c: Work with the hyperbola and rectangular hyperbola
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-02.ts";

const own = concept(
  "FM-FP1-02.c",
  ["GEO.CONIC"],
  [
    {
      question: "Which is a rectangular hyperbola?",
      correct: "$xy = 16$",
      wrong: [
        ["$x^2 + y^2 = 16$", "That is a circle.", "GEO.CONIC"],
        ["$y^2 = 16x$", "That is a parabola.", "GEO.CONIC"],
      ],
      why: "$xy = c^2$ is a rectangular hyperbola, with the axes as asymptotes.",
    },
    {
      question: "What are the asymptotes of $\\frac{x^2}{16} - \\frac{y^2}{9} = 1$?",
      correct: "$y = \\pm\\frac{3}{4}x$",
      wrong: [
        [
          "$y = \\pm\\frac{4}{3}x$",
          "For x²/a² − y²/b² = 1 the asymptotes are y = ±(b/a)x.",
          "GEO.CONIC",
        ],
        ["$y = \\pm\\frac{9}{16}x$", "Use a = 4 and b = 3, not a² and b².", "GEO.CONIC"],
      ],
      why: "$a = 4$, $b = 3$, so $y = \\pm\\frac{b}{a}x = \\pm\\frac{3}{4}x$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-02.c" };

export default defineGenerator(mixFamilies("FM-FP1-02.c", { 1: own, 2: own, 4: base }));
