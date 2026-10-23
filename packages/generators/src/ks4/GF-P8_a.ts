/**
 * @statement GF-P8.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-P8.a: Calculate probabilities of independent combined events
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { TreeSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { txt } from "../shared/sta.ts";

interface Params {
  a: number;
  b: number;
}

const r = (v: number) => Number(v.toFixed(6));

const tree = (a: number, b: number): TreeSpec => {
  const second = () => [
    { label: String(b), outcome: txt("late") },
    { label: String(r(1 - b)), outcome: txt("on time") },
  ];
  return {
    type: "probability",
    kind: "tree",
    branches: [
      { label: String(a), outcome: txt("rain"), children: second() },
      { label: String(r(1 - a)), outcome: txt("dry"), children: second() },
    ],
    description:
      "A tree diagram for whether it rains and whether a bus is late, which are independent.",
  };
};

export default defineGenerator<Params>({
  id: "GF-P8.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.TREE.ADD-ALONG"],

  params(rng) {
    const p = { a: rng.int(1, 9) / 10, b: rng.int(1, 9) / 10 };
    if (p.a === p.b) reject("two different probabilities");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r(p.a * p.b);
        return A.standard({
          question: [
            `The probability that it rains tomorrow is ${p.a}. Independently, the probability that the bus is late is ${p.b}.`,
          ],
          ask: "Find the probability that it rains and the bus is late.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.number(r(p.a + p.b)),
              feedback: "For independent events A and B, P(A and B) = P(A) × P(B).",
            },
          ]),
          solution: [{ say: "", math: `${p.a} \\times ${p.b} = ${v}` }],
        });
      }
      case 2: {
        const v = r(1 - (1 - p.a) * (1 - p.b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The tree diagram shows the probabilities for rain and a late bus.",
                A.figure(tree(p.a, p.b)),
              ],
              ask: "Find the probability that it rains or the bus is late, or both.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.number(r(p.a + p.b)),
              feedback: "Adding counts 'rain and late' twice. Use 1 − P(dry and on time).",
            },
          ]),
          solution: [{ say: "", math: `1 - ${r(1 - p.a)} \\times ${r(1 - p.b)} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says the probability of two heads with two fair coins is ",
            A.math("\\frac{1}{2} + \\frac{1}{2} = 1"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Multiply along the branches: ½ × ½ = ¼. A probability of 1 would mean it always happens.",
              correct: true,
            },
            { text: "True. Add the probabilities of the two heads.", code: "PRO.TREE.ADD-ALONG" },
            {
              text: "True. Each coin has a ½ chance, so together they make 1.",
              code: "PRO.TREE.ADD-ALONG",
            },
          ],
          solution: [{ say: "Multiply along branches; add between whole paths." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r(p.a * p.b);
    if (question.key.depth === 2) return numberAnswer(question) === r(1 - (1 - p.a) * (1 - p.b));
    return true;
  },
});
