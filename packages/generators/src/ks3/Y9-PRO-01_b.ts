/**
 * @statement Y9-PRO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-PRO-01.b: Enumerate sets using Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { VennSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params): VennSpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Dogs}", "\\text{Cats}"],
  regions: [String(p.onlyA), String(p.both), String(p.onlyB), String(p.neither)],
  description:
    "A Venn diagram of pupils who own dogs and pupils who own cats, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "Y9-PRO-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.VENN.DOUBLE-COUNT"],

  params(rng) {
    return {
      onlyA: rng.int(3, 15),
      both: rng.int(2, 9),
      onlyB: rng.int(3, 15),
      neither: rng.int(2, 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.onlyA + p.both + p.onlyB + p.neither;
    switch (depth) {
      case 1: {
        const v = p.onlyA;
        return A.standard({
          question: ["The Venn diagram shows the pets owned by a class.", A.figure(venn(p))],
          ask: "How many pupils own a dog but not a cat?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.number(p.onlyA + p.both),
              feedback: `The ${p.both} in the overlap own a cat too, so leave them out.`,
            },
          ]),
          solution: [{ say: `The part of the dog circle outside the cat circle: ${v}.` }],
        });
      }
      case 2: {
        const dogs = p.onlyA + p.both;
        const cats = p.onlyB + p.both;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `In a class of ${total} pupils, ${dogs} own a dog, ${cats} own a cat and ${p.both} own both.`,
              ],
              ask: "How many own neither?",
            },
          ],
          answer: A.number(p.neither),
          wrong: wrongs(p.neither, [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.number(total - dogs - cats),
              feedback: `The ${p.both} who own both were counted twice: dogs or cats = ${dogs} + ${cats} − ${p.both} = ${dogs + cats - p.both}.`,
            },
          ]),
          solution: [
            { say: "", math: `${total} - (${dogs} + ${cats} - ${p.both}) = ${p.neither}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rae says the numbers in the four regions of a Venn diagram must add up to the total number of people asked.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. Every person goes in exactly one region: only A, both, only B, or neither (outside both circles).",
              correct: true,
            },
            {
              text: "False. People in the overlap are counted twice.",
              code: "PRO.VENN.DOUBLE-COUNT",
            },
            { text: "False. The outside region is not part of the total." },
          ],
          solution: [
            { say: "", math: `${p.onlyA} + ${p.both} + ${p.onlyB} + ${p.neither} = ${total}` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.onlyA;
    if (question.key.depth === 2) return numberAnswer(question) === p.neither;
    return true;
  },
});
