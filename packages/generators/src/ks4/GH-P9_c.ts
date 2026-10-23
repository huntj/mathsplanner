/**
 * @statement GH-P9.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-P9.c: Find conditional probabilities from Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { VennSpec } from "@mathsplanner/diagrams";
import { exactAnswer } from "../shared/counting.ts";

export interface Params {
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params): VennSpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Coffee}", "\\text{Tea}"],
  regions: [String(p.onlyA), String(p.both), String(p.onlyB), String(p.neither)],
  description:
    "A Venn diagram of people who drink coffee and people who drink tea, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "GH-P9.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.TOTAL"],

  params(rng) {
    return {
      onlyA: rng.int(4, 20),
      both: rng.int(2, 12),
      onlyB: rng.int(4, 20),
      neither: rng.int(2, 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.onlyA + p.both + p.onlyB + p.neither;
    switch (depth) {
      case 1: {
        const v = frac(p.both, p.both + p.onlyB);
        return A.standard({
          question: [
            "The Venn diagram shows the drinks people in an office like.",
            A.figure(venn(p)),
          ],
          ask: "A tea drinker is chosen at random. Find the probability that they also drink coffee.",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.both, total)),
              feedback: `You know they drink tea, so divide by the ${p.both + p.onlyB} tea drinkers.`,
            },
          ],
          solution: [
            { say: "", math: `\\frac{${p.both}}{${p.both} + ${p.onlyB}} = ${toLatex(v)}` },
          ],
        });
      }
      case 2: {
        const v = frac(p.onlyA, p.onlyA + p.neither);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The Venn diagram shows the drinks people in an office like.",
                A.figure(venn(p)),
              ],
              ask: "A person who does not drink tea is chosen at random. Find the probability that they drink coffee.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.onlyA, total)),
              feedback: `The given group is everyone outside the tea circle: ${p.onlyA} + ${p.neither}.`,
            },
          ],
          solution: [
            { say: "", math: `\\frac{${p.onlyA}}{${p.onlyA} + ${p.neither}} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["P(A given B) is at least as big as P(A and B)."],
          truth: "always",
          reasons: [
            {
              text: `Always. Both count the overlap, but P(A given B) divides by the smaller group B instead of everyone: ${p.both}/${p.both + p.onlyB} ≥ ${p.both}/${total}.`,
              correct: true,
            },
            { text: "Never. 'Given' makes a probability smaller.", code: "PRO.CONDITIONAL.TOTAL" },
            { text: "Sometimes. It depends on the size of A." },
          ],
          solution: [{ say: "A smaller denominator gives a bigger fraction." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.both, p.both + p.onlyB));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(p.onlyA, p.onlyA + p.neither));
    return true;
  },
});
