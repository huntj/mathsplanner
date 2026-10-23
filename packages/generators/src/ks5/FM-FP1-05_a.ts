/**
 * @statement FM-FP1-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-05.a: Use series expansions to evaluate limits
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-05.ts";

const own = concept(
  "FM-FP1-05.a",
  ["CALC.LIMIT", "CALC.MACLAURIN"],
  [
    {
      question: "Use the series for $e^x$ to find $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$.",
      correct: "1",
      wrong: [
        ["0", "e^x − 1 = x + x²/2 + …, so the fraction is 1 + x/2 + … → 1.", "CALC.LIMIT"],
        ["e", "Substitute the series, then let x → 0.", "CALC.LIMIT"],
      ],
      why: "$\\frac{e^x - 1}{x} = 1 + \\frac{x}{2} + \\dots \\to 1$.",
    },
  ],
  [
    {
      statement:
        "Gil says $\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 1$, because $\\frac{\\sin x}{x} \\to 1$.",
      truth: false,
      right: "False. sin 3x ≈ 3x for small x, so the limit is 3.",
      wrong: [
        ["True. Every limit of this kind is 1.", "CALC.LIMIT"],
        ["True. The 3 does not matter as x tends to 0.", "CALC.LIMIT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP1-05.a" };

export default defineGenerator(mixFamilies("FM-FP1-05.a", { 1: own, 2: base, 4: own }));
