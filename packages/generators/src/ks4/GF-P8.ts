/**
 * @statement GF-P8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P8: Calculate probabilities of independent and dependent combined events using tree diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { TreeSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  /** Independent events: P(pass theory) and P(pass practical), in tenths. */
  a: number;
  b: number;
  /** A bag of red and blue counters; two are taken. */
  red: number;
  blue: number;
  /** Depth 4: whether the claim uses the right second-pick fractions. */
  claimTrue: boolean;
}

const txt = (s: string) => `\\text{${s}}`;
const r2 = (x: number) => Math.round(x * 100) / 100;

function passTree(a: number, b: number): TreeSpec {
  const second = () => [
    { label: String(b / 10), outcome: txt("pass") },
    { label: String(r2(1 - b / 10)), outcome: txt("fail") },
  ];
  return {
    type: "probability",
    kind: "tree",
    branches: [
      { label: String(a / 10), outcome: txt("pass"), children: second() },
      { label: String(r2(1 - a / 10)), outcome: txt("fail"), children: second() },
    ],
    description: "A tree diagram for passing or failing a theory test and then a practical test.",
  };
}

/** A two-pick counter tree; `after(first)` gives the red and blue counts for the second pick. */
function counterTree(
  r: number,
  bl: number,
  after: (first: "red" | "blue") => [number, number, number],
): TreeSpec {
  const n = r + bl;
  const second = (first: "red" | "blue") => {
    const [rr, bb, d] = after(first);
    return [
      { label: fracTex(rr, d), outcome: txt("red") },
      { label: fracTex(bb, d), outcome: txt("blue") },
    ];
  };
  return {
    type: "probability",
    kind: "tree",
    branches: [
      { label: fracTex(r, n), outcome: txt("red"), children: second("red") },
      { label: fracTex(bl, n), outcome: txt("blue"), children: second("blue") },
    ],
    description: "A tree diagram for taking two counters from a bag, one after the other.",
  };
}

const without =
  (r: number, bl: number) =>
  (first: "red" | "blue"): [number, number, number] =>
    first === "red" ? [r - 1, bl, r + bl - 1] : [r, bl - 1, r + bl - 1];

