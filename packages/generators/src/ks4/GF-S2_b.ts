/**
 * @statement GF-S2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S2.b: Interpret and construct charts for discrete data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, type Topic } from "../shared/sta.ts";

const SIBLINGS: Topic = {
  what: "number of brothers and sisters",
  who: "pupils",
  categories: ["0", "1", "2", "3", "4"],
};

interface Params {
  f: number[];
}

const mode = (f: number[]) => f.indexOf(Math.max(...f));
function median(f: number[]): number {
  const n = f.reduce((s, x) => s + x, 0);
  const at = (k: number) => {
    let c = 0;
    for (let v = 0; v < f.length; v++) {
      c += f[v] ?? 0;
      if (c >= k) return v;
    }
    return f.length - 1;
  };
  return n % 2 === 1 ? at((n + 1) / 2) : (at(n / 2) + at(n / 2 + 1)) / 2;
}

export default defineGenerator<Params>({
  id: "GF-S2.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MODE.FREQUENCY", "STA.MEDIAN.UNORDERED"],

  params(rng) {
    const p = { f: [0, 1, 2, 3, 4].map(() => rng.int(1, 12)) };
    const top = Math.max(...p.f);
    if (p.f.filter((x) => x === top).length > 1 || top <= 4)
      reject("one clear mode, bigger than any value");
    if (median(p.f) === 2 || !Number.isInteger(median(p.f)))
      reject("a whole-number median away from the middle bar");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const chart = A.figure(barChart(SIBLINGS, p.f, 2, 14));
    switch (depth) {
      case 1: {
        const v = mode(p.f);
        return A.standard({
          question: ["The bar chart shows how many brothers and sisters some pupils have.", chart],
          ask: "What is the mode of the number of brothers and sisters?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MODE.FREQUENCY",
              value: A.number(Math.max(...p.f)),
              feedback:
                "That is how many pupils gave the most common answer. The mode is the answer itself.",
            },
          ]),
          solution: [{ say: `The tallest bar is at ${v}.` }],
        });
      }
      case 2: {
        const v = median(p.f);
        const n = p.f.reduce((s, x) => s + x, 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The bar chart shows how many brothers and sisters some pupils have.",
                chart,
              ],
              ask: "Find the median number of brothers and sisters.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number(2),
              feedback: `The median is the middle pupil's value, not the middle bar. There are ${n} pupils.`,
            },
          ]),
          solution: [
            { say: `Count along the bars to the middle pupil (of ${n}): the median is ${v}.` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "The bars of a bar chart for discrete data, such as numbers of siblings, touch each other.",
          ],
          truth: "never",
          reasons: [
            {
              text: "Never. Discrete data takes separate values, so the bars (or lines) have gaps between them. Histograms, for continuous data, have touching bars.",
              correct: true,
            },
            { text: "Always. All bar charts have touching bars." },
            { text: "Sometimes. Only when the frequencies are close.", code: "STA.MODE.FREQUENCY" },
          ],
          solution: [{ say: "Gaps show that values in between are not possible." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === mode(p.f);
    if (question.key.depth === 2) return numberAnswer(question) === median(p.f);
    return true;
  },
});
