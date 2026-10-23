/**
 * @statement GF-S2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S2.a: Interpret and construct charts for categorical data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, pieChart, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  total: number;
  values: number[];
  ask: number;
  bars: number[];
  i: number;
  j: number;
}

export default defineGenerator<Params>({
  id: "GF-S2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.PIE.ANGLE-AS-COUNT", "STA.SCALE.READ"],

  params(rng) {
    const total = rng.pick([18, 24, 30, 36, 40, 45, 60]);
    const a = rng.int(2, Math.floor(total / 3));
    const b = rng.int(2, Math.floor(total / 3));
    const c = rng.int(2, Math.floor(total / 4));
    const d = total - a - b - c;
    const bars = [0, 1, 2, 3].map(() => rng.int(1, 12) * 2);
    const p = {
      topic: rng.int(0, TOPICS.length - 1),
      total,
      values: [a, b, c, d],
      ask: rng.int(0, 3),
      bars,
      i: rng.int(0, 3),
      j: rng.int(0, 3),
    };
    if (d < 2 || new Set(p.values).size < 4) reject("four different sectors");
    if (p.values.some((v) => (v * 360) / total < 40)) reject("sectors wide enough to label");
    if (p.i === p.j || bars[p.i] === bars[p.j]) reject("two different bars");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const name = (k: number) => topic.categories[k] ?? "";
    switch (depth) {
      case 1: {
        const v = p.values[p.ask] ?? 0;
        const angle = (v * 360) / p.total;
        return A.standard({
          question: [
            `${p.total} ${topic.who} were asked about their ${topic.what}. The pie chart shows the results.`,
            A.figure(pieChart(topic, p.values, true)),
          ],
          ask: `How many chose ${name(p.ask)}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.PIE.ANGLE-AS-COUNT",
              value: A.number(angle),
              feedback: `${angle}° is the angle. Each person is 360 ÷ ${p.total} = ${360 / p.total}°.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${angle}}{360} \\times ${p.total} = ${v}` }],
        });
      }
      case 2: {
        const diff = Math.abs((p.bars[p.i] ?? 0) - (p.bars[p.j] ?? 0));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The bar chart shows the ${topic.what} of some ${topic.who}.`,
                A.figure(barChart(topic, p.bars, 2, 26)),
              ],
              ask: `How many more chose ${name(Math.max(p.bars[p.i] ?? 0, p.bars[p.j] ?? 0) === p.bars[p.i] ? p.i : p.j)} than ${name(Math.max(p.bars[p.i] ?? 0, p.bars[p.j] ?? 0) === p.bars[p.i] ? p.j : p.i)}?`,
            },
          ],
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "STA.SCALE.READ",
              value: A.number(diff / 2),
              feedback: "Each grid line on the scale is worth 2.",
            },
          ]),
          solution: [{ say: `Read each bar from the scale, then subtract: ${diff}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `School A's pie chart of ${topic.what} has a bigger ${name(0)} sector than School B's. Jo says more pupils at School A chose ${name(0)}.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A pie chart shows proportions. If School B asked many more pupils, its smaller sector could stand for more people.",
              correct: true,
            },
            {
              text: "True. A bigger sector always means more people.",
              code: "STA.PIE.ANGLE-AS-COUNT",
            },
            { text: "True. The angle is the number of pupils.", code: "STA.PIE.ANGLE-AS-COUNT" },
          ],
          solution: [{ say: "To compare numbers, you need each chart's total too." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.values[p.ask];
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.abs((p.bars[p.i] ?? 0) - (p.bars[p.j] ?? 0));
    return true;
  },
});
