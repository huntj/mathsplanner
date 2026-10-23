/**
 * @statement Y8-STA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-STA-01.a: Construct and interpret frequency tables and bar charts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { barChart, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  bars: number[];
  i: number;
  f: number[];
  j: number;
}

export default defineGenerator<Params>({
  id: "Y8-STA-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ", "RAT.PART-WHOLE"],

  params(rng) {
    const p = {
      topic: rng.int(0, TOPICS.length - 1),
      bars: [0, 1, 2, 3].map(() => rng.int(1, 9) * 5),
      i: rng.int(0, 3),
      f: [0, 1, 2, 3].map(() => rng.int(2, 15)),
      j: rng.int(0, 3),
    };
    const total = p.f.reduce((s, x) => s + x, 0);
    if (total - (p.f[p.j] ?? 0) === 0 || (p.f[p.j] ?? 0) * 2 === total)
      reject("a fraction that is not a half");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    switch (depth) {
      case 1: {
        const v = p.bars[p.i] ?? 0;
        return A.standard({
          question: [
            `The bar chart shows the ${topic.what} of some ${topic.who}.`,
            A.figure(barChart(topic, p.bars, 5, 50)),
          ],
          ask: `How many chose ${topic.categories[p.i]}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 5),
              feedback: "The scale goes up in 5s: each grid line is worth 5.",
            },
          ]),
          solution: [{ say: `Read across from the top of the bar: ${v}.` }],
        });
      }
      case 2: {
        const total = p.f.reduce((s, x) => s + x, 0);
        const fj = p.f[p.j] ?? 0;
        const v = frac(fj, total);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The frequency table shows the ${topic.what} of some ${topic.who}.`,
                A.math(
                  tableLatex(
                    [topic.what[0]?.toUpperCase() + topic.what.slice(1), "Frequency"],
                    p.f.map((x, k) => [topic.categories[k] ?? "", x]),
                  ),
                ),
              ],
              ask: `What fraction of them chose ${topic.categories[p.j]}?`,
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(frac(fj, total - fj)),
              feedback: `Divide by the total frequency, ${total}, not by the rest.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${fj}}{${total}} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [`Sam says the tallest bar on a bar chart of ${topic.what} shows the mode.`],
          truth: true,
          reasons: [
            {
              text: "True. The tallest bar is the category with the highest frequency, which is the mode.",
              correct: true,
            },
            { text: "False. The tallest bar shows the median.", code: "STA.SCALE.READ" },
            { text: "False. The mode is the height of the tallest bar.", code: "STA.SCALE.READ" },
          ],
          solution: [{ say: "The mode is the category, not its frequency." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.bars[p.i];
    if (question.key.depth === 2)
      return (
        exactAnswer(question) ===
        toLatex(
          frac(
            p.f[p.j] ?? 0,
            p.f.reduce((s, x) => s + x, 0),
          ),
        )
      );
    return true;
  },
});
