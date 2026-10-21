/**
 * @statement Y2-STA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-STA-03: Ask and answer questions about totalling and comparing categorical data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctValues, tableLatex, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y2-STA-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const values = distinctValues(rng, 4, 2, numbers === "friendly" ? 10 : 20);
    const [a, b] = rng.shuffle([0, 1, 2, 3]);
    return { topic: rng.int(0, TOPICS.length - 1), values, a: a ?? 0, b: b ?? 1 };
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
    const [va, vb] = [p.values[p.a] ?? 0, p.values[p.b] ?? 0];
    const [big, small] = va > vb ? [p.a, p.b] : [p.b, p.a];
    const diff = Math.abs(va - vb);
    switch (depth) {
      case 1: {
        const total = p.values.reduce((s, v) => s + v, 0);
        return A.standard({
          question: [intro, table],
          ask: `How many ${topic.who} are there altogether?`,
          answer: A.number(total),
          solution: [{ say: `${p.values.join(" + ")} = ${total}.` }],
        });
      }
      case 2:
        return A.standard({
          question: [intro, table],
          ask: `How many more ${topic.who} chose ${cats[big]} than ${cats[small]}?`,
          answer: A.number(diff),
          wrong: wrongs(diff, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(va + vb),
              feedback: `"How many more" asks for the difference: ${Math.max(va, vb)} − ${Math.min(va, vb)}.`,
            },
          ]),
          solution: [
            {
              say: `${cats[big]} ${Math.max(va, vb)}, ${cats[small]} ${Math.min(va, vb)}: ${Math.max(va, vb)} − ${Math.min(va, vb)} = ${diff}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            table,
            ` Mo says ${diff} more ${topic.who} chose ${cats[small]} than ${cats[big]}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${cats[big]} has ${Math.max(va, vb)} and ${cats[small]} has ${Math.min(va, vb)}, so it is ${cats[big]} that has ${diff} more.`,
              correct: true,
            },
            {
              text: "True. The difference is the same whichever way round you say it.",
              code: "AS.PROBLEM.KEYWORD",
            },
            { text: "True. It comes first in the question." },
          ],
          solution: [
            {
              say: `${Math.max(va, vb)} − ${Math.min(va, vb)} = ${diff}, and ${cats[big]} is the bigger.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === p.values.reduce((s, v) => s + v, 0)
      : numberAnswer(question) === Math.abs((p.values[p.a] ?? 0) - (p.values[p.b] ?? 0));
  },
});
