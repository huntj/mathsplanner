/**
 * @statement FM-CP-24.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-24.b: Sketch polar curves
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-24.ts";

const own = concept(
  "FM-CP-24.b",
  ["GEO.POLAR.CONVERT"],
  [
    {
      question: "Which describes the polar curve $\\theta = \\frac{\\pi}{3}$, $r \\ge 0$?",
      correct: "A half-line from the pole at angle $\\frac{\\pi}{3}$ to the initial line",
      wrong: [
        [
          "A circle of radius $\\frac{\\pi}{3}$",
          "θ fixed gives a direction; r fixed gives a circle.",
          "GEO.POLAR.CONVERT",
        ],
        [
          "A vertical line through $\\left(\\frac{\\pi}{3}, 0\\right)$",
          "Every point is at the same angle from the pole.",
          "GEO.POLAR.CONVERT",
        ],
      ],
      why: "Every point has the same angle, so the curve is a half-line from the pole.",
    },
    {
      question: "The curve $r = 2(1 + \\cos\\theta)$ is a cardioid.",
      ask: "What is its greatest distance from the pole?",
      correct: "4",
      wrong: [
        ["2", "r is greatest when cos θ = 1: r = 2 × 2.", "GEO.POLAR.CONVERT"],
        ["3", "cos θ is at most 1, so r is at most 4.", "GEO.POLAR.CONVERT"],
      ],
      why: "The largest value of $1 + \\cos\\theta$ is 2, at $\\theta = 0$, so $r = 4$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-24.b" };

export default defineGenerator(mixFamilies("FM-CP-24.b", { 1: own, 2: own, 4: base }));
