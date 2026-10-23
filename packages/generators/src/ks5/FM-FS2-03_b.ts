/**
 * @statement FM-FS2-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-03.b: Use cumulative distribution functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-03.ts";

const own = concept(
  "FM-FS2-03.b",
  ["PRO.PDF"],
  [
    {
      question:
        "X has cumulative distribution function $F(x) = \\frac{x^2}{9}$ for $0 \\le x \\le 3$.",
      ask: "Find the median of X.",
      correct: "$\\frac{3}{\\sqrt{2}}$",
      wrong: [
        ["$\\frac{3}{2}$", "Solve F(m) = ½: m² = 9/2.", "PRO.PDF"],
        ["$\\frac{9}{2}$", "That is m²; take the square root.", "PRO.PDF"],
      ],
      why: "$\\frac{m^2}{9} = \\frac{1}{2}$, so $m = \\frac{3}{\\sqrt{2}}$.",
    },
  ],
  [
    {
      statement: "Kai finds the pdf from a cumulative distribution function by integrating it.",
      truth: false,
      right: "False. Differentiate F to get f: f(x) = F'(x).",
      wrong: [
        ["True. The pdf is the integral of the cdf.", "PRO.PDF"],
        ["True. Both directions use integration.", "PRO.PDF"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS2-03.b" };

export default defineGenerator(mixFamilies("FM-FS2-03.b", { 1: own, 2: base, 4: own }));
