/**
 * @statement Y2-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-STA-01: Interpret and construct simple pictograms, tally charts, block diagrams and tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, tally } from "../shared/counting.ts";
import { barChart, distinctValues, pictogram, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  key: number;
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y2-STA-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["STA.KEY-IGNORED", "STA.SCALE.READ"],

  params(rng, numbers) {
    const key = numbers === "friendly" ? 1 : 2;
    const values = distinctValues(rng, 4, 1, numbers === "stretch" ? 10 : 6).map((v) => v * key);
    return { topic: rng.int(0, TOPICS.length - 1), values, key, ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const name = topic.categories[p.ask] ?? "";
    const value = p.values[p.ask] ?? 0;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `The pictogram shows the ${topic.what} of some ${topic.who}.`,
            A.figure(pictogram(topic, p.values, p.key)),
          ],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(value),
          wrong: wrongs(value, [
            p.key > 1
              ? {
                  code: "STA.KEY-IGNORED",
                  value: A.number(value / p.key),
                  feedback: `Each symbol stands for ${p.key}, so count in ${p.key}s.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: `There ${value / p.key === 1 ? "is 1 symbol" : `are ${value / p.key} symbols`}, and each stands for ${p.key}: ${value / p.key} × ${p.key} = ${value}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            `A tally chart records how many ${topic.who} chose ${name}.`,
            A.figure(tally(value, true)),
          ],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(value),
          wrong: wrongs(value, [
            value >= 5
              ? {
                  code: "STA.SCALE.READ",
                  value: A.number(Math.floor(value / 5) + (value % 5)),
                  feedback:
                    "Each gate of five tally marks (four lines and one across) stands for 5.",
                }
              : undefined,
          ]),
          solution: [
            {
              say: `Count the gates of 5, then the single marks: ${Math.floor(value / 5)} × 5 + ${value % 5} = ${value}.`,
            },
          ],
        });
      default: {
        const swapped = [...p.values];
        [swapped[0], swapped[1]] = [swapped[1] ?? 0, swapped[0] ?? 0];
        const step = Math.max(...p.values) > 10 ? 2 : 1;
        return A.chooseTheDiagram({
          rng,
          question: [
            "Which block diagram shows the data in this table?",
            A.displayMath(
              tableLatex(
                [topic.what.replace(/^favourite /, ""), topic.who],
                topic.categories.slice(0, 4).map((c, i) => [c, p.values[i] ?? 0]),
              ),
            ),
          ],
          correct: barChart(topic, p.values, step),
          distractors: [
            {
              figure: barChart(topic, swapped, step),
              feedback: `Check the first two: ${topic.categories[0]} is ${p.values[0]} and ${topic.categories[1]} is ${p.values[1]}.`,
            },
            {
              figure: barChart(
                topic,
                p.values.map((v) => v + (v === Math.max(...p.values) ? 0 : 1)),
                step,
              ),
              code: "STA.SCALE.READ",
              feedback: "Read each bar against the scale carefully.",
            },
          ],
          solution: [{ say: "Each block's height matches the number in the table." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") {
      const chart = chosenFigure(question) as { values?: number[] } | undefined;
      return JSON.stringify(chart?.values) === JSON.stringify(p.values);
    }
    return numberAnswer(question) === p.values[p.ask];
  },
});
