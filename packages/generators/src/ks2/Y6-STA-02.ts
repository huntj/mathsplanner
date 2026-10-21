/**
 * @statement Y6-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-STA-02: Calculate and interpret the mean as an average
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  values: number[];
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y6-STA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MEAN.DIVISOR"],

  params(rng, numbers) {
    const n = rng.int(4, numbers === "stretch" ? 8 : 6);
    const values = Array.from({ length: n }, () => rng.int(0, numbers === "friendly" ? 10 : 30));
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum % n !== 0 || new Set(values).size < 3) reject("a whole-number mean from varied data");
    // Half the time include a zero, which is easy to leave out.
    if (rng.bool() && !values.includes(0)) values[rng.int(0, n - 1)] = 0;
    if (values.reduce((a, b) => a + b, 0) % n !== 0) reject("still a whole-number mean");
    return { values, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.values.length;
    const sum = p.values.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const zeros = p.values.filter((v) => v === 0).length;
    const how = `Add them: ${p.values.join(" + ")} = ${sum}. There are ${n} values, so the mean is ${sum} ÷ ${n} = ${mean}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the mean of these numbers: ", A.math(p.values.join(",\\ ")), "."],
          answer: A.number(mean),
          wrong: wrongs(mean, [
            zeros > 0 && sum % (n - zeros) === 0
              ? {
                  code: "STA.MEAN.DIVISOR",
                  value: A.number(sum / (n - zeros)),
                  feedback: `0 is a value too: divide by all ${n} values.`,
                }
              : undefined,
          ]),
          solution: [{ say: how }],
        });
      case 2: {
        const known = p.values.slice(0, -1);
        const last = p.values.at(-1) ?? 0;
        return A.reverse({
          question: [
            `The mean of ${n} numbers is ${mean}. ${n - 1} of them are `,
            A.math(known.join(",\\ ")),
            ".",
          ],
          ask: "What is the other number?",
          answer: A.number(last),
          wrong: wrongs(last, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(mean * (n - 1) - known.reduce((a, b) => a + b, 0)),
              feedback: `The total of all ${n} numbers is ${n} × ${mean} = ${sum}.`,
            },
          ]),
          solution: [
            {
              say: `The total is ${n} × ${mean} = ${sum}. The others add to ${sum - last}, so the last is ${sum} − ${sum - last} = ${last}.`,
            },
          ],
        });
      }
      default:
        return p.claim === 0
          ? A.alwaysSometimesNever({
              rng,
              claim: "The mean of a set of numbers is one of the numbers in the set.",
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. The mean of 2, 4 and 6 is 4, which is in the set, but the mean of 1 and 2 is 1.5, which is not.`,
                  correct: true,
                },
                { text: "Always. The mean is the middle number.", code: "STA.MEAN.DIVISOR" },
                { text: "Never. The mean is always a decimal." },
              ],
              solution: [
                {
                  say: `Here the mean is ${mean}${p.values.includes(mean) ? ", which is in the set" : ", which is not in the set"}.`,
                },
              ],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: [
                "Ben finds the mean of ",
                A.math(p.values.join(",\\ ")),
                ` by adding them and dividing by ${n + 1}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Divide by how many numbers there are: ${n}. ${how}`,
                  correct: true,
                },
                {
                  text: "True. You divide by one more than the number of values.",
                  code: "STA.MEAN.DIVISOR",
                },
                { text: "True. Any number will do, as long as you add first." },
              ],
              solution: [{ say: how }],
            });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) * p.values.length === p.values.reduce((a, b) => a + b, 0);
    if (question.archetype === "reverse") return numberAnswer(question) === p.values.at(-1);
    return true;
  },
});
