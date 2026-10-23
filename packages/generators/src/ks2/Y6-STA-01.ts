/**
 * @statement Y6-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-STA-01: Interpret and construct pie charts and line graphs and use these to solve problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { pieChart, TOPICS } from "../shared/sta.ts";

export interface Params {
  topic: number;
  /** Total surveyed, a factor of 360, and the frequencies, which sum to it. */
  total: number;
  values: number[];
  ask: number;
  /** Depth 4: a second, bigger survey. */
  other: number;
}

const TOTALS = [20, 24, 30, 36, 40, 45, 60, 72, 90, 120];

export default defineGenerator<Params>({
  id: "Y6-STA-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.PIE.ANGLE-AS-COUNT"],

  params(rng, numbers) {
    const total = rng.pick(numbers === "friendly" ? [20, 24, 30, 36] : TOTALS);
    const cuts = rng
      .shuffle(Array.from({ length: total - 1 }, (_, i) => i + 1))
      .slice(0, 3)
      .sort((a, b) => a - b);
    const values = [...cuts, total].map((c, i) => c - ([0, ...cuts][i] ?? 0));
    if (values.some((v) => (v * 360) / total < 40) || new Set(values).size < 4)
      reject("sectors big enough to label, all different");
    return { topic: rng.int(0, 4), total, values, ask: rng.int(0, 3), other: total * 2 };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const name = topic.categories[p.ask] ?? "";
    const v = p.values[p.ask] ?? 0;
    const angle = (v * 360) / p.total;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `${p.total} ${topic.who} were asked about their ${topic.what}. The pie chart shows the results.`,
            A.figure(pieChart(topic, p.values, true)),
          ],
          ask: `How many chose ${name}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.PIE.ANGLE-AS-COUNT",
              value: A.number(angle),
              feedback: `${angle}° is the angle, not the number of ${topic.who}. The whole circle, 360°, stands for ${p.total}.`,
            },
          ]),
          solution: [
            {
              say: `360° stands for ${p.total}, so each person is ${360 / p.total}°. ${angle}° ÷ ${360 / p.total}° = ${v}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: `${p.total} ${topic.who} were asked about their ${topic.what}. ${v} chose ${name}. Ava is drawing a pie chart.`,
          ask: `What angle should the ${name} sector have, in degrees?`,
          answer: A.number(angle),
          wrong: wrongs(angle, [
            {
              code: "STA.PIE.ANGLE-AS-COUNT",
              value: A.number(v),
              feedback: `Each person gets 360° ÷ ${p.total} = ${360 / p.total}°, so ${v} people get ${v} × ${360 / p.total}°.`,
            },
          ]),
          solution: [
            {
              say: `360 ÷ ${p.total} = ${360 / p.total}° per person, and ${v} × ${360 / p.total} = ${angle}°.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Two pie charts show the ${topic.what} of two groups: one of ${p.total} ${topic.who} and one of ${p.other}. The ${name} sector has the same angle, ${angle}°, in both. Kai says the same number chose ${name} in each group.`,
          truth: false,
          reasons: [
            {
              text: `False. ${angle}° is the same fraction of each group, but the groups are different sizes: ${v} out of ${p.total} and ${v * 2} out of ${p.other}.`,
              correct: true,
            },
            {
              text: "True. The same angle always means the same number.",
              code: "STA.PIE.ANGLE-AS-COUNT",
            },
            { text: "True. Pie charts always show 360 people." },
          ],
          solution: [
            {
              say: "A pie chart shows proportions. To compare numbers you need the size of each group.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const v = p.values[p.ask] ?? 0;
    return numberAnswer(question) === (question.key.depth === 1 ? v : (v * 360) / p.total);
  },
});
