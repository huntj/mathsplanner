/**
 * @statement CM-A10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A10: Calculate and interpret Spearman's rank correlation coefficient, including tied ranks
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  scores: number[];
  tie: number;
  judge2: number[];
}

/** Rank from highest (1) to lowest, giving tied values the mean of their positions. */
function ranks(xs: number[]): number[] {
  const sorted = [...xs].sort((a, b) => b - a);
  return xs.map((x) => {
    const first = sorted.indexOf(x) + 1;
    const count = sorted.filter((y) => y === x).length;
    return first + (count - 1) / 2;
  });
}

const rs = (p: Params) => {
  const d2 = p.judge2.reduce((s, r, i) => s + (i + 1 - r) ** 2, 0);
  return round(1 - (6 * d2) / (5 * 24), 3);
};

export default defineGenerator<Params>({
  id: "CM-A10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SPEARMAN"],

  params(rng) {
    const base = rng.shuffle(Array.from({ length: 30 }, (_, i) => 40 + i)).slice(0, 5);
    const tie = rng.int(1, 3);
    // Make positions tie and tie + 1 (in descending order) equal.
    const sorted = [...base].sort((a, b) => b - a);
    const tied = sorted[tie] ?? 0;
    const scores = base.map((x) => (x === sorted[tie - 1] ? tied : x));
    const judge2 = rng.shuffle([1, 2, 3, 4, 5]);
    const p = { scores, tie, judge2 };
    if (judge2.join() === "1,2,3,4,5" || judge2.join() === "5,4,3,2,1")
      reject("rankings that are not identical or reversed");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const r = ranks(p.scores);
        const tiedScore = [...p.scores].sort((a, b) => b - a)[p.tie] ?? 0;
        const v = r[p.scores.indexOf(tiedScore)] ?? 0;
        return A.standard({
          question: [
            `Five students' test scores are ${p.scores.join(", ")}. They are ranked from highest (rank 1) to lowest.`,
          ],
          ask: `What rank is given to each score of ${tiedScore}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SPEARMAN",
              value: A.number(Math.floor(v)),
              feedback: "Tied values share the mean of the ranks they would take.",
            },
          ]),
          solution: [
            {
              say: `The two scores of ${tiedScore} would take ranks ${v - 0.5} and ${v + 0.5}, so each gets ${v}.`,
            },
          ],
        });
      }
      case 2: {
        const v = rs(p);
        const d2 = p.judge2.reduce((s, r, i) => s + (i + 1 - r) ** 2, 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Two judges rank five cakes. Judge 1 ranks them A to E as 1, 2, 3, 4, 5. Judge 2 ranks them ${p.judge2.join(", ")}.`,
              ],
              ask: "Calculate Spearman's rank correlation coefficient, to 3 decimal places.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(v, [
            {
              code: "STA.SPEARMAN",
              value: A.number(round(1 - (6 * d2) / (5 * 4), 3), { accuracy: { dp: 3 } }),
              feedback: "The denominator is n(n² − 1) = 5 × 24 = 120.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sum d^2 = ${d2}, \\quad r_s = 1 - \\frac{6 \\times ${d2}}{5 \\times 24} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mel says that a Spearman's coefficient of 1 means the data points lie on a straight line.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. rs = 1 means the ranks agree exactly: as one variable increases, so does the other. The points could lie on any increasing curve.",
              correct: true,
            },
            {
              text: "True. Spearman's coefficient measures straight-line fit.",
              code: "STA.SPEARMAN",
            },
            { text: "True. It is the same as the PMCC.", code: "STA.SPEARMAN" },
          ],
          solution: [{ say: "For y = x³, rs = 1 but the points are not on a straight line." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === rs(p);
    return true;
  },
});
