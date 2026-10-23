/**
 * @statement Y2-STA-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-STA-01.d: Interpret and construct simple tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctValues, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y2-STA-01.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const values = distinctValues(rng, 4, 2, numbers === "friendly" ? 10 : 20);
    // The first row is not the biggest, so "top of the table" is not the most popular.
    if ((values[0] ?? 0) === Math.max(...values)) reject("first row not the most");
    return { topic: rng.int(0, TOPICS.length - 1), values, ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const cats = topic.categories.slice(0, 4);
    const table = A.displayMath(
      tableLatex(
        [topic.what.replace(/^favourite /, ""), topic.who],
        cats.map((c, i) => [c, p.values[i] ?? 0]),
      ),
    );
    const intro = `The table shows the ${topic.what} of some ${topic.who}.`;
    const total = p.values.reduce((s, v) => s + v, 0);
    switch (depth) {
      case 1: {
        const others = p.values.filter((_, i) => i !== p.ask);
        const sum = others.reduce((s, v) => s + v, 0);
        return A.standard({
          question: [intro, table],
          ask: `How many ${topic.who} did not choose ${cats[p.ask]}?`,
          answer: A.number(sum),
          wrong: wrongs(sum, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.values[p.ask] ?? 0),
              feedback: `That is how many did choose ${cats[p.ask]}. Add up all the others.`,
            },
          ]),
          solution: [{ say: `${others.join(" + ")} = ${sum}.` }],
        });
      }
      case 2:
        return A.standard({
          question: [intro, table],
          ask: `How many ${topic.who} are there altogether?`,
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(Math.max(...p.values)),
              feedback: "Altogether means add up every row.",
            },
          ]),
          solution: [{ say: `${p.values.join(" + ")} = ${total}.` }],
        });
      default: {
        const top = cats[p.values.indexOf(Math.max(...p.values))] ?? "";
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            table,
            `Kai says ${cats[0]} is the most popular, because it is at the top of the table.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The order of the rows does not matter. ${top} has the biggest number.`,
              correct: true,
            },
            { text: "True. Tables always put the most popular first." },
            { text: `True. ${cats[0]} has the most letters.` },
          ],
          solution: [{ say: `Compare the numbers: ${top} has ${Math.max(...p.values)}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const total = p.values.reduce((s, v) => s + v, 0);
    if (question.key.depth === 1) return numberAnswer(question) === total - (p.values[p.ask] ?? 0);
    if (question.key.depth === 2) return numberAnswer(question) === total;
    return true;
  },
});
