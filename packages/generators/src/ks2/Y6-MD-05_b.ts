/**
 * @statement Y6-MD-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-05.b: Identify common multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";
import { mixFamilies } from "../shared/npv.ts";

const base = factorsFamily("Y6-MD-05.b", { friendly: 60, standard: 100, stretch: 100 }, true);

// Lowest common multiples only.
const lowest: typeof base = {
  ...base,
  params: (rng, numbers) => ({ ...base.params(rng, numbers), multiple: true }),
};

// Pairs whose lowest common multiple is less than their product, and pairs where it is not.
const PAIRS: [number, number][] = [
  [4, 6],
  [6, 8],
  [6, 9],
  [8, 12],
  [10, 15],
];

interface Params {
  pair: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y6-MD-05.b",
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
    return A.alwaysSometimesNever({
      rng,
      claim: ["The lowest common multiple of two numbers is the two numbers multiplied together."],
      truth: "sometimes",
      reasons: [
        {
          text: `Sometimes. For 3 and 4 it is 12 = 3 × 4, but for ${a} and ${b} it is ${lcm}, not ${a * b}.`,
          correct: true,
        },
        {
          text: "Always. Multiplying always gives the lowest common multiple.",
          code: "NPV.FACTOR.LCM-PRODUCT",
        },
        { text: "Never. The product is never a common multiple." },
      ],
      solution: [
        { say: `List the multiples of ${b} until one is also a multiple of ${a}: ${lcm}.` },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("Y6-MD-05.b", {
    1: lowest,
    4: own,
  }),
);
