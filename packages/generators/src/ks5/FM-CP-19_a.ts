/**
 * @statement FM-CP-19.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-19.a: Find volumes of revolution about the x-axis
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-19.ts";

const own = concept(
  "FM-CP-19.a",
  ["CALC.VOLUME"],
  [
    {
      question:
        "The region under $y = \\sqrt{x}$ from $x = 0$ to $x = 4$ is rotated through 360° about the x-axis.",
      ask: "Find the volume.",
      correct: "$8\\pi$",
      wrong: [
        ["$\\frac{16\\pi}{3}$", "Square y first: π∫x dx, not π∫√x dx.", "CALC.VOLUME"],
        ["$16\\pi$", "∫₀⁴ x dx = 8, then multiply by π.", "CALC.VOLUME"],
      ],
      why: "$\\pi\\int_0^4 x\\,dx = \\pi\\left[\\tfrac{x^2}{2}\\right]_0^4 = 8\\pi$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-19.a" };

export default defineGenerator(mixFamilies("FM-CP-19.a", { 1: base, 2: own, 4: base }));
