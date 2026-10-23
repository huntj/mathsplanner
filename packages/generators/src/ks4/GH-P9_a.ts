/**
 * @statement GH-P9.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-P9.a: Find conditional probabilities from two-way tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  by: number;
  bn: number;
  gy: number;
  gn: number;
}

export default defineGenerator<Params>({
  id: "GH-P9.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.TOTAL", "PRO.CONDITIONAL.FORMULA"],

  params(rng) {
    const p = { by: rng.int(5, 30), bn: rng.int(5, 30), gy: rng.int(5, 30), gn: rng.int(5, 30) };
    if (p.gy + p.gn === p.gy + p.by) reject("different group sizes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(
      tableLatex(
        ["", "Has a bike", "No bike", "Total"],
        [
          ["Boys", p.by, p.bn, p.by + p.bn],
          ["Girls", p.gy, p.gn, p.gy + p.gn],
          ["Total", p.by + p.gy, p.bn + p.gn, p.by + p.bn + p.gy + p.gn],
        ],
      ),
    );
    const total = p.by + p.bn + p.gy + p.gn;
    switch (depth) {
      case 1: {
        const v = frac(p.gy, p.gy + p.gn);
        return A.standard({
          question: ["The table shows whether some pupils have a bike.", table],
          ask: "A girl is chosen at random. Find the probability that she has a bike.",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.gy, total)),
              feedback: `You already know it is a girl, so divide by the number of girls, ${p.gy + p.gn}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.gy}}{${p.gy + p.gn}} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const v = frac(p.gy, p.gy + p.by);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The table shows whether some pupils have a bike.", table],
              ask: "A pupil with a bike is chosen at random. Find the probability that the pupil is a girl.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.FORMULA",
              value: A.exact(frac(p.gy, p.gy + p.gn)),
              feedback: `The given group is pupils with a bike: ${p.gy + p.by} of them.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.gy}}{${p.gy + p.by}} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says P(girl given has a bike) is always the same as P(has a bike given girl).",
          ],
          truth: false,
          reasons: [
            {
              text: `False. They divide by different groups: ${p.gy}/${p.gy + p.by} and ${p.gy}/${p.gy + p.gn}.`,
              correct: true,
            },
            { text: "True. Both are about girls with bikes.", code: "PRO.CONDITIONAL.FORMULA" },
            {
              text: `True. Both are ${p.gy} out of the whole table.`,
              code: "PRO.CONDITIONAL.TOTAL",
            },
          ],
          solution: [{ say: "The 'given' group goes on the bottom." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.gy, p.gy + p.gn));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.gy, p.gy + p.by));
    return true;
  },
});
