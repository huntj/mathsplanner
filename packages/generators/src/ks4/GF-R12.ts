/**
 * @statement GF-R12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R12: Compare lengths, areas and volumes using ratio notation; make links to similarity
// (including trigonometric ratios) and scale factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "GF-R12",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(3, 12);
    if (a === b) reject("different sides");
    return { a, b, k: rng.int(2, 4), n: rng.int(2, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = p.b * p.k;
        return A.standard({
          question: `Triangles P and Q are similar. Side ${p.a} cm on P matches side ${p.a * p.k} cm on Q. Another side on P is ${p.b} cm.`,
          ask: "How long is the matching side on Q?",
          answer: A.number(x, { units: "cm" }),
          wrong: wrongs(x, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.b + p.a * p.k - p.a),
              feedback: `Q is P enlarged by scale factor ${p.k}: multiply, do not add.`,
            },
          ]),
          solution: [
            { say: `Scale factor = ${p.a * p.k} ÷ ${p.a} = ${p.k}. ${p.b} × ${p.k} = ${x} cm.` },
          ],
        });
      }
      case 2: {
        const right = `1 : ${p.k * p.k}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Two similar shapes have lengths in the ratio 1 : ${p.k}.`,
          ask: "What is the ratio of their areas?",
          correct: right,
          distractors: [
            {
              content: `1 : ${p.k}`,
              code: "RAT.SCALE.AREA-LINEAR",
              feedback: `Area has two dimensions, so the ratio is 1 : ${p.k}².`,
            },
            {
              content: `1 : ${p.k ** 3}`,
              code: "RAT.SCALE.AREA-LINEAR",
              feedback: "Cubing is for volume. Area uses the square.",
            },
            {
              content: `1 : ${2 * p.k}`,
              code: "RAT.SCALE.AREA-LINEAR",
              feedback: `Square the length ratio: ${p.k}² = ${p.k * p.k}.`,
            },
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [{ say: `Lengths 1 : ${p.k} → areas 1 : ${p.k}² = ${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Two similar jugs have heights in the ratio 1 : ${p.n}. Max says the bigger jug holds ${p.n} times as much.`,
          truth: false,
          reasons: [
            {
              text: `False. Volume scales by the cube of the length factor: ${p.n}³ = ${p.n ** 3} times as much.`,
              correct: true,
            },
            {
              text: "True. Everything about the jug is multiplied by the same factor.",
              code: "RAT.SCALE.AREA-LINEAR",
            },
            {
              text: `True. It holds ${p.n * p.n} times as much, using the square.`,
              code: "RAT.SCALE.AREA-LINEAR",
            },
          ],
          solution: [{ say: `Length × ${p.n}, area × ${p.n * p.n}, volume × ${p.n ** 3}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.b * p.k;
    if (question.archetype === "varied-form") return chosenText(question) === `1 : ${p.k * p.k}`;
    return true;
  },
});
