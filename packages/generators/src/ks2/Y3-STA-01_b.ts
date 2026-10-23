/**
 * @statement Y3-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-STA-01.b: Interpret and present pictograms
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import { distinctValues, pictogram, TOPICS } from "../shared/sta.ts";
import parent from "./Y3-STA-01.ts";

interface Params {
  topic: number;
  key: number;
  /** Half-symbol counts for each category. */
  halves: number[];
  ask: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-STA-01.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["STA.KEY-IGNORED"],

  params(rng, numbers) {
    const halves = distinctValues(rng, 4, 2, 12);
    const ask = rng.int(0, 3);
    // The asked-about row ends in half a symbol.
    if ((halves[ask] ?? 0) % 2 === 0) reject("a half symbol to read");
    return {
      topic: rng.int(0, TOPICS.length - 1),
      key: rng.pick(numbers === "friendly" ? [4] : [4, 10]),
      halves,
      ask,
    };
  },

  build(p, _depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const values = p.halves.map((h) => (h * p.key) / 2);
    const v = values[p.ask] ?? 0;
    const name = topic.categories[p.ask] ?? "";
    const whole = Math.floor((p.halves[p.ask] ?? 0) / 2);
    const said = whole * p.key + 1;
    return A.trueOrFalseWhy({
      rng,
      statement: [
        `The pictogram shows the ${topic.what} of some ${topic.who}. Each symbol stands for ${p.key}.`,
        A.figure(pictogram(topic, values, p.key)),
        `Eve says ${said} ${topic.who} chose ${name}, because half a symbol is 1.`,
      ],
      truth: false,
      reasons: [
        {
          text: `False. Half a symbol is half of ${p.key}, which is ${p.key / 2}. So ${v} chose ${name}.`,
          correct: true,
        },
        { text: "True. A part of a symbol always counts as 1.", code: "STA.KEY-IGNORED" },
        { text: "True. You count the symbols and add 1 for any part.", code: "STA.KEY-IGNORED" },
      ],
      solution: [
        {
          say: `${whole} whole symbols make ${whole * p.key}, and half a symbol is ${p.key / 2}: ${v}.`,
        },
      ],
    });
  },
};

export default defineGenerator(
  mixFamilies("Y3-STA-01.b", { 2: { ...parent.definition, id: "Y3-STA-01.b" }, 4: own }),
);
