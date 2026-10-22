/**
 * @statement GH-P9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-P9: Calculate and interpret conditional probabilities using two-way tables, tree diagrams and
// Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { VennSpec } from "@mathsplanner/diagrams";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** Two-way table: Year 10 and Year 11 pupils who do or do not play an instrument. */
  y10Play: number;
  y10Not: number;
  y11Play: number;
  y11Not: number;
  /** Venn: only A, both, only B, neither. */
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params): VennSpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Maths}", "\\text{Art}"],
  regions: [String(p.onlyA), String(p.both), String(p.onlyB), String(p.neither)],
  description:
    "A Venn diagram of students who study maths and students who study art, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "GH-P9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.TOTAL", "PRO.VENN.DOUBLE-COUNT"],

  params(rng) {
    const p = {
      y10Play: rng.int(5, 25),
      y10Not: rng.int(10, 40),
      y11Play: rng.int(5, 25),
      y11Not: rng.int(10, 40),
      onlyA: rng.int(4, 20),
      both: rng.int(3, 12),
      onlyB: rng.int(4, 20),
      neither: rng.int(2, 10),
    };
    if (new Set([p.onlyA, p.both, p.onlyB, p.neither]).size < 4 || p.y10Play === p.y11Play)
      reject("different counts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const y11 = p.y11Play + p.y11Not;
        const total = y11 + p.y10Play + p.y10Not;
        const rows = [
          ["Year 10", p.y10Play, p.y10Not, p.y10Play + p.y10Not],
          ["Year 11", p.y11Play, p.y11Not, y11],
          ["total", p.y10Play + p.y11Play, p.y10Not + p.y11Not, total],
        ];
        return A.standard({
          question: [
            "The two-way table shows which pupils play a musical instrument.",
            A.displayMath(tableLatex(["", "plays", "does not play", "total"], rows)),
          ],
          ask: "A Year 11 pupil is chosen at random. What is the probability that they play an instrument?",
          answer: A.exact(frac(p.y11Play, y11)),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.y11Play, total)),
              feedback: `The pupil is known to be in Year 11, so divide by the ${y11} Year 11 pupils.`,
            },
          ],
          solution: [
            {
              say: `${p.y11Play} of the ${y11} Year 11 pupils play: `,
              math: toLatex(frac(p.y11Play, y11)),
            },
          ],
        });
      }
      case 2: {
        const art = p.both + p.onlyB;
        const total = p.onlyA + p.both + p.onlyB + p.neither;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The Venn diagram shows which subjects some students study.",
                A.figure(venn(p)),
              ],
              ask: "A student who studies art is chosen at random. What is the probability that they also study maths?",
            },
            {
              question: [
                "The Venn diagram shows which subjects some students study.",
                A.figure(venn(p)),
              ],
              ask: ["Find ", A.math("P(\\text{Maths} \\mid \\text{Art})"), "."],
            },
          ],
          answer: A.exact(frac(p.both, art)),
          wrong: [
            {
              code: "PRO.CONDITIONAL.TOTAL",
              value: A.exact(frac(p.both, total)),
              feedback: `We know the student studies art, so divide by the ${art} art students.`,
            },
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.exact(frac(p.both, p.onlyB)),
              feedback: `The art circle holds ${p.onlyB} + ${p.both} = ${art} students, including those who study both.`,
            },
          ],
          solution: [
            {
              say: `${p.both} of the ${art} art students also study maths: `,
              math: toLatex(frac(p.both, art)),
            },
          ],
        });
      }
      default: {
        const maths = p.onlyA + p.both;
        const art = p.both + p.onlyB;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The Venn diagram shows which subjects some students study.",
            A.figure(venn(p)),
            "Raj says P(Maths given Art) is the same as P(Art given Maths).",
          ],
          truth: false,
          reasons: [
            {
              text: `False. P(Maths | Art) = ${p.both}/${art}, but P(Art | Maths) = ${p.both}/${maths}: the groups you divide by are different.`,
              correct: true,
            },
            {
              text: "True. Both use the students who study both subjects.",
              code: "PRO.CONDITIONAL.TOTAL",
            },
            {
              text: "True. Both divide by the total number of students.",
              code: "PRO.CONDITIONAL.TOTAL",
            },
          ],
          solution: [{ say: "The condition after the bar tells you which group to divide by." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(frac(p.y11Play, p.y11Play + p.y11Not));
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(frac(p.both, p.both + p.onlyB));
    return true;
  },
});
