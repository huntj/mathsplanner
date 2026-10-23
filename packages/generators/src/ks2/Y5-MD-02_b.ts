/**
 * @statement Y5-MD-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-02.b: Find the prime factors of a number
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { primesFamily } from "../shared/md.ts";
import { mixFamilies } from "../shared/npv.ts";

// [number, a non-prime split, its prime factors]
const CASES: [number, [number, number], number[]][] = [
  [12, [2, 6], [2, 2, 3]],
  [18, [3, 6], [2, 3, 3]],
  [20, [4, 5], [2, 2, 5]],
  [28, [4, 7], [2, 2, 7]],
  [30, [5, 6], [2, 3, 5]],
  [45, [5, 9], [3, 3, 5]],
];

interface Params {
  c: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y5-MD-02.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["NPV.FACTOR.NOT-PRIME"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1) };
  },

  build(p, _depth, rng): QuestionDraft {
    const [n, [a, b], primes] = CASES[p.c] ?? CASES[0] ?? [12, [2, 6], [2, 2, 3]];
    const composite = [a, b].find((x) => ![2, 3, 5, 7].includes(x)) ?? b;
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Ivy says the prime factors of ",
        A.math(String(n)),
        " are ",
        A.math(`${a} \\times ${b}`),
        ".",
      ],
      truth: false,
      reasons: [
        {
          text: `False. ${composite} is not prime. Keep splitting: ${n} = ${primes.join(" × ")}.`,
          correct: true,
        },
        {
          text: `True. ${a} × ${b} = ${n}, so they are its prime factors.`,
          code: "NPV.FACTOR.NOT-PRIME",
        },
        {
          text: "True. Any two factors that multiply to the number are prime factors.",
          code: "NPV.FACTOR.NOT-PRIME",
        },
      ],
      solution: [{ say: `${n} = ${primes.join(" × ")}, and every one of these is prime.` }],
    });
  },
};

export default defineGenerator(
  mixFamilies("Y5-MD-02.b", {
    2: primesFamily("Y5-MD-02.b", { friendly: 30, standard: 50, stretch: 100 }, true),
    4: own,
  }),
);
