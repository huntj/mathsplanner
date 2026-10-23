/**
 * @statement FM-FP1-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-05.b: Use L'Hospital's rule
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-05.ts";

const own = concept(
  "FM-FP1-05.b",
  ["CALC.LIMIT"],
  [
    {
      question: "Use L'Hospital's rule to find $\\lim_{x \\to 0} \\frac{\\ln(1 + 2x)}{x}$.",
      correct: "2",
      wrong: [
        ["1", "Differentiate the top: 2/(1 + 2x), which is 2 at x = 0.", "CALC.LIMIT"],
        ["0", "It is a 0/0 form, so differentiate the top and bottom separately.", "CALC.LIMIT"],
      ],
      why: "$\\frac{\\frac{2}{1 + 2x}}{1} \\to 2$ as $x \\to 0$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-05.b" };

export default defineGenerator(mixFamilies("FM-FP1-05.b", { 1: base, 2: own, 4: base }));
