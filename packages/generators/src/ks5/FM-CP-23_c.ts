/**
 * @statement FM-CP-23.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-23.c: Find shortest distances
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-23.ts";

const own = concept(
  "FM-CP-23.c",
  ["GEO.VECTOR.PLANE"],
  [
    {
      question: "Find the shortest distance from the origin to the plane $2x + y - 2z = 9$.",
      correct: "3",
      wrong: [
        ["9", "Divide by the length of the normal, √(4 + 1 + 4) = 3.", "GEO.VECTOR.PLANE"],
        ["1", "The distance is |9| ÷ 3.", "GEO.VECTOR.PLANE"],
      ],
      why: "Distance $= \\frac{|9|}{\\sqrt{2^2 + 1^2 + (-2)^2}} = \\frac{9}{3} = 3$.",
    },
  ],
  [
    {
      statement:
        "Hana says the shortest distance from a point to a plane is measured along any line from the point to the plane.",
      truth: false,
      right: "False. The shortest distance is along the normal, perpendicular to the plane.",
      wrong: [
        ["True. Every line to the plane has the same length.", "GEO.VECTOR.PLANE"],
        ["True. Use the line through the origin.", "GEO.VECTOR.PLANE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-23.c" };

export default defineGenerator(mixFamilies("FM-CP-23.c", { 1: base, 2: own, 4: own }));
