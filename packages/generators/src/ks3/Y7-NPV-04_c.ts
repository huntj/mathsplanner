/**
 * @statement Y7-NPV-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-04.c: Find the HCF
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
  id: "Y7-NPV-04.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.HCF-LCM"],

  params(rng) {
    const p = { g: rng.int(2, 9), x: rng.int(2, 6), y: rng.int(2, 6) };
    if (p.x >= p.y || gcdOf(p.x, p.y) > 1) reject("coprime multipliers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const a = p.g * p.x;
    const b = p.g * p.y;
    switch (depth) {
      case 1:
        return A.standard({
          question: [`Find the highest common factor of ${a} and ${b}.`],
          answer: A.number(p.g),
          wrong: wrongs(p.g, [
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(p.g * p.x * p.y),
              feedback:
                "That is a common multiple. The HCF is the biggest number that divides both.",
            },
            p.g % 2 === 0 && p.g > 2
              ? {
                  code: "NPV.FACTOR.HCF-LCM",
                  value: A.number(2),
                  feedback: "2 is a common factor, but not the highest.",
                }
              : undefined,
          ]),
          solution: [{ say: `List the factors of each: the biggest in both lists is ${p.g}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A teacher has ${a} pencils and ${b} rubbers. She packs them into identical sets with nothing left over.`,
              ],
              ask: "What is the largest number of sets she can make?",
            },
            {
              question: [
                `Two ribbons are ${a} cm and ${b} cm long. Both are cut into equal pieces, as long as possible, with none left over.`,
              ],
              ask: "How long is each piece, in cm?",
            },
          ],
          answer: A.number(p.g),
          wrong: wrongs(p.g, [
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(p.g * p.x * p.y),
              feedback: "Splitting into equal groups needs a common factor, the highest one.",
            },
          ]),
          solution: [{ say: "", math: `\\text{HCF}(${a}, ${b}) = ${p.g}` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The HCF of two different numbers is smaller than both of them."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. The HCF of ${a} and ${b} is ${p.g}, smaller than both, but the HCF of ${p.g} and ${a} is ${p.g}, equal to the smaller number.`,
              correct: true,
            },
            { text: "Always. A factor is always smaller.", code: "NPV.FACTOR.HCF-LCM" },
            { text: "Never. The HCF is bigger than both numbers.", code: "NPV.FACTOR.HCF-LCM" },
          ],
          solution: [{ say: "When one number divides the other, the HCF is the smaller number." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.g;
    return true;
  },
});
