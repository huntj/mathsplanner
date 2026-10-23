/**
 * @statement FM-FM2-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-04.b: Use forces depending on displacement
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-04.ts";

const own = concept(
  "FM-FM2-04.b",
  ["MECH.VARIABLE-FORCE"],
  [
    {
      question: "The acceleration of a particle depends on its displacement x.",
      ask: "Which form of acceleration should you use?",
      correct: "$a = v\\frac{dv}{dx}$",
      wrong: [
        [
          "$a = \\frac{dv}{dt}$",
          "With a in terms of x, write a = v dv/dx so the variables separate.",
          "MECH.VARIABLE-FORCE",
        ],
        ["$a = \\frac{dx}{dt}$", "dx/dt is the velocity.", "MECH.CALCULUS"],
      ],
      why: "$\\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FM2-04.b" };

export default defineGenerator(mixFamilies("FM-FM2-04.b", { 1: own, 2: base, 4: base }));
