/**
 * @statement FM-FM2-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-02.a: Find centres of mass of composite laminas
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-02.ts";

const own = concept(
  "FM-FM2-02.a",
  ["MECH.CENTRE-MASS"],
  [
    {
      question:
        "A lamina is made of a 4 kg square with centre of mass at $(2, 2)$ and a 1 kg triangle with centre of mass at $(5, 1)$.",
      ask: "What is the x-coordinate of the centre of mass of the lamina?",
      correct: "2.6",
      wrong: [
        ["3.5", "Weight each part by its mass: (4 × 2 + 1 × 5) ÷ 5.", "MECH.CENTRE-MASS"],
        ["13", "Divide by the total mass, 5.", "MECH.CENTRE-MASS"],
      ],
      why: "$\\bar{x} = \\frac{4 \\times 2 + 1 \\times 5}{5} = 2.6$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FM2-02.a" };

export default defineGenerator(mixFamilies("FM-FM2-02.a", { 1: base, 2: own, 4: base }));
