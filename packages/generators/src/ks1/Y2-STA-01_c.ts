/**
 * @statement Y2-STA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-STA-01.c: Interpret and construct block diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { barChart, distinctValues, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  step: number;
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y2-STA-01.c",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["STA.SCALE.READ", "AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const step = numbers === "friendly" ? 1 : 2;
    const values = distinctValues(rng, 4, 1, numbers === "stretch" ? 10 : 7).map((v) => v * step);
    return { topic: rng.int(0, TOPICS.length - 1), values, step, ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const chart = A.figure(barChart(topic, p.values, p.step));
    const intro = `The block diagram shows the ${topic.what} of some ${topic.who}.`;
    switch (depth) {
      case 1: {
        const value = p.values[p.ask] ?? 0;
        const name = topic.categories[p.ask] ?? "";
        return A.standard({
          question: [intro, chart],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(value),
          wrong: wrongs(value, [
            p.step > 1
              ? {
                  code: "STA.SCALE.READ",
                  value: A.number(value / p.step),
                  feedback: `The scale goes up in ${p.step}s. Read the number level with the top of the bar.`,
                }
              : undefined,
          ]),
          solution: [{ say: `The ${name} bar reaches ${value}.` }],
        });
      }
      case 2: {
        const most = Math.max(...p.values);
        const least = Math.min(...p.values);
        const big = topic.categories[p.values.indexOf(most)] ?? "";
        const small = topic.categories[p.values.indexOf(least)] ?? "";
        return A.standard({
          question: [intro, chart],
          ask: `How many more ${topic.who} chose ${big} than ${small}?`,
          answer: A.number(most - least),
          wrong: wrongs(most - least, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(most + least),
              feedback: "How many more asks for the difference between the two bars.",
            },
          ]),
          solution: [{ say: `${most} − ${least} = ${most - least}.` }],
        });
      }
      default: {
        const swapped = [...p.values];
        [swapped[0], swapped[1]] = [swapped[1] ?? 0, swapped[0] ?? 0];
        const bumped = p.values.map((v, i) => (i === 2 ? v + p.step : v));
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
          correct: barChart(topic, p.values, p.step),
          distractors: [
            {
              figure: barChart(topic, swapped, p.step),
              feedback: `Check the first two: ${topic.categories[0]} is ${p.values[0]} and ${topic.categories[1]} is ${p.values[1]}.`,
            },
            {
              figure: barChart(topic, bumped, p.step),
              feedback: `Check ${topic.categories[2]}: it should be ${p.values[2]}.`,
            },
          ],
          solution: [{ say: "Each bar should reach the number in the table." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.values[p.ask];
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.max(...p.values) - Math.min(...p.values);
    return (
      ((chosenFigure(question) as { values?: number[] } | undefined)?.values ?? []).join() ===
      p.values.join()
    );
  },
});
