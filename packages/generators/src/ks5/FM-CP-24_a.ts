/**
 * @statement FM-CP-24.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-24.a: Convert between polar and Cartesian forms
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-24.ts";

const own = concept(
  "FM-CP-24.a",
  ["GEO.POLAR.CONVERT"],
  [],
  [
    {
      statement:
        "Ian converts the point with Cartesian coordinates $(-1, 1)$ to polar form as $\\left(\\sqrt{2}, -\\frac{\\pi}{4}\\right)$.",
      truth: false,
      right: "False. (−1, 1) is in the second quadrant, so θ = 3π/4: the point is (√2, 3π/4).",
      wrong: [
        ["True. θ = arctan(1/−1) = −π/4.", "GEO.POLAR.CONVERT"],
        ["True. The angle does not depend on the quadrant.", "GEO.POLAR.CONVERT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-24.a" };

export default defineGenerator(mixFamilies("FM-CP-24.a", { 1: base, 2: base, 4: own }));
