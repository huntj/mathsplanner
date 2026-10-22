/**
 * @statement GH-N5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N5: Use the product rule for counting
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: a lock with `wheels` wheels, each showing 1 to `digits`. */
  wheels: number;
  digits: number;
  /** Depth 2: runners in a race, and the places awarded. */
  runners: number;
  places: number;
  /** Depth 4: whether the claim about three-digit numbers is the right one. */
  claimTrue: boolean;
  /** Depth 5: codes of `letters` letters from the first `pool` letters, then `numbers` digits. */
  pool: number;
  letters: number;
  numbers: number;
}

const ALPHABET = "ABCDEFGHIJ";
const fall = (n: number, k: number) =>
  Array.from({ length: k }, (_, i) => n - i).reduce((a, b) => a * b, 1);

export default defineGenerator<Params>({
  id: "GH-N5",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["NPV.POWER.TIMES-INDEX", "NPV.PRODUCT-RULE.REPEAT"],

  params(rng) {
    const wheels = rng.int(3, 4);
    const digits = rng.pick([4, 5, 6, 8, 9]);
    const runners = rng.int(6, 12);
    if (digits * wheels === digits ** wheels) reject("a power that differs from the product");
    return {
      wheels,
      digits,
      runners,
      places: 3,
      claimTrue: rng.bool(),
      pool: rng.int(5, 8),
      letters: 2,
      numbers: rng.int(2, 3),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.digits ** p.wheels;
        return A.standard({
          question: `A combination lock has ${p.wheels} wheels. Each wheel shows the digits 1 to ${p.digits}.`,
          ask: "How many different combinations are there?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(p.digits * p.wheels),
              feedback: `Each wheel has ${p.digits} choices for every choice on the others: multiply ${p.wheels} lots of ${p.digits}.`,
            },
          ]),
          solution: [{ say: `${Array(p.wheels).fill(p.digits).join(" × ")} = ${n}.` }],
        });
      }
      case 2: {
        const n = fall(p.runners, p.places);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `${p.runners} runners are in a race.`,
              ask: "In how many different ways can the gold, silver and bronze medals be awarded?",
            },
            {
              question: `A club of ${p.runners} members chooses a captain, a vice-captain and a secretary. Nobody can hold two jobs.`,
              ask: "In how many different ways can the three jobs be filled?",
            },
          ],
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "NPV.PRODUCT-RULE.REPEAT",
              value: A.number(p.runners ** 3),
              feedback:
                "Once someone is chosen they cannot be chosen again, so there is one fewer choice each time.",
            },
          ]),
          solution: [{ say: `${p.runners} × ${p.runners - 1} × ${p.runners - 2} = ${n}.` }],
        });
      }
      case 4: {
        const claim = p.claimTrue ? "9 × 9 × 8 = 648" : "10 × 9 × 8 = 720";
        return A.trueOrFalseWhy({
          rng,
          statement: `Sam says there are ${claim} three-digit numbers with no repeated digits.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. The first digit cannot be 0, so it has 9 choices; then 9 digits are left (including 0), then 8.",
                  correct: true,
                },
                { text: "False. It should be 10 × 9 × 8, because there are 10 digits." },
                {
                  text: "False. It should be 9 × 9 × 9, because each place has 9 choices.",
                  code: "NPV.PRODUCT-RULE.REPEAT",
                },
              ]
            : [
                {
                  text: "False. A three-digit number cannot start with 0, so the first digit has only 9 choices: 9 × 9 × 8 = 648.",
                  correct: true,
                },
                { text: "True. There are 10 digits, then 9 left, then 8." },
                {
                  text: "False. Digits can repeat, so it is 10 × 10 × 10.",
                  code: "NPV.PRODUCT-RULE.REPEAT",
                },
              ],
          solution: [
            {
              say: "Fill the most restricted place first: 9 choices for the first digit, then 9, then 8.",
            },
          ],
        });
      }
      default: {
        const letters = ALPHABET.slice(0, p.pool);
        const any = p.pool ** p.letters * 10 ** p.numbers;
        const distinct = fall(p.pool, p.letters) * fall(10, p.numbers);
        return A.multiStepContext({
          context: `A code is ${p.letters} letters followed by ${p.numbers} digits. The letters are chosen from ${letters.split("").join(", ")} and the digits from 0 to 9.`,
          parts: [
            {
              ask: "How many different codes are there if letters and digits can repeat?",
              answer: A.number(any),
              wrong: wrongs(any, [
                {
                  code: "NPV.POWER.TIMES-INDEX",
                  value: A.number(p.pool * p.letters * 10 * p.numbers),
                  feedback: "Multiply the number of choices for each of the places.",
                },
              ]),
            },
            {
              ask: "How many codes have no letter or digit repeated?",
              answer: A.number(distinct),
              wrong: [
                {
                  code: "NPV.PRODUCT-RULE.REPEAT",
                  value: A.number(any),
                  feedback:
                    "Without repeats, each place has one fewer choice than the one before of its kind.",
                },
              ],
            },
          ],
          solution: [
            {
              say: `${Array(p.letters).fill(p.pool).join(" × ")} × ${Array(p.numbers).fill(10).join(" × ")} = ${any}.`,
            },
            {
              say: `${Array.from({ length: p.letters }, (_, i) => p.pool - i).join(" × ")} × ${Array.from({ length: p.numbers }, (_, i) => 10 - i).join(" × ")} = ${distinct}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.digits ** p.wheels;
    if (question.key.depth === 2) return numberAnswer(question) === fall(p.runners, 3);
    if (question.key.depth === 5)
      return numberAnswer(question) === p.pool ** p.letters * 10 ** p.numbers;
    return true;
  },
});
