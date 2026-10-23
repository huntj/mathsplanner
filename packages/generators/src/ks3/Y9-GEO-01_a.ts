/**
 * @statement Y9-GEO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-GEO-01.a: Use Pythagoras' theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { legsTriangle } from "../shared/geo.ts";

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [9, 12, 15],
  [7, 24, 25],
  [12, 16, 20],
];

interface Params {
  t: number;
  swap: boolean;
}

export default defineGenerator<Params>({
  id: "Y9-GEO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PYTHAG.NO-SQUARE", "GEO.PYTHAG.ADD-FOR-SHORT"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), swap: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, c] = TRIPLES[p.t] ?? [3, 4, 5];
    const [a, b] = p.swap ? [y, x] : [x, y];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            A.figure(legsTriangle(a, b, { ab: `${a}\\text{ cm}`, bc: `${b}\\text{ cm}`, ca: "h" })),
          ],
          ask: "Find the length h, in cm.",
          answer: A.number(c),
          wrong: wrongs(c, [
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(a + b),
              feedback: "Square the two shorter sides, add, then square root.",
            },
          ]),
          solution: [
            { say: "", math: `h = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} = ${c}` },
          ],
        });
      case 2: {
        const v = Math.round(Math.hypot(c, a) * 10) / 10;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  legsTriangle(a, b, { ab: `${a}\\text{ cm}`, bc: "x", ca: `${c}\\text{ cm}` }),
                ),
              ],
              ask: "Find the length x, in cm.",
            },
          ],
          answer: A.number(b),
          wrong: wrongs(b, [
            {
              code: "GEO.PYTHAG.ADD-FOR-SHORT",
              value: A.number(v, { accuracy: { dp: 1 } }),
              feedback: `${c} cm is the hypotenuse, so subtract: x² = ${c}² − ${a}².`,
            },
          ]),
          solution: [{ say: "", math: `x = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${b * b}} = ${b}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gus says the longest side of a right-angled triangle is always opposite the right angle.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. That side is the hypotenuse; its square equals the sum of the squares of the other two, so it is the longest.",
              correct: true,
            },
            {
              text: "False. The longest side is next to the right angle.",
              code: "GEO.PYTHAG.ADD-FOR-SHORT",
            },
            {
              text: "False. It depends how the triangle is drawn.",
              code: "GEO.PYTHAG.ADD-FOR-SHORT",
            },
          ],
          solution: [{ say: "Spot the hypotenuse first: it decides whether you add or subtract." }],
        });
    }
  },

  verify(p, question) {
    const [x, y, c] = TRIPLES[p.t] ?? [3, 4, 5];
    if (question.key.depth === 1) return numberAnswer(question) === c;
    if (question.key.depth === 2) return numberAnswer(question) === (p.swap ? x : y);
    return true;
  },
});
