/**
 * @statement FM-FM1-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM1-03.b: Use elastic potential energy
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM1-03.ts";

const own = concept(
  "FM-FM1-03.b",
  ["MECH.ELASTIC"],
  [
    {
      question:
        "Which is the elastic potential energy stored in a string with modulus λ, natural length l and extension x?",
      correct: "$\\frac{\\lambda x^2}{2l}$",
      wrong: [
        ["$\\frac{\\lambda x}{l}$", "That is the tension.", "MECH.ELASTIC"],
        ["$\\frac{\\lambda x^2}{l}$", "Remember the 2 in the denominator.", "MECH.ELASTIC"],
      ],
      why: "EPE is the work done stretching the string: $\\int_0^x \\frac{\\lambda s}{l}\\,ds = \\frac{\\lambda x^2}{2l}$.",
    },
  ],
  [
    {
      statement:
        "Raj says doubling the extension of a spring doubles the elastic potential energy it stores.",
      truth: false,
      right:
        "False. EPE is proportional to x², so doubling the extension multiplies the energy by 4.",
      wrong: [
        ["True. Energy is proportional to extension.", "MECH.ELASTIC"],
        ["True. Tension and energy both double.", "MECH.ELASTIC"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FM1-03.b" };

export default defineGenerator(mixFamilies("FM-FM1-03.b", { 1: own, 2: base, 4: own }));
