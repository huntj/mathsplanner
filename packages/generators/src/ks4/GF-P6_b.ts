/**
 * @statement GF-P6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-P6.b: Enumerate using Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { VennSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params): VennSpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Choir}", "\\text{Band}"],
  regions: [String(p.onlyA), String(p.both), String(p.onlyB), String(p.neither)],
  description:
    "A Venn diagram of pupils in the choir and pupils in the band, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "GF-P6.b",
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
        const v = p.onlyA + p.both;
        return A.standard({
          question: ["The Venn diagram shows the pupils in a year group.", A.figure(venn(p))],
          ask: "How many pupils are in the choir?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.number(p.onlyA),
              feedback: `The ${p.both} pupils in the overlap are in the choir too.`,
            },
          ]),
          solution: [{ say: "", math: `${p.onlyA} + ${p.both} = ${v}` }],
        });
      }
      case 2: {
        const v = frac(p.onlyA + p.both + p.onlyB, total);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The Venn diagram shows the pupils in a year group.", A.figure(venn(p))],
              ask: "A pupil is chosen at random. Find the probability that they are in the choir or the band (or both).",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.exact(frac(p.onlyA + 2 * p.both + p.onlyB, total)),
              feedback: `Count the ${p.both} pupils in the overlap only once.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.onlyA} + ${p.both} + ${p.onlyB}}{${total}} = ${toLatex(v)}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The number in A or B equals the number in A plus the number in B."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It works only when nothing is in both. Here ${p.onlyA + p.both} + ${p.both + p.onlyB} counts the ${p.both} in the overlap twice.`,
              correct: true,
            },
            { text: "Always. 'Or' means add.", code: "PRO.VENN.DOUBLE-COUNT" },
            { text: "Never. You must always subtract something." },
          ],
          solution: [{ say: "n(A or B) = n(A) + n(B) − n(A and B)." }],
        });
    }
  },

  verify(p, question) {
    const total = p.onlyA + p.both + p.onlyB + p.neither;
    if (question.key.depth === 1) return numberAnswer(question) === p.onlyA + p.both;
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(p.onlyA + p.both + p.onlyB, total));
    return true;
  },
});
