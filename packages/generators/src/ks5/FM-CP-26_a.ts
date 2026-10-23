/**
 * @statement FM-CP-26.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-26.a: Define and sketch hyperbolic functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-26.ts";

const own = concept(
  "FM-CP-26.a",
  ["ALG.HYPERBOLIC"],
  [
    {
      question: "Which is the definition of $\\sinh x$?",
      correct: "$\\frac{e^x - e^{-x}}{2}$",
      wrong: [
        ["$\\frac{e^x + e^{-x}}{2}$", "That is cosh x.", "ALG.HYPERBOLIC"],
        ["$\\frac{e^x - e^{-x}}{e^x + e^{-x}}$", "That is tanh x.", "ALG.HYPERBOLIC"],
      ],
      why: "$\\sinh x = \\frac{e^x - e^{-x}}{2}$; the 's' goes with the minus sign.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-26.a" };

export default defineGenerator(mixFamilies("FM-CP-26.a", { 1: base, 2: own, 4: base }));
