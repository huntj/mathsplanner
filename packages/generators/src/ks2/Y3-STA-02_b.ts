/**
 * @statement Y3-STA-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-STA-02.b: Answer two-step questions from charts and tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import { barChart, distinctValues, TOPICS } from "../shared/sta.ts";
import parent from "./Y3-STA-02.ts";

interface Params {
  topic: number;
  values: number[];
  step: number;
  /** The two categories left out of the count. */
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-STA-02.b",
  version: "1.0.0",
  depths: [2],
  misconceptions: ["AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const step = rng.pick(numbers === "friendly" ? [1, 2] : [2, 5]);
    const [a, b] = rng.sample([0, 1, 2, 3], 2);
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 1, 9).map((v) => v * step),
      step,
      a: a ?? 0,
      b: b ?? 1,
    };
  },

  build(p): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const total = p.values.reduce((s, v) => s + v, 0);
    const [va, vb] = [p.values[p.a] ?? 0, p.values[p.b] ?? 0];
    const answer = total - va - vb;
    return A.standard({
      question: [
        `The bar chart shows the ${topic.what} of some ${topic.who}.`,
        A.figure(barChart(topic, p.values, p.step)),
      ],
      ask: `How many ${topic.who} did not choose ${topic.categories[p.a]} or ${topic.categories[p.b]}?`,
      answer: A.number(answer),
      wrong: wrongs(answer, [
        {
          code: "AS.MULTISTEP.ONE-STEP",
          value: A.number(total - va),
          feedback: `Take away the ${topic.categories[p.b]} ${topic.who} as well.`,
        },
      ]),
      solution: [
        {
          say: `Altogether ${total}. Take away ${va} and ${vb}: ${total} − ${va + vb} = ${answer}.`,
        },
      ],
    });
  },

  verify(p, question) {
    const total = p.values.reduce((s, v) => s + v, 0);
    return numberAnswer(question) === total - (p.values[p.a] ?? 0) - (p.values[p.b] ?? 0);
  },
};

export default defineGenerator(
  mixFamilies("Y3-STA-02.b", { 2: own, 5: { ...parent.definition, id: "Y3-STA-02.b" } }),
);
