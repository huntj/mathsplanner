/**
 * @statement GF-N4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N4.c: Find the HCF and LCM
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
  id: "GF-N4.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.HCF-LCM", "NPV.FACTOR.LCM-PRODUCT"],

  params(rng) {
    const p = { g: rng.int(2, 8), x: rng.int(2, 7), y: rng.int(2, 7) };
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
          question: [`Find the highest common factor (HCF) of ${a} and ${b}.`],
          answer: A.number(p.g),
          wrong: wrongs(p.g, [
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(lcm),
              feedback:
                "That is the lowest common multiple. The HCF is the biggest number that divides into both.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${a} = ${p.g} \\times ${p.x}, \\; ${b} = ${p.g} \\times ${p.y}, \\text{ so the HCF is } ${p.g}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: [`Find the lowest common multiple (LCM) of ${a} and ${b}.`] },
            {
              question: [
                `Buses leave every ${a} minutes and every ${b} minutes. Both leave at 9 am.`,
              ],
              ask: "After how many minutes do they next leave together?",
            },
          ],
          answer: A.number(lcm),
          wrong: wrongs(lcm, [
            {
              code: "NPV.FACTOR.LCM-PRODUCT",
              value: A.number(a * b),
              feedback: `${a} × ${b} is a common multiple, but not the lowest: they share the factor ${p.g}.`,
            },
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(p.g),
              feedback: "That is the highest common factor.",
            },
          ]),
          solution: [
            { say: "", math: `\\text{LCM} = ${p.g} \\times ${p.x} \\times ${p.y} = ${lcm}` },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The LCM of two numbers is their product."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It works when the numbers share no factor, like ${p.x} and ${p.y}, but the LCM of ${a} and ${b} is ${lcm}, not ${a * b}.`,
              correct: true,
            },
            {
              text: "Always. Multiplying gives a multiple of both.",
              code: "NPV.FACTOR.LCM-PRODUCT",
            },
            {
              text: "Never. The LCM is always smaller than the product.",
              code: "NPV.FACTOR.LCM-PRODUCT",
            },
          ],
          solution: [{ say: "HCF × LCM = the product of the two numbers." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.g;
    if (question.key.depth === 2) return numberAnswer(question) === p.g * p.x * p.y;
    return true;
  },
});
