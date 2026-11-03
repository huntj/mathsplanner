/**
 * @statement Y6-FR-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-01.b: Write fractions with a common denominator using common multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { fracTex } from "../shared/fr.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-FR-01.ts";
import { withClaims } from "../shared/variety.ts";

// Denominators that share a factor, so the lowest common denominator is less than their product.
const PAIRS: [number, number][] = [
  [4, 6],
  [6, 8],
  [6, 9],
  [8, 12],
  [10, 4],
];

interface Params {
  pair: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y6-FR-01.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["NPV.FACTOR.LCM-PRODUCT"],

  params(rng) {
    return { pair: rng.int(0, PAIRS.length - 1) };
  },

  build(p, _depth, rng): QuestionDraft {
    const [a, b] = PAIRS[p.pair] ?? [4, 6];
    let lcm = a;
    while (lcm % b !== 0) lcm += a;
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Ravi says the smallest common denominator for ",
        A.math(fracTex(1, a)),
        " and ",
        A.math(fracTex(1, b)),
        ` is ${a * b}, because ${a} × ${b} = ${a * b}.`,
      ],
      truth: false,
      reasons: [
        {
          text: `False. ${a * b} works, but ${lcm} is a smaller common multiple of ${a} and ${b}.`,
          correct: true,
        },
        {
          text: "True. You always multiply the denominators to find the smallest one.",
          code: "NPV.FACTOR.LCM-PRODUCT",
        },
        { text: "True. The common denominator is always the biggest denominator." },
      ],
      solution: [
        {
          say: `Multiples of ${b}: ${b}, ${2 * b}, ${3 * b}, … The first that is also a multiple of ${a} is ${lcm}.`,
        },
      ],
    });
  },
};

export default defineGenerator(
  withClaims(mixFamilies("Y6-FR-01.b", { 2: { ...parent.definition, id: "Y6-FR-01.b" }, 4: own }), [
    {
      statement:
        "Eli writes $\\frac{2}{3}$ and $\\frac{3}{4}$ as $\\frac{8}{12}$ and $\\frac{9}{12}$.",
      truth: true,
      right: "True. 12 is a common multiple of 3 and 4: 2/3 = 8/12 and 3/4 = 9/12.",
      wrong: [
        ["False. It should be 2/12 and 3/12.", "FR.EQUIV.ADD-SAME"],
        ["False. The common denominator must be 7."],
      ],
    },
    {
      statement:
        "To compare $\\frac{1}{4}$ and $\\frac{3}{8}$, Ola changes $\\frac{1}{4}$ to $\\frac{5}{8}$ by adding 4 to the top and bottom.",
      truth: false,
      right:
        "False. Multiply the top and bottom by 2: 1/4 = 2/8. Adding the same number changes the fraction.",
      wrong: [
        ["True. Do the same to the top and bottom.", "FR.EQUIV.ADD-SAME"],
        ["True. 4 + 4 = 8, so it works."],
      ],
    },
    {
      claim: "Multiplying the two denominators gives a common denominator.",
      truth: "always",
      right: "Always. The product is a multiple of both, though it may not be the smallest.",
      wrong: [
        ["Never. You must add them.", "FR.EQUIV.ADD-SAME"],
        ["Sometimes. Only when one is double the other.", "NPV.FACTOR.LCM-PRODUCT"],
      ],
    },
  ]),
);
