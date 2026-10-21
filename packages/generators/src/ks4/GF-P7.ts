/**
 * @statement GF-P7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P7: Construct sample spaces for single and combined experiments and calculate probabilities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Two spinners numbered 1 to m and 1 to n. */
  m: number;
  n: number;
  /** Depth 1: the target total. */
  sum: number;
  /** Depth 4: two or three coins. */
  coins: 2 | 3;
}

const range = (k: number) => Array.from({ length: k }, (_, i) => i + 1);

/** A sample-space grid of the two spinners, combined by `op`. */
function grid(m: number, n: number, op: (a: number, b: number) => number, sign: string): string {
  const rows = range(m).map(
    (a) =>
      `${a} & ${range(n)
        .map((b) => op(a, b))
        .join(" & ")}`,
  );
  return `\\begin{array}{|c|${"c".repeat(n)}|}\\hline ${sign} & ${range(n).join(" & ")} \\\\ \\hline ${rows.join(" \\\\ ")} \\\\ \\hline\\end{array}`;
}

const count = (m: number, n: number, test: (a: number, b: number) => boolean) =>
  range(m).reduce((t, a) => t + range(n).filter((b) => test(a, b)).length, 0);

export default defineGenerator<Params>({
  id: "GF-P7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.SAMPLE-SPACE.EQUAL-TOTALS", "PRO.ODDS"],

  params(rng) {
    const m = rng.int(3, 5);
    const n = rng.int(4, 6);
    return { m, n, sum: rng.int(3, m + n - 1), coins: rng.pick([2, 3] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const outcomes = p.m * p.n;
    switch (depth) {
      case 1: {
        const ways = count(p.m, p.n, (a, b) => a + b === p.sum);
        const totals = p.m + p.n - 1;
        return A.standard({
          question: [
            `A spinner numbered 1 to ${p.m} and a spinner numbered 1 to ${p.n} are spun and the scores added. The sample space shows every total.`,
            A.displayMath(grid(p.m, p.n, (a, b) => a + b, "+")),
          ],
          ask: `What is the probability of a total of ${p.sum}?`,
          answer: A.exact(frac(ways, outcomes)),
          wrong: [
            {
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
              value: A.exact(frac(1, totals)),
              feedback: `The ${totals} totals are not equally likely. Count the cells showing ${p.sum}.`,
            },
          ].filter(() => ways * totals !== outcomes),
          solution: [
            {
              say: `${ways} of the ${outcomes} equally likely cells show ${p.sum}: `,
              math: toLatex(frac(ways, outcomes)),
            },
          ],
        });
      }
      case 2: {
        const even = count(p.m, p.n, (a, b) => (a * b) % 2 === 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A spinner numbered 1 to ${p.m} and a spinner numbered 1 to ${p.n} are spun and the scores multiplied.`,
                A.displayMath(grid(p.m, p.n, (a, b) => a * b, "\\times")),
              ],
              ask: "What is the probability that the product is even?",
            },
          ],
          answer: A.exact(frac(even, outcomes)),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(frac(even, outcomes - even)),
              feedback: `Divide by all ${outcomes} outcomes, not by the odd ones.`,
            },
          ],
          solution: [
            {
              say: `${even} of the ${outcomes} cells are even: `,
              math: toLatex(frac(even, outcomes)),
            },
          ],
        });
      }
      default: {
        const kinds = p.coins + 1;
        const all = 2 ** p.coins;
        const heads = p.coins === 2 ? "two heads" : "three heads";
        return A.trueOrFalseWhy({
          rng,
          statement: `${p.coins === 2 ? "Two" : "Three"} fair coins are flipped. Jo says the number of heads can be ${range(
            kinds,
          )
            .map((k) => k - 1)
            .join(", ")}, so the probability of ${heads} is 1/${kinds}.`,
          truth: false,
          reasons: [
            {
              text: `False. There are ${all} equally likely outcomes (such as ${p.coins === 2 ? "HH, HT, TH, TT" : "HHH, HHT, HTH, …"}), and only one is ${heads}, so it is 1/${all}.`,
              correct: true,
            },
            {
              text: `True. There are ${kinds} possible numbers of heads.`,
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
            {
              text: "True. Each coin is fair, so every result is equally likely.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
          ],
          solution: [
            {
              say: "List the sample space: the numbers of heads are not equally likely, because one head can happen in more than one way.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.archetype === "standard")
      return (
        a?.type === "exact" &&
        a.value ===
          toLatex(
            frac(
              count(p.m, p.n, (x, y) => x + y === p.sum),
              p.m * p.n,
            ),
          )
      );
    if (question.archetype === "varied-form")
      return (
        a?.type === "exact" &&
        a.value ===
          toLatex(
            frac(
              count(p.m, p.n, (x, y) => (x * y) % 2 === 0),
              p.m * p.n,
            ),
          )
      );
    return true;
  },
});
