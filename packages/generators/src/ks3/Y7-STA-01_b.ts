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
import { orClaims } from "../shared/variety.ts";

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
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Zara says a set of data can have more than one mode."],
              truth: true,
              reasons: [
                {
                  text: "True. If two values are equally the most common, both are modes, e.g. 2, 2, 5, 7, 7.",
                  correct: true,
                },
                {
                  text: "False. The mode is always the middle value.",
                  code: "STA.MEDIAN.UNORDERED",
                },
                {
                  text: "False. The mode is how many times the most common value appears.",
                  code: "STA.MODE.FREQUENCY",
                },
              ],
              solution: [{ say: "Data with two modes is called bimodal." }],
            }),
          [
            {
              statement: "Lee says the median of 7, 2, 9, 4, 5 is 9, the number in the middle.",
              truth: false,
              right: "False. Put them in order first: 2, 4, 5, 7, 9. The median is 5.",
              wrong: [
                ["True. The median is the middle number as it is written.", "STA.MEDIAN.UNORDERED"],
                ["True. The median is the biggest value."],
              ],
            },
            {
              statement: "Max says the mode of 4, 6, 6, 6, 9 is 3, because the 6 appears 3 times.",
              truth: false,
              right:
                "False. The mode is the value that appears most often, 6. The 3 is how often it appears.",
              wrong: [
                [
                  "True. The mode is how many times the most common value appears.",
                  "STA.MODE.FREQUENCY",
                ],
                ["True. Count the most common value to find the mode.", "STA.MODE.FREQUENCY"],
              ],
            },
            {
              claim: "The median of a set of data is one of the data values.",
              truth: "sometimes",
              right:
                "Sometimes. The median of 1, 4, 9 is 4, but the median of 1, 4, 6, 9 is 5, halfway between 4 and 6.",
              wrong: [
                ["Always. The median is the middle value of the list."],
                ["Never. The median is always worked out with a sum."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.mode;
    if (question.key.depth === 2) return numberAnswer(question) === median(p.list);
    return true;
  },
});
