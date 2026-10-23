/**
 * @statement Y1-NPV-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-02.a: Count, read and write numbers to 100 in numerals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer, numberWords } from "../shared/counting.ts";

interface Params {
  n: number;
}

const reverse = (n: number) => (n % 10) * 10 + Math.floor(n / 10);
const cap = (s: string) => `${s[0]?.toUpperCase()}${s.slice(1)}`;

export default defineGenerator<Params>({
  id: "Y1-NPV-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.PLACE.DIGIT-ORDER", "NPV.TEENS.REVERSAL", "NPV.PLACE.WRITE-AS-SAID"],

  params(rng, numbers) {
    const n =
      numbers === "friendly" ? rng.int(13, 19) : rng.int(numbers === "standard" ? 21 : 13, 99);
    if (n % 10 === 0 || reverse(n) === n) reject("digits that can be swapped");
    return { n };
  },

  build(p, depth, rng): QuestionDraft {
    const words = numberWords(p.n);
    const teen = p.n < 20;
    const swap = {
      code: teen ? "NPV.TEENS.REVERSAL" : "NPV.PLACE.DIGIT-ORDER",
      feedback: teen
        ? `We say the ${numberWords(p.n % 10)} first, but write the 1 ten first: ${p.n}.`
        : `${cap(numberWords(Math.floor(p.n / 10) * 10))} is the tens, so its digit comes first: ${p.n}.`,
    };
    switch (depth) {
      case 1:
        return A.standard({
          question: `Write ${words} in numerals.`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            { ...swap, value: A.number(reverse(p.n)) },
            ...(teen
              ? []
              : [
                  {
                    code: "NPV.PLACE.WRITE-AS-SAID",
                    value: A.number(Math.floor(p.n / 10) * 100 + (p.n % 10)),
                    feedback: `${cap(numberWords(Math.floor(p.n / 10) * 10))} is ${Math.floor(p.n / 10)} tens, so write one digit for it, not ${Math.floor(p.n / 10) * 10}.`,
                  },
                ]),
          ]),
          solution: [
            {
              say: `${cap(words)} is ${Math.floor(p.n / 10)} ten${p.n >= 20 ? "s" : ""} and ${p.n % 10} ones: ${p.n}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [A.math(String(p.n))],
          ask: "How do you say this number?",
          correct: cap(words),
          distractors: [
            { content: cap(numberWords(reverse(p.n))), ...swap },
            ...(p.n + 10 < 100
              ? [
                  {
                    content: cap(numberWords(p.n + 10)),
                    feedback: `Check the tens digit: it is ${Math.floor(p.n / 10)}.`,
                  },
                ]
              : []),
            ...(p.n - 10 > 10
              ? [
                  {
                    content: cap(numberWords(p.n - 10)),
                    feedback: `Check the tens digit: it is ${Math.floor(p.n / 10)}.`,
                  },
                ]
              : []),
          ],
          solution: [{ say: `${p.n} is ${words}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Leo writes ${words} as ${reverse(p.n)}.`,
          truth: false,
          reasons: [
            { text: `False. The tens digit comes first, so ${words} is ${p.n}.`, correct: true },
            { text: "True. You write the digits in the order you hear them.", code: swap.code },
            { text: `True. ${reverse(p.n)} and ${p.n} are the same number.`, code: swap.code },
          ],
          solution: [
            {
              say: `${cap(words)}: ${Math.floor(p.n / 10)} in the tens place and ${p.n % 10} in the ones place, ${p.n}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 2) return chosenText(question) === cap(numberWords(p.n));
    return true;
  },
});