export default defineGenerator<Params>({
  id: "GF-P8",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: ["PRO.TREE.ADD-ALONG", "PRO.TREE.REPLACEMENT", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const red = rng.int(3, 7);
    const blue = rng.int(3, 7);
    if (a === b || red === blue) reject("different probabilities and counts");
    return { a, b, red, blue, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.red + p.blue;
    const pa = p.a / 10;
    const pb = p.b / 10;
    const intro = `The probability that Leah passes her theory test is ${pa}. The probability that she passes her practical test is ${pb}. The tests are independent.`;
    switch (depth) {
      case 1: {
        const both = r2(pa * pb);
        return A.standard({
          question: [intro, A.figure(passTree(p.a, p.b))],
          ask: "What is the probability that she passes both tests?",
          answer: A.number(both),
          wrong: wrongs(both, [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.number(r2(pa + pb)),
              feedback: "Multiply along the branches for 'and'.",
            },
          ]),
          solution: [{ say: `${pa} × ${pb} = ${both}.` }],
        });
      }
      case 2: {
        const one = r2(pa * (1 - pb) + (1 - pa) * pb);
        const first = r2(pa * (1 - pb));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [intro, A.figure(passTree(p.a, p.b))],
              ask: "What is the probability that she passes exactly one test?",
            },
          ],
          answer: A.number(one),
          wrong: wrongs(one, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(first),
              feedback:
                "That is pass then fail only. Fail then pass also gives exactly one pass: add both paths.",
            },
          ]),
          solution: [{ say: `${pa} × ${r2(1 - pb)} + ${r2(1 - pa)} × ${pb} = ${one}.` }],
        });
      }
      case 3: {
        // Probabilities over n(n − 1); outcomes with equal values are dropped so each match is unique.
        const all = n * (n - 1);
        const rr = p.red * (p.red - 1);
        const bb = p.blue * (p.blue - 1);
        const rb = p.red * p.blue;
        const outcomes = (
          [
            ["both red", rr],
            ["both blue", bb],
            ["red then blue", rb],
            ["one of each colour", 2 * rb],
            ["at least one red", all - bb],
          ] as const
        )
          .filter(([, v], i, list) => list.findIndex(([, w]) => w === v) === i)
          .slice(0, 4);
        return A.matchRepresentations({
          rng,
          question: [
            `A bag has ${p.red} red and ${p.blue} blue counters. Two counters are taken at random without replacement.`,
            A.figure(counterTree(p.red, p.blue, without(p.red, p.blue))),
            "Match each outcome to its probability.",
          ],
          pairs: outcomes.map(
            ([a, v]) => [a, A.math(fracTex(v, all))] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: "Multiply along each path; add the paths that give the outcome. 'At least one red' is 1 − P(both blue).",
            },
          ],
        });
      }
      case 4: {
        const right = `${fracTex(p.red, n)} \\times ${fracTex(p.red - 1, n - 1)}`;
        const wrong = `${fracTex(p.red, n)} \\times ${fracTex(p.red, n)}`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A bag has ${p.red} red and ${p.blue} blue counters. Two are taken without replacement. Raj says P(both red) = `,
            A.math(p.claimTrue ? right : wrong),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. After one red is taken, ${p.red - 1} of the ${n - 1} counters left are red.`,
                  correct: true,
                },
                {
                  text: `False. The second pick is still out of ${n}.`,
                  code: "PRO.TREE.REPLACEMENT",
                },
                { text: "False. Add the two probabilities.", code: "PRO.TREE.ADD-ALONG" },
              ]
            : [
                {
                  text: `False. Without replacement the second pick is ${p.red - 1} out of ${n - 1}.`,
                  correct: true,
                },
                { text: "True. Each pick is from the same bag.", code: "PRO.TREE.REPLACEMENT" },
                { text: "True. Multiply along the branches.", code: "PRO.TREE.REPLACEMENT" },
              ],
          solution: [
            {
              say: "Without replacement, the second fractions change: one counter fewer, and one fewer of the colour taken.",
            },
          ],
        });
      }
      default: {
        const rr = frac(p.red * (p.red - 1), n * (n - 1));
        const same = frac(p.red * (p.red - 1) + p.blue * (p.blue - 1), n * (n - 1));
        return A.multiStepContext({
          context: [
            `A bag has ${p.red} red and ${p.blue} blue counters. Two counters are taken at random without replacement.`,
            A.figure(counterTree(p.red, p.blue, without(p.red, p.blue))),
          ],
          parts: [
            {
              ask: "Work out the probability that both counters are red.",
              answer: A.exact(rr),
              wrong: [
                {
                  code: "PRO.TREE.REPLACEMENT",
                  value: A.exact(frac(p.red * p.red, n * n)),
                  feedback: `The second pick is out of ${n - 1}.`,
                },
                {
                  code: "PRO.TREE.ADD-ALONG",
                  value: A.exact(frac(p.red, n).add(frac(p.red - 1, n - 1))),
                  feedback: "Multiply along the branches.",
                },
              ],
            },
            {
              ask: "Work out the probability that both counters are the same colour.",
              answer: A.exact(same),
              wrong: [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.exact(frac(p.blue * (p.blue - 1), n * (n - 1))),
                  feedback: "Same colour means red-red or blue-blue: add both.",
                },
              ],
            },
          ],
          solution: [
            { say: `${fracTex(p.red, n)} × ${fracTex(p.red - 1, n - 1)} = `, math: toLatex(rr) },
            { say: "Add red-red and blue-blue: ", math: toLatex(same) },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === r2((p.a / 10) * (p.b / 10));
    if (question.archetype === "varied-form")
      return (
        numberAnswer(question) === r2((p.a / 10) * (1 - p.b / 10) + (1 - p.a / 10) * (p.b / 10))
      );
    if (question.archetype === "multi-step-context") {
      const a = question.parts[0]?.answer;
      const n = p.red + p.blue;
      return a?.type === "exact" && a.value === toLatex(frac(p.red * (p.red - 1), n * (n - 1)));
    }
    return true;
  },
});
