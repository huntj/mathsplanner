/**
 * @statement Y4-STA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-STA-01.a: Interpret and present bar charts for discrete data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { barChart, distinctValues, TOPICS } from "../shared/sta.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  topic: number;
  values: number[];
  step: number;
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y4-STA-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ", "AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const step = rng.pick(
      numbers === "friendly" ? [2] : numbers === "standard" ? [2, 5, 10] : [5, 10],
    );
    const values = distinctValues(rng, 4, 1, 9).map((v) => v * step);
    return { topic: rng.int(0, TOPICS.length - 1), values, step, ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const chart = A.figure(barChart(topic, p.values, p.step));
    const intro = `The bar chart shows the ${topic.what} of some ${topic.who}.`;
    const value = p.values[p.ask] ?? 0;
    const name = topic.categories[p.ask] ?? "";
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro, chart],
          ask: `How many ${topic.who} chose ${name}?`,
          answer: A.number(value),
          wrong: wrongs(value, [
            {
              code: "STA.SCALE.READ",
              value: A.number(value / p.step),
              feedback: `The scale goes up in ${p.step}s, not 1s.`,
            },
          ]),
          solution: [
            {
              say: `Each grid line is ${p.step} more than the last. The ${name} bar reaches ${value}.`,
            },
          ],
        });
      case 2: {
        const most = Math.max(...p.values);
        const least = Math.min(...p.values);
        const total = p.values.reduce((s, v) => s + v, 0);
        return A.standard({
          question: [intro, chart],
          ask: `How many ${topic.who} did not choose ${topic.categories[p.values.indexOf(most)]}?`,
          answer: A.number(total - most),
          wrong: wrongs(total - most, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(most - least),
              feedback: "Add up the other three bars.",
            },
          ]),
          solution: [{ say: `${total} altogether, take away ${most}: ${total - most}.` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                intro,
                chart,
                `Ravi counts the grid lines up to the top of the ${name} bar in ones and says ${value / p.step} chose ${name}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The scale goes up in ${p.step}s, so the bar shows ${value}.`,
                  correct: true,
                },
                { text: "True. Each grid line is worth 1.", code: "STA.SCALE.READ" },
                {
                  text: "True. You always count the squares on a bar chart.",
                  code: "STA.SCALE.READ",
                },
              ],
              solution: [{ say: "Read the numbers on the scale, not the number of grid lines." }],
            }),
          [
            {
              statement:
                "On a bar chart the scale goes up in 2s. A bar reaches 8. Ben says 8 children chose it.",
              truth: true,
              right: "True. Read the number on the scale at the top of the bar.",
              wrong: [["False. Count the lines: 4.", "STA.SCALE.READ"], ["False. Double it: 16."]],
            },
            {
              claim: "The tallest bar on a bar chart shows the most popular choice.",
              truth: "always",
              right: "Always. The taller the bar, the more there are.",
              wrong: [
                ["Sometimes. The widest bar shows it.", "STA.SCALE.READ"],
                ["Never. The shortest bar does."],
              ],
            },
            {
              statement:
                "On a bar chart, apples is 12 and pears is 8. Kim says 4 more chose pears than apples.",
              truth: false,
              right: "False. 4 more chose apples: 12 − 8 = 4, and apples has the taller bar.",
              wrong: [
                ["True. 'More' means the second one.", "AS.PROBLEM.KEYWORD"],
                ["True. The difference is 4."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.values[p.ask];
    if (question.key.depth === 2)
      return numberAnswer(question) === p.values.reduce((s, v) => s + v, 0) - Math.max(...p.values);
    return true;
  },
});
