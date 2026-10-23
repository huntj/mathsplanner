/**
 * @statement FM-CP-30.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-30.a: Model simple harmonic motion
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-30.ts";

const own = concept(
  "FM-CP-30.a",
  ["CALC.SHM"],
  [],
  [
    {
      statement:
        "A particle moves with $\\ddot{x} = -16x$. Ned says its period is $\\frac{2\\pi}{16}$.",
      truth: false,
      right: "False. ω² = 16, so ω = 4 and the period is 2π/4 = π/2.",
      wrong: [
        ["True. The period is 2π divided by the number in front of x.", "CALC.SHM"],
        ["True. ω is 16.", "CALC.SHM"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-30.a" };

export default defineGenerator(mixFamilies("FM-CP-30.a", { 1: base, 2: base, 4: own }));
