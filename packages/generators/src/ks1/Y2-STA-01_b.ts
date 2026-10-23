/**
 * @statement Y2-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-STA-01.b: Interpret and construct pictograms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctValues, pictogram, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  key: number;
  /** The category asked about, and a smaller one to compare with. */
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y2-STA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.KEY-IGNORED", "AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const key = numbers === "friendly" ? 2 : rng.pick([2, 5]);
    const values = distinctValues(rng, 4, 1, numbers === "stretch" ? 10 : 6).map((v) => v * key);
    return { topic: rng.int(0, TOPICS.length - 1), values, key, ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const value = p.values[p.ask] ?? 0;
    const name = topic.categories[p.ask] ?? "";
    const chart = A.figure(pictogram(topic, p.values, p.key));
    const intro = `The pictogram shows the ${topic.what} of some ${topic.who}. Each symbol stands for ${p.key}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro, chart],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(value),
          wrong: wrongs(value, [
            {
              code: "STA.KEY-IGNORED",
              value: A.number(value / p.key),
              feedback: `Each symbol stands for ${p.key}, so count in ${p.key}s.`,
            },
          ]),
          solution: [
            {
              say: `${value / p.key} symbols, each worth ${p.key}: ${value / p.key} × ${p.key} = ${value}.`,
            },
          ],
        });
      case 2: {
        const most = Math.max(...p.values);
        const least = Math.min(...p.values);
        const [big, small] = [
          topic.categories[p.values.indexOf(most)] ?? "",
          topic.categories[p.values.indexOf(least)] ?? "",
        ];
        const diff = most - least;
        return A.standard({
          question: [intro, chart],
          ask: `How many more ${topic.who} chose ${big} than ${small}?`,
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "STA.KEY-IGNORED",
              value: A.number(diff / p.key),
              feedback: `That is the difference in symbols. Each symbol is ${p.key}.`,
            },
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(most + least),
              feedback: "How many more asks for the difference: take the smaller away.",
            },
          ]),
          solution: [{ say: `${most} − ${least} = ${diff}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [intro, chart, `Max says ${value / p.key} ${topic.who} chose ${name}.`],
          truth: false,
          reasons: [
            {
              text: `False. He counted the symbols. Each is worth ${p.key}, so ${value} chose ${name}.`,
              correct: true,
            },
            { text: "True. Each symbol is one person.", code: "STA.KEY-IGNORED" },
            { text: "True. You count the symbols to read a pictogram.", code: "STA.KEY-IGNORED" },
          ],
          solution: [{ say: `${value / p.key} × ${p.key} = ${value}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.values[p.ask];
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.max(...p.values) - Math.min(...p.values);
    return true;
  },
});
