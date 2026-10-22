/**
 * @statement AL-P10.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.4: Use position vectors and find the distance between two points
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { ijk, mag } from "../shared/vec.ts";

const STEPS = [
  [3, 4, 5],
  [5, 12, 13],
  [6, 8, 10],
  [8, 15, 17],
  [-3, 4, 5],
  [4, -3, 5],
] as const;

interface Params {
  a: [number, number];
  s: number;
  b2: [number, number];
}

export default defineGenerator<Params>({
  id: "AL-P10.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.POSITION"],

  params(rng) {
    const a: [number, number] = [rng.int(-5, 5), rng.int(-5, 5)];
    const b2: [number, number] = [rng.int(-6, 6), rng.int(-6, 6)];
    if (a.includes(0) || b2.includes(0) || (a[0] + b2[0]) % 2 !== 0 || (a[1] + b2[1]) % 2 !== 0)
      reject("a whole-number midpoint");
    return { a, s: rng.int(0, STEPS.length - 1), b2 };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [dx, dy, d] = STEPS[p.s] ?? (STEPS[0] as (typeof STEPS)[number]);
        const b = [p.a[0] + dx, p.a[1] + dy];
        const wrongD = Math.round((mag(p.a) + mag(b)) * 100) / 100;
        return A.standard({
          question: [
            "Points A and B have position vectors ",
            A.math(ijk(p.a)),
            " and ",
            A.math(ijk(b)),
            ".",
          ],
          ask: "Find the distance AB.",
          answer: A.number(d),
          wrong: wrongs(d, [
            {
              code: "GEO.VECTOR.POSITION",
              value: A.number(wrongD, { accuracy: { dp: 2 } }),
              feedback: "Find the vector AB = b − a first, then its magnitude.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\overrightarrow{AB} = ${ijk([dx, dy])},\\ |\\overrightarrow{AB}| = \\sqrt{${dx}^2 + ${dy}^2} = ${d}`,
            },
          ],
        });
      }
      case 2: {
        const mid = [(p.a[0] + p.b2[0]) / 2, (p.a[1] + p.b2[1]) / 2];
        const half = [(p.b2[0] - p.a[0]) / 2, (p.b2[1] - p.a[1]) / 2];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A and B have position vectors ",
            A.math(`\\mathbf{a} = ${ijk(p.a)}`),
            " and ",
            A.math(`\\mathbf{b} = ${ijk(p.b2)}`),
            ".",
          ],
          ask: "What is the position vector of the midpoint of AB?",
          correct: A.math(ijk(mid)),
          distractors: [
            {
              content: A.math(ijk(half)),
              code: "GEO.VECTOR.POSITION",
              feedback: "½(b − a) is half the journey from A; add it to a: ½(a + b).",
            },
            {
              content: A.math(ijk([p.a[0] + p.b2[0], p.a[1] + p.b2[1]])),
              code: "GEO.VECTOR.POSITION",
              feedback: "Halve a + b to get the midpoint.",
            },
          ].filter(distinctFrom(A.math(ijk(mid)))),
          solution: [{ say: "", math: `\\tfrac{1}{2}(\\mathbf{a} + \\mathbf{b}) = ${ijk(mid)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sol says that if A and B have position vectors a and b, then ",
            A.math("\\overrightarrow{AB} = \\mathbf{a} + \\mathbf{b}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Go from A back to O (−a), then out to B (+b): AB = b − a.",
              correct: true,
            },
            {
              text: "True. Add the position vectors to join the points.",
              code: "GEO.VECTOR.POSITION",
            },
            { text: "False. AB = a − b.", code: "GEO.VECTOR.POSITION" },
          ],
          solution: [
            {
              say: `Example: a = ${ijk(p.a).replace(/\\mathbf\{(.)\}/g, "$1")} and b = ${ijk(p.b2).replace(/\\mathbf\{(.)\}/g, "$1")}: AB = ${toLatex(frac(p.b2[0] - p.a[0]))}i + (${p.b2[1] - p.a[1]})j.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (STEPS[p.s] ?? STEPS[0])[2];
    return true;
  },
});
