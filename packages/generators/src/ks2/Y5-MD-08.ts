/**
 * @statement Y5-MD-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-08: Recognise and use square numbers and cube numbers, and the notation ² and ³
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { isPrime } from "../shared/md.ts";

export interface Params {
  n: number;
  power: 2 | 3;
  /** Depth 2: a square number to find among non-squares. */
  square: number;
  claim: number;
}

const isSquare = (k: number) => Number.isInteger(Math.sqrt(k));

export default defineGenerator<Params>({
  id: "Y5-MD-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SQUARE.DOUBLES"],

  params(rng, numbers) {
    const power = numbers === "friendly" ? 2 : rng.pick([2, 3] as const);
    const n =
      power === 2
        ? rng.int(3, numbers === "stretch" ? 15 : 12)
        : rng.int(2, numbers === "stretch" ? 10 : 5);
    const root = rng.int(3, 12);
    if (power === 3 && n === 1) reject("a cube bigger than 1");
    return { n, power, square: root * root, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const answer = p.n ** p.power;
    const name = p.power === 2 ? "squared" : "cubed";
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${p.n}^{${p.power}}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "MD.SQUARE.DOUBLES",
              value: A.number(p.n * p.power),
              feedback: `${p.n} ${name} means ${p.power} lots of ${p.n} multiplied together, not ${p.n} × ${p.power}.`,
            },
          ]),
          solution: [
            { say: `${Array.from({ length: p.power }, () => p.n).join(" × ")} = ${answer}.` },
          ],
        });
      case 2: {
        const root = Math.sqrt(p.square);
        const doubled = root * 2;
        const others = [doubled, p.square + 1, p.square - 2].filter((k) => !isSquare(k) && k > 1);
        const prime = [p.square + 2, p.square + 4, p.square + 6, p.square - 4].find(
          (k) => isPrime(k) && !others.includes(k),
        );
        const distractors = [...new Set([...others, ...(prime ? [prime] : [])])].slice(0, 3);
        if (distractors.length < 3) return reject("three non-squares");
        return A.choice({
          rng,
          archetype: "varied-form",
          question: "Which of these is a square number?",
          correct: String(p.square),
          distractors: distractors.map((k) => ({
            content: String(k),
            ...(k === doubled
              ? {
                  code: "MD.SQUARE.DOUBLES",
                  feedback: `${k} is ${root} × 2, not ${root} × ${root}.`,
                }
              : { feedback: `No whole number multiplied by itself makes ${k}.` }),
          })),
          solution: [
            { say: `${root} × ${root} = ${p.square}, so ${p.square} is a square number.` },
          ],
        });
      }
      default:
        if (p.claim === 0)
          return A.alwaysSometimesNever({
            rng,
            claim: "A square number is even.",
            truth: "sometimes",
            reasons: [
              {
                text: "Sometimes. 4 = 2² is even, but 9 = 3² is odd. An even number squared is even; an odd number squared is odd.",
                correct: true,
              },
              { text: "Always. Squaring means multiplying by 2.", code: "MD.SQUARE.DOUBLES" },
              { text: "Never. Square numbers are always odd." },
            ],
            solution: [
              { say: "The square numbers start 1, 4, 9, 16, 25, 36: odd, even, odd, even, …" },
            ],
          });
        if (p.claim === 1)
          return A.trueOrFalseWhy({
            rng,
            statement: ["Finn says ", A.math(`${p.n}^{${p.power}} = ${p.n * p.power}`), "."],
            truth: false,
            reasons: [
              {
                text: `False. ${p.n}^${p.power} = ${Array.from({ length: p.power }, () => p.n).join(" × ")} = ${answer}.`,
                correct: true,
              },
              {
                text: `True. The small ${p.power} means multiply by ${p.power}.`,
                code: "MD.SQUARE.DOUBLES",
              },
              {
                text: `True. ${p.n} and ${p.power} are next to each other, so the answer is ${p.n}${p.power}.`,
              },
            ],
            solution: [{ say: `${p.n}^${p.power} = ${answer}.` }],
          });
        return A.trueOrFalseWhy({
          rng,
          statement: ["64 is both a square number and a cube number."],
          truth: true,
          reasons: [
            { text: "True. 8² = 8 × 8 = 64 and 4³ = 4 × 4 × 4 = 64.", correct: true },
            { text: "False. 64 = 32 × 2, so it is a square of 32.", code: "MD.SQUARE.DOUBLES" },
            { text: "False. No number can be both." },
          ],
          solution: [{ say: "8 × 8 = 64 and 4 × 4 × 4 = 64." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.n ** p.power;
    if (question.archetype === "varied-form") return isSquare(Number(chosenText(question)));
    return true;
  },
});
