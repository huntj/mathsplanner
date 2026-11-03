/**
 * @statement Y5-FR-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-03.a: Convert improper fractions to mixed numbers
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { fracTex, gcdOf } from "../shared/fr.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y5-FR-03.ts";
import { withClaims } from "../shared/variety.ts";

interface Params {
  w: number;
  n: number;
  d: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y5-FR-03.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["FR.MIXED.CONVERT"],

  params(rng, numbers) {
    const d = rng.pick(numbers === "friendly" ? [3, 4, 5] : [3, 4, 5, 6, 8]);
    const options = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((k) => gcdOf(k, d) === 1);
    const p = { w: rng.int(2, numbers === "stretch" ? 9 : 5), n: rng.pick(options), d };
    if (p.n === p.w) reject("swapping the parts gives a different number");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const top = p.w * p.d + p.n;
    const mixed = `${p.w}${fracTex(p.n, p.d)}`;
    if (depth === 1) {
      return A.choice({
        rng,
        question: [`${top} pizza slices are put into boxes of ${p.d}.`],
        ask: "How many boxes is that, as a mixed number?",
        correct: A.math(mixed),
        distractors: [
          {
            content: A.math(`${p.n}${fracTex(p.w, p.d)}`),
            code: "FR.MIXED.CONVERT",
            feedback: `${top} ÷ ${p.d} = ${p.w} remainder ${p.n}: ${p.w} whole boxes and ${p.n} slices over.`,
          },
          {
            content: A.math(`${p.w + 1}${fracTex(p.n, p.d)}`),
            feedback: `${p.w + 1} boxes of ${p.d} would be ${(p.w + 1) * p.d} slices, more than ${top}.`,
          },
        ],
        solution: [{ say: "", math: `${fracTex(top, p.d)} = ${mixed}` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: ["Sam says ", A.math(`${fracTex(top, p.d)} = ${p.n}${fracTex(p.w, p.d)}`), "."],
      truth: false,
      reasons: [
        {
          text: `False. ${top} ÷ ${p.d} = ${p.w} remainder ${p.n}, so it is ${p.w} and ${p.n}/${p.d}.`,
          correct: true,
        },
        { text: "True. The remainder is the whole number.", code: "FR.MIXED.CONVERT" },
        { text: "True. You can write the parts in either order.", code: "FR.MIXED.CONVERT" },
      ],
      solution: [{ say: "", math: `${fracTex(top, p.d)} = ${mixed}` }],
    });
  },

  verify: () => true,
};

export default defineGenerator(
  withClaims(
    mixFamilies("Y5-FR-03.a", { 1: own, 2: { ...parent.definition, id: "Y5-FR-03.a" }, 4: own }),
    [
      {
        statement: "Leo says $\\frac{11}{4} = 2\\frac{3}{4}$.",
        truth: true,
        right: "True. 11 quarters is 2 wholes (8 quarters) and 3 quarters more.",
        wrong: [["False. It is 3 1/4.", "FR.MIXED.CONVERT"], ["False. It is 11 1/4."]],
      },
      {
        statement: "Mia says $\\frac{9}{5} = 1\\frac{9}{5}$.",
        truth: false,
        right: "False. 9 fifths is 1 whole (5 fifths) and 4 fifths: 1 4/5.",
        wrong: [
          ["True. Put a 1 in front.", "FR.MIXED.CONVERT"],
          ["True. Any fraction over 1 just gets a whole number."],
        ],
      },
      {
        claim: "An improper fraction can be written as a mixed number or a whole number.",
        truth: "always",
        right: "Always. Take out as many wholes as you can; anything left is the fraction part.",
        wrong: [
          ["Never. Improper fractions stay as they are.", "FR.MIXED.CONVERT"],
          ["Sometimes. Only for halves."],
        ],
      },
    ],
  ),
);
