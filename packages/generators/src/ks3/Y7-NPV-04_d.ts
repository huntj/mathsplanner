/**
 * @statement Y7-NPV-04.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-04.d: Find the LCM
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  g: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-04.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.LCM-PRODUCT", "NPV.FACTOR.HCF-LCM"],

  params(rng) {
    const p = { g: rng.int(2, 4), x: rng.int(2, 5), y: rng.int(2, 7) };
    if (p.x >= p.y || gcdOf(p.x, p.y) > 1) reject("coprime multipliers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const a = p.g * p.x;
    const b = p.g * p.y;
    const lcm = p.g * p.x * p.y;
    switch (depth) {
      case 1:
        return A.standard({
          question: [`Find the lowest common multiple of ${a} and ${b}.`],
          answer: A.number(lcm),
          wrong: wrongs(lcm, [
            {
              code: "NPV.FACTOR.LCM-PRODUCT",
              value: A.number(a * b),
              feedback: `${a} × ${b} is a common multiple, but there is a smaller one.`,
            },
          ]),
          solution: [
            {
              say: `Multiples of ${b}: ${[1, 2, 3, 4, 5].map((k) => k * b).join(", ")}, …; the first that ${a} divides is ${lcm}.`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `One light flashes every ${a} seconds and another every ${b} seconds. They flash together now.`,
              ],
              ask: "After how many seconds will they next flash together?",
            },
            {
              question: [
                `Rolls come in packs of ${a} and burgers in packs of ${b}. Sam wants exactly the same number of rolls and burgers.`,
              ],
              ask: "What is the smallest number of each he can buy?",
            },
          ],
          answer: A.number(lcm),
          wrong: wrongs(lcm, [
            {
              code: "NPV.FACTOR.LCM-PRODUCT",
              value: A.number(a * b),
              feedback: `They share the factor ${p.g}, so the LCM is less than ${a} × ${b}.`,
            },
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(p.g),
              feedback: "That is the HCF. You need a common multiple.",
            },
          ]),
          solution: [{ say: "", math: `\\text{LCM}(${a}, ${b}) = ${lcm}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [`Max says the lowest common multiple of ${a} and ${b} is ${p.g}.`],
          truth: false,
          reasons: [
            {
              text: `False. ${p.g} is the highest common factor. A common multiple must be at least as big as both numbers: the LCM is ${lcm}.`,
              correct: true,
            },
            { text: `True. ${p.g} goes into both numbers.`, code: "NPV.FACTOR.HCF-LCM" },
            {
              text: "True. The lowest common multiple is the smallest number in common.",
              code: "NPV.FACTOR.HCF-LCM",
            },
          ],
          solution: [{ say: "Factors go into a number; multiples are in its times table." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.g * p.x * p.y;
    return true;
  },
});
