/**
 * @statement Y3-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-STA-02: Solve one-step and two-step questions such as 'how many more?' and 'how many fewer?' using
// bar charts, pictograms and tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, distinctValues, TOPICS } from "../shared/sta.ts";

export interface Params {
  topic: number;
  values: number[];
  step: number;
  a: number;
  b: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y3-STA-02",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["AS.PROBLEM.KEYWORD", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const step = rng.pick(numbers === "friendly" ? [1, 2] : [2, 5]);
    const [a, b, c] = rng.shuffle([0, 1, 2, 3]);
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 1, 9).map((v) => v * step),
      step,
      a: a ?? 0,
      b: b ?? 1,
      c: c ?? 2,
    };
  },

  build(p, depth): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const cats = topic.categories;
    const v = (i: number) => p.values[i] ?? 0;
    const chart = A.figure(barChart(topic, p.values, p.step));
    const intro = `The bar chart shows the ${topic.what} of some ${topic.who}.`;
    const [hi, lo] = v(p.a) > v(p.b) ? [p.a, p.b] : [p.b, p.a];
    switch (depth) {
      case 1: {
        const diff = v(hi) - v(lo);
        return A.standard({
          question: [intro, chart],
          ask: `How many more ${topic.who} chose ${cats[hi]} than ${cats[lo]}?`,
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(v(hi) + v(lo)),
              feedback: `"How many more" means find the difference: ${v(hi)} − ${v(lo)}.`,
            },
          ]),
          solution: [
            { say: `${cats[hi]} ${v(hi)}, ${cats[lo]} ${v(lo)}: ${v(hi)} − ${v(lo)} = ${diff}.` },
          ],
        });
      }
      case 2: {
        const diff = v(hi) - v(lo);
        return A.standard({
          question: [intro, chart],
          ask: `How many fewer ${topic.who} chose ${cats[lo]} than ${cats[hi]}?`,
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(v(hi) + v(lo)),
              feedback: `"How many fewer" also asks for the difference: ${v(hi)} − ${v(lo)}.`,
            },
          ]),
          solution: [{ say: `${v(hi)} − ${v(lo)} = ${diff}.` }],
        });
      }
      default: {
        const pair = v(p.a) + v(p.b);
        const answer = Math.abs(pair - v(p.c));
        return A.multiStepContext({
          context: [intro, chart],
          parts: [
            {
              ask: `How many ${topic.who} chose ${cats[p.a]} or ${cats[p.b]}?`,
              answer: A.number(pair),
            },
            {
              ask: `How many ${pair > v(p.c) ? "more" : "fewer"} is that than the number who chose ${cats[p.c]}?`,
              answer: A.number(answer),
              wrong: wrongs(answer, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(Math.abs(v(p.a) - v(p.c))),
                  feedback: `Use the total of ${cats[p.a]} and ${cats[p.b]}, ${pair}.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${v(p.a)} + ${v(p.b)} = ${pair}.` },
            { say: `The difference between ${pair} and ${v(p.c)} is ${answer}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const v = (i: number) => p.values[i] ?? 0;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === Math.abs(v(p.a) + v(p.b) - v(p.c));
    return numberAnswer(question) === Math.abs(v(p.a) - v(p.b));
  },
});
