/**
 * @statement Y7-PRO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-PRO-01: Record, describe and analyse the frequency of outcomes of simple probability experiments
// involving randomness, fairness, equally and unequally likely outcomes, using appropriate language and
// the 0 to 1 probability scale
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  red: number;
  blue: number;
  /** Depth 2: P(a dice roll is less than k). */
  k: number;
  /** Depth 4: heads in 10 flips. */
  heads: number;
}

const WORDS = ["impossible", "unlikely", "even chance", "likely", "certain"] as const;
const wordFor = (p: number) =>
  p === 0
    ? "impossible"
    : p < 0.5
      ? "unlikely"
      : p === 0.5
        ? "even chance"
        : p < 1
          ? "likely"
          : "certain";
const scale = (p: number): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max: 1,
  step: 1,
  minor: 4,
  labels: [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
  ],
  points: [{ value: p, style: "arrow" }],
  description: "A probability scale from 0 to 1 with an arrow on it.",
});

export default defineGenerator<Params>({
  id: "Y7-PRO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["PRO.ODDS", "PRO.SCALE.WORDS", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng, numbers) {
    const red = rng.int(1, numbers === "friendly" ? 5 : 9);
    const blue = rng.int(1, numbers === "friendly" ? 5 : 9);
    if (red === blue) reject("unequal numbers");
    return { red, blue, k: rng.int(1, 7), heads: rng.int(6, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.red + p.blue;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A bag has ${p.red} red counter${p.red === 1 ? "" : "s"} and ${p.blue} blue counter${p.blue === 1 ? "" : "s"}. One counter is taken at random.`,
          ask: "What is the probability that it is red?",
          answer: A.exact(frac(p.red, total)),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(fracTex(p.red, p.blue)),
              feedback: `Probability compares red with all the counters: ${p.red} out of ${total}.`,
            },
          ],
          solution: [
            {
              say: `There are ${total} counters and ${p.red} are red, so P(red) = ${p.red}/${total}.`,
            },
          ],
        });
      case 2: {
        const prob = (p.k - 1) / 6;
        const word = wordFor(prob);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `A fair dice is rolled. The probability of getting a number less than ${p.k} is `,
            A.math(p.k - 1 === 0 ? "0" : p.k - 1 === 6 ? "1" : `\\frac{${p.k - 1}}{6}`),
            ".",
          ],
          ask: "Which word describes this probability?",
          correct: word,
          distractors: WORDS.filter((w) => w !== word)
            .slice(0, 3)
            .map((w) => ({
              content: w,
              code: "PRO.SCALE.WORDS",
              feedback: `${p.k - 1} out of 6 is ${word}: ${prob === 0 ? "it cannot happen" : prob === 1 ? "it must happen" : prob === 0.5 ? "exactly a half" : prob < 0.5 ? "less than a half" : "more than a half"}.`,
            })),
          solution: [{ say: `${p.k - 1} of the 6 numbers are less than ${p.k}: that is ${word}.` }],
        });
      }
      case 3: {
        const q = Number(frac(p.red, total).toNumber().toFixed(6));
        const near = (x: number) => Math.round(x * 4) / 4;
        const pos = near(q);
        if (pos === 0 || pos === 1 || (pos === 0.5 && total % 2 !== 0))
          return reject("an arrow position that matches");
        const other = 1 - pos === pos ? Math.min(1, pos + 0.25) : 1 - pos;
        return A.chooseTheDiagram({
          rng,
          question: [
            `A bag has ${p.red} red and ${p.blue} blue counters. Which arrow best shows the probability of taking a red counter?`,
          ],
          correct: scale(pos),
          distractors: [
            {
              figure: scale(other),
              code: "PRO.SCALE.WORDS",
              feedback: `That arrow is nearer the chance of blue. Red is ${p.red} out of ${total}, which is ${p.red > p.blue ? "more" : "less"} than a half.`,
            },
          ],
          solution: [
            {
              say: `P(red) = ${p.red}/${total} ≈ ${q.toFixed(2)}, so the arrow is at about ${pos}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A coin is flipped 10 times and lands on heads ${p.heads} times. Jo says the coin must be biased.`,
          truth: false,
          reasons: [
            {
              text: `False. In only 10 flips, ${p.heads} heads can easily happen by chance with a fair coin. Many more flips would be needed to judge.`,
              correct: true,
            },
            {
              text: "True. A fair coin must land on heads exactly 5 times out of 10.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            {
              text: "True. The next flip is now more likely to be tails, so it is unfair.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
          ],
          solution: [
            {
              say: `Relative frequency ${p.heads}/10 = ${p.heads / 10} is only an estimate. The more trials, the better the estimate.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(p.red, p.red + p.blue));
    if (question.archetype === "varied-form")
      return chosenText(question) === wordFor((p.k - 1) / 6);
    if (question.archetype === "choose-the-diagram") {
      const v = (chosenFigure(question) as NumberLineSpec | undefined)?.points?.[0]?.value ?? -1;
      return Math.abs(v - p.red / (p.red + p.blue)) <= 0.125 + 1e-9;
    }
    return true;
  },
});
