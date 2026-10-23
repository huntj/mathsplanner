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
  mixFamilies("Y6-FR-01.b", { 2: { ...parent.definition, id: "Y6-FR-01.b" }, 4: own }),
);
