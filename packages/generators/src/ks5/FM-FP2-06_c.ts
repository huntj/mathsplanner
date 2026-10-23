/**
 * @statement FM-FP2-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-06.c: Find surface areas of revolution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP2-06.c",
  ["CALC.ARC-LENGTH"],
  [
    {
      question:
        "Which integral gives the area of the surface formed by rotating $y = f(x)$, $a \\le x \\le b$, about the x-axis?",
      correct: "$2\\pi\\int_a^b y\\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2}\\,dx$",
      wrong: [
        ["$\\pi\\int_a^b y^2\\,dx$", "That is the volume of revolution.", "CALC.VOLUME"],
        ["$2\\pi\\int_a^b y\\,dx$", "Use the arc length element, not dx alone.", "CALC.ARC-LENGTH"],
      ],
      why: "Each piece of arc $ds$ sweeps a band of area $2\\pi y\\,ds$.",
    },
  ],
  [
    {
      statement:
        "Vic finds the surface area of a sphere of radius r by rotating a semicircle and gets $4\\pi r^2$.",
      truth: true,
      right: "True. For y = √(r² − x²), y√(1 + y'²) = r, and 2π∫₋ᵣʳ r dx = 4πr².",
      wrong: [
        ["False. The surface area is (4/3)πr³.", "CALC.VOLUME"],
        ["False. Rotating a semicircle gives a cylinder.", "CALC.ARC-LENGTH"],
      ],
    },
  ],
);

export default defineGenerator(own);
