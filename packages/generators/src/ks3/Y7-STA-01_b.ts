/**
 * @statement Y7-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-STA-01.b: Find the median and mode
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  mode: number;
  others: number[];
  list: number[];
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return ((s[s.length / 2 - 1] ?? 0) + (s[s.length / 2] ?? 0)) / 2;
};

export default defineGenerator<Params>({
  id: "Y7-STA-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MODE.FREQUENCY", "STA.MEDIAN.UNORDERED"],

  params(rng) {
    const mode = rng.int(4, 12);
    const others = [rng.int(1, 15), rng.int(1, 15), rng.int(1, 15), rng.int(1, 15)];
    const list = Array.from({ length: 6 }, () => rng.int(2, 30));
    const p = { mode, others, list };
    if (new Set([mode, ...others]).size < 5) reject("one clear mode");
    const unordered = ((list[2] ?? 0) + (list[3] ?? 0)) / 2;
    if (unordered === median(list) || new Set(list).size < 6)
      reject("an unordered middle that differs from the median");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const data = [p.others[0], p.mode, p.others[1], p.mode, p.others[2], p.mode, p.others[3]];
        return A.standard({
          question: [`Here are the shoe sizes of seven people: ${data.join(", ")}.`],
          ask: "What is the mode?",
          answer: A.number(p.mode),
          wrong: wrongs(p.mode, [
            {
              code: "STA.MODE.FREQUENCY",
              value: A.number(3),
              feedback: `${p.mode} appears 3 times. The mode is the value, ${p.mode}, not how often it appears.`,
            },
          ]),
          solution: [{ say: `${p.mode} appears most often.` }],
        });
      }
      case 2: {
        const v = median(p.list);
        return A.variedForm({
          rng,
          forms: [{ question: [`Find the median of ${p.list.join(", ")}.`] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number(((p.list[2] ?? 0) + (p.list[3] ?? 0)) / 2),
              feedback: "Put the numbers in order first.",
            },
          ]),
          solution: [
            {
              say: "In order: ",
              math: `${[...p.list].sort((a, b) => a - b).join(", ")} \\Rightarrow ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Zara says a set of data can have more than one mode."],
          truth: true,
          reasons: [
            {
              text: "True. If two values are equally the most common, both are modes, e.g. 2, 2, 5, 7, 7.",
              correct: true,
            },
            { text: "False. The mode is always the middle value.", code: "STA.MEDIAN.UNORDERED" },
            {
              text: "False. The mode is how many times the most common value appears.",
              code: "STA.MODE.FREQUENCY",
            },
          ],
          solution: [{ say: "Data with two modes is called bimodal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.mode;
    if (question.key.depth === 2) return numberAnswer(question) === median(p.list);
    return true;
  },
});
