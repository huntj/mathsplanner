/**
 * @statement AL-S3.2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S3.2.a: Find conditional probabilities from Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** Counts: only A, both, only B, neither. */
  a: number;
  ab: number;
  b: number;
  none: number;
}

export default defineGenerator<Params>({
  id: "AL-S3.2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.CONDITIONAL.TOTAL", "PRO.CONDITIONAL.FORMULA", "PRO.VENN.DOUBLE-COUNT"],

  params(rng) {
    return { a: rng.int(3, 15), ab: rng.int(2, 10), b: rng.int(3, 15), none: rng.int(2, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.a + p.ab + p.b + p.none;
    const intro = `In a Venn diagram of ${total} students, ${p.a} study only art (A), ${p.ab} study art and biology, ${p.b} study only biology (B) and ${p.none} study neither.`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [intro],
          ask: ["Find ", A.math("P(A \\mid B)"), "."],
          correct: A.math(toLatex(frac(p.ab, p.ab + p.b))),
          distractors: [
            {
              content: A.math(toLatex(frac(p.ab, total))),
              code: "PRO.CONDITIONAL.TOTAL",
              feedback: "Given B, only the students in B count: divide by the number in B.",
            },
            {
              content: A.math(toLatex(frac(p.ab, p.a + p.ab))),
              code: "PRO.CONDITIONAL.FORMULA",
              feedback: "P(A | B) divides by the size of B, not A.",
            },
            {
              content: A.math(toLatex(frac(p.ab, p.b))),
              code: "PRO.VENN.DOUBLE-COUNT",
              feedback: `B includes the overlap: ${p.ab} + ${p.b} students.`,
            },
          ].filter((d, i, all) => {
            const key = JSON.stringify(d.content);
            return (
              key !== JSON.stringify(A.math(toLatex(frac(p.ab, p.ab + p.b)))) &&
              all.findIndex((e) => JSON.stringify(e.content) === key) === i
            );
          }),
          solution: [
            {
              say: "",
              math: `P(A \\mid B) = \\frac{${p.ab}}{${p.ab} + ${p.b}} = ${toLatex(frac(p.ab, p.ab + p.b))}`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [intro],
          ask: [
            "A student who does not study biology is chosen. Find the probability that they study art.",
          ],
          correct: A.math(toLatex(frac(p.a, p.a + p.none))),
          distractors: [
            {
              content: A.math(toLatex(frac(p.a, total))),
              code: "PRO.CONDITIONAL.TOTAL",
              feedback: "Only students outside B count, so divide by the number not in B.",
            },
            {
              content: A.math(toLatex(frac(p.a + p.ab, p.a + p.none))),
              code: "PRO.VENN.DOUBLE-COUNT",
              feedback: "Students in the overlap study biology, so they are not in this group.",
            },
          ],
          solution: [{ say: "", math: `P(A \\mid B') = \\frac{${p.a}}{${p.a} + ${p.none}}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Tia says P(A | B) = ${p.ab}/${total}.`,
          truth: false,
          reasons: [
            {
              text: `False. Given B, the sample space is the ${p.ab + p.b} students in B, so P(A | B) = ${p.ab}/${p.ab + p.b}.`,
              correct: true,
            },
            {
              text: "True. Always divide by the total number of students.",
              code: "PRO.CONDITIONAL.TOTAL",
            },
            { text: "True. P(A | B) is the same as P(A ∩ B).", code: "PRO.CONDITIONAL.FORMULA" },
          ],
          solution: [{ say: "", math: `P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === toLatex(frac(p.ab, p.ab + p.b));
    if (question.key.depth === 2) return chosenText(question) === toLatex(frac(p.a, p.a + p.none));
    return true;
  },
});
