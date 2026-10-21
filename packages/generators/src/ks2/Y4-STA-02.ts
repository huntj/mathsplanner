/**
 * @statement Y4-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-STA-02: Solve comparison, sum and difference problems using information presented in bar charts,
// pictograms, tables and other graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, distinctValues, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  step: number;
  a: number;
  b: number;
  price: number;
}

export default defineGenerator<Params>({
  id: "Y4-STA-02",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["STA.SCALE.READ", "AS.PROBLEM.KEYWORD", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const step = rng.pick(numbers === "friendly" ? [5] : [5, 10, 20]);
    const [a, b] = rng.shuffle([0, 1, 2, 3]);
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 1, 9).map((v) => v * step),
      step,
      a: a ?? 0,
      b: b ?? 1,
      price: rng.int(2, 5),
    };
  },

  build(p, depth): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const cats = topic.categories;
    const v = (i: number) => p.values[i] ?? 0;
    const chart = A.figure(barChart(topic, p.values, p.step));
    const intro = `The bar chart shows the ${topic.what} of some ${topic.who}.`;
    switch (depth) {
      case 1: {
        const total = p.values.reduce((s, x) => s + x, 0);
        return A.standard({
          question: [intro, chart],
          ask: `How many ${topic.who} are shown altogether?`,
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "STA.SCALE.READ",
              value: A.number(total / p.step),
              feedback: `The scale goes up in ${p.step}s, so read each bar against it.`,
            },
          ]),
          solution: [{ say: `${p.values.join(" + ")} = ${total}.` }],
        });
      }
      case 2: {
        const diff = Math.abs(v(p.a) - v(p.b));
        const [hi, lo] = v(p.a) > v(p.b) ? [p.a, p.b] : [p.b, p.a];
        return A.standard({
          question: [intro, chart],
          ask: `What is the difference between the number who chose ${cats[hi]} and the number who chose ${cats[lo]}?`,
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(v(p.a) + v(p.b)),
              feedback: "The difference is found by subtracting.",
            },
          ]),
          solution: [{ say: `${v(hi)} − ${v(lo)} = ${diff}.` }],
        });
      }
      default: {
        const pair = v(p.a) + v(p.b);
        return A.multiStepContext({
          context: [
            intro,
            chart,
            ` Each of the ${topic.who} who chose ${cats[p.a]} or ${cats[p.b]} pays £${p.price} for a badge.`,
          ],
          parts: [
            {
              ask: `How many ${topic.who} chose ${cats[p.a]} or ${cats[p.b]}?`,
              answer: A.number(pair),
            },
            {
              ask: "How much do they pay for badges altogether, in pounds?",
              answer: A.number(pair * p.price),
              wrong: wrongs(pair * p.price, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(v(p.a) * p.price),
                  feedback: `Include the ${cats[p.b]} group too: ${pair} ${topic.who}.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `${v(p.a)} + ${v(p.b)} = ${pair}.` },
            { say: `${pair} × £${p.price} = £${pair * p.price}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const v = (i: number) => p.values[i] ?? 0;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === (v(p.a) + v(p.b)) * p.price;
    return (
      numberAnswer(question) ===
      (question.key.depth === 1 ? p.values.reduce((s, x) => s + x, 0) : Math.abs(v(p.a) - v(p.b)))
    );
  },
});
