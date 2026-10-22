/**
 * @statement AL-S3.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S3.2: Calculate conditional probability using Venn diagrams, tree diagrams, two-way tables and
// P(A|B) = P(A ∩ B)/P(B)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  ab: number;
  b: number;
  a: number;
  t: [number, number, number, number];
}

const r4 = (x: number) => Math.round(x * 10000) / 10000;

export default defineGenerator<Params>({
  id: "AL-S3.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.FORMULA", "PRO.CONDITIONAL.TOTAL"],

  params(rng) {
    const b = rng.pick([0.4, 0.5, 0.6, 0.8]);
    const a = rng.pick([0.3, 0.45, 0.6, 0.75]);
    const ab = rng.pick([0.08, 0.12, 0.2, 0.24]);
    const t: [number, number, number, number] = [
      rng.int(5, 30),
      rng.int(5, 30),
      rng.int(5, 30),
      rng.int(5, 30),
    ];
    if (ab >= a || ab >= b || a === b || t[0] === t[1]) reject("consistent probabilities");
    return { ab, b, a, t };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r4(p.ab / p.b);
        return A.standard({
          question: `P(A) = ${p.a}, P(B) = ${p.b} and P(A ∩ B) = ${p.ab}.`,
          ask: "Find P(A | B).",
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.CONDITIONAL.FORMULA",
              value: A.number(r4(p.ab / p.a), { accuracy: { dp: 4 } }),
              feedback: "Given B: divide by P(B).",
            },
          ]),
          solution: [{ say: `${p.ab} ÷ ${p.b} = ${v}.` }],
        });
      }
      case 2: {
        const [w, x, y, z] = p.t;
        const rows = [
          ["drives", w, x, w + x],
          ["does not drive", y, z, y + z],
          ["total", w + y, x + z, w + x + y + z],
        ];
        const total = w + x + y + z;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The table shows some adults by age group.",
                A.displayMath(tableLatex(["", "under 30", "30 or over", "total"], rows)),
              ],
              ask: "An adult who is under 30 is chosen at random. Find the probability that they drive.",
            },
          ],
          answer: A.exact(frac(w, w + y)),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(w, total)),
              feedback: `We know the adult is under 30, so divide by the ${w + y} under-30s.`,
            },
          ],
          solution: [{ say: `${w} of the ${w + y} under-30s drive.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `P(A) = ${p.a}, P(B) = ${p.b} and P(A ∩ B) = ${p.ab}. Tia says P(A | B) = P(B | A).`,
          truth: false,
          reasons: [
            {
              text: `False. P(A | B) = ${p.ab}/${p.b} = ${r4(p.ab / p.b)}, but P(B | A) = ${p.ab}/${p.a} = ${r4(p.ab / p.a)}: they divide by different probabilities.`,
              correct: true,
            },
            { text: "True. Both use P(A ∩ B).", code: "PRO.CONDITIONAL.FORMULA" },
            {
              text: "True. The order of the events does not matter.",
              code: "PRO.CONDITIONAL.FORMULA",
            },
          ],
          solution: [{ say: "P(A | B) = P(A ∩ B)/P(B); P(B | A) = P(A ∩ B)/P(A)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r4(p.ab / p.b);
    return true;
  },
});
