/**
 * @statement GH-A6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A6: Construct algebraic proofs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Fact {
  claim: string;
  /** The opening of a correct proof, as LaTeX. */
  proof: string;
  /** A wrong algebraic start. */
  slip: string;
  slipWhy: string;
  example: string;
}

const FACTS: Fact[] = [
  {
    claim: "The sum of three consecutive integers is a multiple of 3.",
    proof: "n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)",
    slip: "n + n + n = 3n",
    slipWhy: "n, n and n are the same integer, not consecutive ones.",
    example: "4 + 5 + 6 = 15 = 3 \\times 5",
  },
  {
    claim: "The sum of two odd numbers is even.",
    proof: "(2m + 1) + (2n + 1) = 2m + 2n + 2 = 2(m + n + 1)",
    slip: "(2n + 1) + (2n + 1) = 4n + 2",
    slipWhy:
      "This only uses the same odd number twice; two different odd numbers need different letters.",
    example: "3 + 5 = 8",
  },
  {
    claim: "The square of an odd number is odd.",
    proof: "(2n + 1)^2 = 4n^2 + 4n + 1 = 2(2n^2 + 2n) + 1",
    slip: "(2n + 1)^2 = 4n^2 + 1",
    slipWhy: "(2n + 1)² has a middle term 4n.",
    example: "7^2 = 49",
  },
];

const STUBBORN = [
  { expr: "n^2 + n + 41", fails: 40, value: 40 * 40 + 40 + 41 },
  { expr: "n^2 - n + 41", fails: 41, value: 41 * 41 },
] as const;

interface Params {
  fact: number;
  /** Depth 2: (n + a)² − (n − a)² = 4an. */
  a: number;
  stubborn: number;
}

export default defineGenerator<Params>({
  id: "GH-A6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PROOF.EXAMPLES", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return {
      fact: rng.int(0, FACTS.length - 1),
      a: rng.int(2, 9),
      stubborn: rng.int(0, STUBBORN.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f = FACTS[p.fact] ?? (FACTS[0] as Fact);
        return A.choice({
          rng,
          question: `Prove: ${f.claim}`,
          ask: "Which is the best start to a proof?",
          correct: A.math(f.proof),
          distractors: [
            {
              content: A.math(f.example),
              code: "ALG.PROOF.EXAMPLES",
              feedback: "One example shows it can be true, not that it is always true.",
            },
            { content: A.math(f.slip), feedback: f.slipWhy },
          ],
          solution: [
            {
              say: "Use letters for any integers of the right kind, then show the result has the property for every value.",
            },
          ],
        });
      }
      case 2: {
        const lhs = `(n + ${p.a})^2 - (n - ${p.a})^2`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Show that ",
                A.math(lhs),
                ` is a multiple of ${4 * p.a} for any integer n by first simplifying it.`,
              ],
              ask: "Simplify the expression.",
            },
            { question: ["Expand and simplify ", A.math(lhs), "."] },
          ],
          answer: A.exact(`${4 * p.a}n`, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact("0"),
              feedback: `(n + ${p.a})² = n² + ${2 * p.a}n + ${p.a * p.a}: include the middle terms.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `(n^2 + ${2 * p.a}n + ${p.a * p.a}) - (n^2 - ${2 * p.a}n + ${p.a * p.a}) = ${4 * p.a}n`,
            },
            { say: `${4 * p.a}n is ${4 * p.a} × n, a multiple of ${4 * p.a}.` },
          ],
        });
      }
      default: {
        const s = STUBBORN[p.stubborn] ?? (STUBBORN[0] as (typeof STUBBORN)[number]);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Max works out ",
            A.math(s.expr),
            " for n = 1, 2, 3, …, 10 and gets a prime number every time. He says this proves it is prime for every positive integer n.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Checking examples is not a proof. When n = ${s.fails} it gives ${s.value}, which is not prime.`,
              correct: true,
            },
            { text: "True. Ten examples is enough to prove it.", code: "ALG.PROOF.EXAMPLES" },
            {
              text: "True. If it works for the first few numbers it always works.",
              code: "ALG.PROOF.EXAMPLES",
            },
          ],
          solution: [
            {
              say: `A single counter-example disproves a statement: n = ${s.fails} gives ${s.value} = 41 × ${s.value / 41}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 2) return a?.type === "exact" && a.value === `${4 * p.a}n`;
    return true;
  },
});
