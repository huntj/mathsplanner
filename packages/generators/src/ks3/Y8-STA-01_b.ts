/**
 * @statement Y8-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-STA-01.b: Construct and interpret pie charts and pictograms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { pictogram, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  key: number;
  quarters: number[];
  i: number;
  total: number;
  f: number;
}

export default defineGenerator<Params>({
  id: "Y8-STA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.KEY-IGNORED", "STA.PIE.ANGLE-AS-COUNT"],

  params(rng) {
    const p = {
      topic: rng.int(0, TOPICS.length - 1),
      key: rng.pick([2, 4, 8]),
      quarters: [0, 1, 2, 3].map(() => rng.int(2, 18)),
      i: rng.int(0, 3),
      total: rng.pick([20, 24, 30, 36, 40, 45, 60, 72, 90]),
      f: 0,
    };
    p.f = rng.int(2, Math.floor(p.total / 2));
    if ((p.quarters[p.i] ?? 0) % 4 === 0) reject("a part symbol to read");
    if (p.key === 2 && (p.quarters[p.i] ?? 0) % 2 !== 0) reject("whole numbers of people");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    switch (depth) {
      case 1: {
        const values = p.quarters.map((q) => (q / 4) * p.key);
        const v = values[p.i] ?? 0;
        return A.standard({
          question: [
            `The pictogram shows the ${topic.what} of some ${topic.who}. One symbol stands for ${p.key} ${topic.who}.`,
            A.figure(pictogram(topic, values, p.key)),
          ],
          ask: `How many chose ${topic.categories[p.i]}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.KEY-IGNORED",
              value: A.number((p.quarters[p.i] ?? 0) / 4),
              feedback: `Each whole symbol stands for ${p.key}, and part symbols for part of ${p.key}.`,
            },
          ]),
          solution: [{ say: `${(p.quarters[p.i] ?? 0) / 4} symbols × ${p.key} = ${v}.` }],
        });
      }
      case 2: {
        const v = (p.f * 360) / p.total;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `${p.total} ${topic.who} were asked about their ${topic.what}. ${p.f} chose ${topic.categories[0]}.`,
              ],
              ask: `What angle should the ${topic.categories[0]} sector have on a pie chart, in degrees?`,
            },
          ],
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "STA.PIE.ANGLE-AS-COUNT",
              value: A.degrees(p.f),
              feedback: `The whole circle is 360°, shared between ${p.total} ${topic.who}: each gets ${360 / p.total}°.`,
            },
          ]),
          solution: [
            { say: "", math: `\\frac{${p.f}}{${p.total}} \\times 360^\\circ = ${v}^\\circ` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Dev says a sector of 90° on a pie chart stands for a quarter of the data."],
          truth: true,
          reasons: [
            { text: "True. 90° is a quarter of the 360° full circle.", correct: true },
            { text: "False. It stands for 90 people.", code: "STA.PIE.ANGLE-AS-COUNT" },
            { text: "False. You need to know the total to say.", code: "STA.PIE.ANGLE-AS-COUNT" },
          ],
          solution: [{ say: "Pie charts show fractions of the whole." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === ((p.quarters[p.i] ?? 0) / 4) * p.key;
    if (question.key.depth === 2) return numberAnswer(question) === (p.f * 360) / p.total;
    return true;
  },
});
