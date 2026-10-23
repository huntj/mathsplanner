/**
 * @statement Y2-MD-01.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.d: Recognise odd and even numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  n: number;
  /** Depth 2: one even number among odd numbers whose tens digits are even. */
  even: number;
  odds: number[];
}

const parity = (n: number) => (n % 2 === 0 ? "Even" : "Odd");

export default defineGenerator<Params>({
  id: "Y2-MD-01.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PAT.EVEN-ODD"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 30 : 99;
    const n = rng.int(11, top);
    // The tens digit has the other parity, to catch looking at the wrong digit.
    if (Math.floor(n / 10) % 2 === n % 2) reject("a tens digit that misleads");
    const even = 10 * (2 * rng.int(0, 4) + 1) + 2 * rng.int(0, 4);
    const odds = rng.sample(
      [21, 23, 25, 27, 29, 41, 43, 45, 47, 49, 61, 63, 65, 67, 69, 81, 83, 85, 87, 89],
      3,
    );
    if (even < 10) reject("a two-digit even number");
    return { n, even, odds };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Is ${p.n} odd or even?`],
          correct: parity(p.n),
          distractors: [
            {
              content: parity(p.n + 1),
              code: "PAT.EVEN-ODD",
              feedback: `Look at the ones digit only: ${p.n % 10} is ${parity(p.n).toLowerCase()}, so ${p.n} is ${parity(p.n).toLowerCase()}.`,
            },
          ],
          solution: [
            { say: `The ones digit is ${p.n % 10}, so ${p.n} is ${parity(p.n).toLowerCase()}.` },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these numbers is even?"],
          correct: String(p.even),
          distractors: p.odds.map((o) => ({
            content: String(o),
            code: "PAT.EVEN-ODD",
            feedback: `${o} ends in ${o % 10}, which is odd. The tens digit does not decide.`,
          })),
          solution: [
            { say: `${p.even} ends in ${p.even % 10}, which is even: it shares equally into 2.` },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["When you add two odd numbers, the answer is even."],
          truth: "always",
          reasons: [
            {
              text: "Always. Each odd number has one left over when paired up, and the two left-overs make a pair.",
              correct: true,
            },
            { text: "Never. Odd add odd makes odd.", code: "PAT.EVEN-ODD" },
            { text: "Sometimes. It depends how big the numbers are." },
          ],
          solution: [{ say: "For example 3 + 5 = 8 and 7 + 9 = 16." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === parity(p.n);
    if (question.key.depth === 2)
      return p.even % 2 === 0 && chosenText(question) === String(p.even);
    return true;
  },
});
