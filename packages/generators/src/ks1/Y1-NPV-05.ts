/**
 * @statement Y1-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-NPV-05: Read and write numbers from 1 to 20 in numerals and words
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberWords } from "../shared/counting.ts";

interface Params {
  n: number;
  set: number[];
}

/** Teen numbers sound like their ones digit: 14 can be mistaken for 40 or 41. */
const confusions = (n: number): { value: number; word: string; code?: string }[] => {
  const ones = n % 10;
  const out: { value: number; word: string; code?: string }[] = [];
  if (n > 12 && n < 20)
    out.push({ value: ones * 10, word: numberWords(ones * 10), code: "NPV.TEENS.REVERSAL" });
  if (n > 12 && n < 20)
    out.push({
      value: ones * 10 + 1,
      word: numberWords(ones * 10 + 1),
      code: "NPV.TEENS.REVERSAL",
    });
  for (const v of [n + 1, n - 1, ones || 2])
    if (v > 0 && v !== n && !out.some((o) => o.value === v))
      out.push({ value: v, word: numberWords(v) });
  return out.slice(0, 3);
};

export default defineGenerator<Params>({
  id: "Y1-NPV-05",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.TEENS.REVERSAL"],

  params(rng, numbers) {
    const pool =
      numbers === "friendly"
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        : numbers === "standard"
          ? [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
          : [13, 14, 15, 16, 17, 18, 19, 20];
    return { n: rng.pick(pool), set: rng.sample(pool, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const feedback =
      "In teen numbers you hear the ones first, but the numeral starts with 1 for one ten.";
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Read the word: ${numberWords(p.n)}.`,
          ask: "Which numeral is it?",
          correct: A.math(String(p.n)),
          distractors: confusions(p.n).map((c) => ({
            content: A.math(String(c.value)),
            ...(c.code ? { code: c.code, feedback } : {}),
          })),
          solution: [{ say: `${numberWords(p.n)} is ${p.n}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "reverse",
          question: ["Here is a number: ", A.math(String(p.n)), "."],
          ask: "How do you write it in words?",
          correct: numberWords(p.n),
          distractors: confusions(p.n).map((c) => ({
            content: c.word,
            ...(c.code ? { code: c.code, feedback } : {}),
          })),
          solution: [{ say: `${p.n} is written ${numberWords(p.n)}.` }],
        });
      default:
        return A.matchRepresentations({
          rng,
          question: "Match each number to its word.",
          pairs: p.set.map(
            (m) => [A.math(String(m)), numberWords(m)] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: p.set.map((m) => `${m} is ${numberWords(m)}`).join("; ") + "." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === String(p.n);
    if (question.archetype === "reverse") return chosenText(question) === numberWords(p.n);
    return new Set(p.set.map(numberWords)).size === 3;
  },
});
