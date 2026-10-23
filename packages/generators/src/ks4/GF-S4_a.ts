/**
 * @statement GF-S4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S4.a: Find the mean, median and mode
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  list: number[];
  scores: number[];
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;

export default defineGenerator<Params>({
  id: "GF-S4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MEDIAN.UNORDERED", "STA.MEAN.DIVISOR", "STA.OUTLIER.MEAN"],

  params(rng) {
    const list = [0, 1, 2, 3, 4, 5, 6].map(() => rng.int(2, 30));
    const scores = [0, 1, 2, 3].map(() => rng.int(1, 10));
    scores.push(0);
    const p = { list, scores };
    if (median(list) === list[3] || new Set(list).size < 7)
      reject("an unordered list whose middle is not the median");
    const sum = scores.reduce((s, x) => s + x, 0);
    if (sum % 5 !== 0 || sum % 4 === 0)
      reject("a whole-number mean that differs when the zero is left out");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = median(p.list);
        return A.standard({
          question: [`Here are the ages of seven people: ${p.list.join(", ")}.`],
          ask: "Find the median age.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number(p.list[3] ?? 0),
              feedback: "Put the values in order first, then take the middle one.",
            },
          ]),
          solution: [
            {
              say: "In order: ",
              math: `${[...p.list].sort((a, b) => a - b).join(", ")} \\Rightarrow ${v}`,
            },
          ],
        });
      }
      case 2: {
        const sum = p.scores.reduce((s, x) => s + x, 0);
        const v = sum / 5;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A team's goals in five matches were ${p.scores.join(", ")}.`],
              ask: "Find the mean number of goals per match.",
            },
            {
              question: [`Five pupils scored ${p.scores.join(", ")} in a quiz.`],
              ask: "Work out the mean score.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(Math.round((sum / 4) * 100) / 100),
              feedback: "The 0 is still a value: divide by 5.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${sum}}{5} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Five workers earn £18k, £20k, £21k, £22k and £250k. Sam says the mean is the best average to describe a typical wage.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The £250k outlier pulls the mean up to £66.2k, more than four of the five earn. The median, £21k, is more typical.",
              correct: true,
            },
            {
              text: "True. The mean uses every value, so it is always best.",
              code: "STA.OUTLIER.MEAN",
            },
            { text: "True. The mean is the most accurate average.", code: "STA.OUTLIER.MEAN" },
          ],
          solution: [{ say: "With an extreme value, the median is often more representative." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === median(p.list);
    if (question.key.depth === 2)
      return numberAnswer(question) === p.scores.reduce((s, x) => s + x, 0) / 5;
    return true;
  },
});
