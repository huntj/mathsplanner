/**
 * @statement Y8-STA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-STA-01.c: Construct and interpret vertical line charts for numerical data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, type Topic } from "../shared/sta.ts";

const GOALS: Topic = {
  what: "goals scored in each match",
  who: "matches",
  categories: ["0", "1", "2", "3", "4"],
};

interface Params {
  f: number[];
}

const n = (f: number[]) => f.reduce((s, x) => s + x, 0);
const total = (f: number[]) => f.reduce((s, x, k) => s + x * k, 0);

export default defineGenerator<Params>({
  id: "Y8-STA-01.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MODE.FREQUENCY", "STA.MEAN.DIVISOR"],

  params(rng) {
    const p = { f: [0, 1, 2, 3, 4].map(() => rng.int(1, 10)) };
    const top = Math.max(...p.f);
    if (p.f.filter((x) => x === top).length > 1 || top <= 4)
      reject("one clear mode, bigger than any value");
    if (((total(p.f) / n(p.f)) * 10) % 1 !== 0) reject("a mean with at most one decimal place");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const chart = A.figure(barChart(GOALS, p.f, 2, 12));
    switch (depth) {
      case 1: {
        const v = p.f.indexOf(Math.max(...p.f));
        return A.standard({
          question: [
            "The chart shows the number of goals a team scored in each of its matches.",
            chart,
          ],
          ask: "What is the modal number of goals?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MODE.FREQUENCY",
              value: A.number(Math.max(...p.f)),
              feedback:
                "That is how many matches had the most common score. The mode is the score itself.",
            },
          ]),
          solution: [{ say: `The tallest bar is at ${v} goals.` }],
        });
      }
      case 2: {
        const v = total(p.f) / n(p.f);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The chart shows the number of goals a team scored in each of its matches.",
                chart,
              ],
              ask: "Work out the mean number of goals per match.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(total(p.f) / 5),
              feedback: `Divide by the number of matches, ${n(p.f)}, not the number of bars.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.f.map((x, k) => `${k} \\times ${x}`).join(" + ")}}{${n(p.f)}} = \\frac{${total(p.f)}}{${n(p.f)}} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "On a chart of numerical data like this, the mode is the value under the tallest bar.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. The tallest bar has the highest frequency, so its value is the most common one.",
              correct: true,
            },
            {
              text: "Never. The mode is the height of the tallest bar.",
              code: "STA.MODE.FREQUENCY",
            },
            { text: "Sometimes. Only if the bars are in order.", code: "STA.MODE.FREQUENCY" },
          ],
          solution: [{ say: "Read the value along the bottom, not the frequency up the side." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.f.indexOf(Math.max(...p.f));
    if (question.key.depth === 2) return numberAnswer(question) === total(p.f) / n(p.f);
    return true;
  },
});
