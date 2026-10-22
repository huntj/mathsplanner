/**
 * @statement AL-P4.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.6: Use sequences and series in modelling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  salary: number;
  pct: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "AL-P4.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA", "RAT.COMPOUND.SIMPLE", "ALG.MODEL.LIMITATION"],

  params(rng) {
    return { salary: 1000 * rng.int(20, 35), pct: rng.pick([2, 3, 4, 5]), n: rng.int(5, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    const r = 1 + p.pct / 100;
    const intro = `Ana's salary is £${p.salary} in her first year. It rises by ${p.pct}% each year.`;
    switch (depth) {
      case 1: {
        const s = Math.round(p.salary * r ** (p.n - 1));
        return A.standard({
          question: intro,
          ask: `Find her salary in year ${p.n}, to the nearest pound.`,
          answer: A.number(s, { units: "£", accuracy: { dp: 0 } }),
          wrong: wrongs(s, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number(Math.round(p.salary * r ** p.n), { units: "£", accuracy: { dp: 0 } }),
              feedback: `Year ${p.n} has had ${p.n - 1} rises, so use r^(n − 1).`,
            },
          ]),
          solution: [{ say: `${p.salary} × ${r}^${p.n - 1} = £${s}.` }],
        });
      }
      case 2: {
        const total = Math.round((p.salary * (r ** p.n - 1)) / (r - 1));
        const simple = Math.round(
          p.n * p.salary + (p.salary * (p.pct / 100) * (p.n * (p.n - 1))) / 2,
        );
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: `Find the total she earns over the first ${p.n} years, to the nearest pound.`,
            },
            {
              question: intro,
              ask: `How much does she earn altogether in her first ${p.n} years? Give your answer to the nearest pound.`,
            },
          ],
          answer: A.number(total, { units: "£", accuracy: { dp: 0 } }),
          wrong: wrongs(total, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(simple, { units: "£", accuracy: { dp: 0 } }),
              feedback:
                "Each rise is a percentage of the new salary: the salaries form a geometric series.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `S_{${p.n}} = \\frac{${p.salary}(${r}^{${p.n}} - 1)}{${r} - 1} = ${total}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Ben says the model will predict her salary reliably for the next 60 years.`,
          truth: false,
          reasons: [
            {
              text: "False. Pay rises are unlikely to stay at the same percentage for 60 years, and she will probably retire; the model is only reasonable for a few years.",
              correct: true,
            },
            {
              text: "True. A geometric sequence continues for ever.",
              code: "ALG.MODEL.LIMITATION",
            },
            { text: "True. The model fitted the first few years.", code: "ALG.MODEL.LIMITATION" },
          ],
          solution: [
            {
              say: "Real situations change; a model's assumptions limit how far ahead it can be trusted.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(p.salary * (1 + p.pct / 100) ** (p.n - 1));
    return true;
  },
});
