/**
 * @statement Y3-STA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-STA-01.c: Interpret and present tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { distinctValues, tableLatex, TOPICS } from "../shared/sta.ts";
import parent from "./Y3-STA-01.ts";

interface Params {
  topic: number;
  values: number[];
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-STA-01.c",
  version: "1.0.0",
  depths: [1, 2],
  misconceptions: ["AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 5, numbers === "friendly" ? 30 : 60),
    };
  },

  build(p, depth): QuestionDraft {
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
    const most = Math.max(...p.values);
    const least = Math.min(...p.values);
    if (depth === 1) {
      return A.standard({
        question: [intro, table],
        ask: `How many more ${topic.who} chose ${cats[p.values.indexOf(most)]} than ${cats[p.values.indexOf(least)]}?`,
        answer: A.number(most - least),
        wrong: wrongs(most - least, [
          {
            code: "AS.PROBLEM.KEYWORD",
            value: A.number(most + least),
            feedback: "How many more asks for the difference: subtract.",
          },
        ]),
        solution: [{ say: `${most} − ${least} = ${most - least}.` }],
      });
    }
    const total = p.values.reduce((s, v) => s + v, 0);
    return A.standard({
      question: [intro, table],
      ask: `How many ${topic.who} are in the table altogether?`,
      answer: A.number(total),
      wrong: wrongs(total, [
        {
          code: "AS.PROBLEM.KEYWORD",
          value: A.number(most),
          feedback: "Altogether means add up every row.",
        },
      ]),
      solution: [{ say: `${p.values.join(" + ")} = ${total}.` }],
    });
  },

  verify(p, question) {
    const total = p.values.reduce((s, v) => s + v, 0);
    return (
      numberAnswer(question) ===
      (question.key.depth === 1 ? Math.max(...p.values) - Math.min(...p.values) : total)
    );
  },
};

export default defineGenerator(
  mixFamilies("Y3-STA-01.c", { 1: own, 2: own, 3: { ...parent.definition, id: "Y3-STA-01.c" } }),
);
