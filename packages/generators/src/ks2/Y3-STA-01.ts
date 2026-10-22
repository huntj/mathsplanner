/**
 * @statement Y3-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-STA-01: Interpret and present data using bar charts, pictograms and tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { barChart, distinctValues, pictogram, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  /** Bar chart values, multiples of step. */
  values: number[];
  step: number;
  /** Pictogram key and values (whole or half symbols). */
  key: number;
  pict: number[];
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y3-STA-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["STA.SCALE.READ", "STA.KEY-IGNORED"],

  params(rng, numbers) {
    const step = rng.pick(numbers === "friendly" ? [2] : [2, 5, 10]);
    const key = rng.pick(numbers === "friendly" ? [2] : [2, 4, 10]);
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 1, 9).map((v) => v * step),
      step,
      key,
      pict: distinctValues(rng, 4, 2, 12).map((h) => (h * key) / 2),
      ask: rng.int(0, 3),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const name = topic.categories[p.ask] ?? "";
    switch (depth) {
      case 1: {
        const v = p.values[p.ask] ?? 0;
        return A.standard({
          question: [
            `The bar chart shows the ${topic.what} of some ${topic.who}.`,
            A.figure(barChart(topic, p.values, p.step)),
          ],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / p.step),
              feedback: `The scale goes up in ${p.step}s, so each line is worth ${p.step}.`,
            },
          ]),
          solution: [{ say: `Go across from the top of the ${name} bar to the scale: ${v}.` }],
        });
      }
      case 2: {
        const v = p.pict[p.ask] ?? 0;
        return A.standard({
          question: [
            `The pictogram shows the ${topic.what} of some ${topic.who}.`,
            A.figure(pictogram(topic, p.pict, p.key)),
          ],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.KEY-IGNORED",
              value: A.number(Math.ceil(v / p.key)),
              feedback: `Each whole symbol stands for ${p.key}, and half a symbol for ${p.key / 2}.`,
            },
          ]),
          solution: [
            {
              say: `${Math.floor(v / p.key)} whole symbol${Math.floor(v / p.key) === 1 ? "" : "s"}${v % p.key ? " and a half" : ""}: ${Math.floor(v / p.key)} × ${p.key}${v % p.key ? ` + ${p.key / 2}` : ""} = ${v}.`,
            },
          ],
        });
      }
      default: {
        const wrongScale = p.values.map((v) => v / p.step);
        return A.chooseTheDiagram({
          rng,
          question: [
            "Which bar chart shows the data in this table?",
            A.displayMath(
              tableLatex(
                [topic.what.replace(/^favourite /, ""), topic.who],
                topic.categories.slice(0, 4).map((c, i) => [c, p.values[i] ?? 0]),
              ),
            ),
          ],
          correct: barChart(topic, p.values, p.step),
          distractors: [
            {
              figure: barChart(topic, wrongScale, 1),
              code: "STA.SCALE.READ",
              feedback: `Those bars use the numbers ÷ ${p.step}, on a scale going up in 1s.`,
            },
            {
              figure: barChart(topic, [...p.values].reverse(), p.step),
              feedback: "The bars are in the wrong order for the table.",
            },
          ],
          solution: [{ say: "Each bar's height matches the table, read against the scale." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram")
      return (
        JSON.stringify((chosenFigure(question) as { values?: number[] } | undefined)?.values) ===
        JSON.stringify(p.values)
      );
    return numberAnswer(question) === (question.key.depth === 1 ? p.values[p.ask] : p.pict[p.ask]);
  },
});
