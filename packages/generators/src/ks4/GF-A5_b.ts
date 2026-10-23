/**
 * @statement GF-A5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A5.b: Rearrange formulae to change the subject
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  a: number;
  b: number;
  c: number;
}

const right1 = (p: Params) => `\\frac{y - ${p.b}}{${p.a}}`;

export default defineGenerator<Params>({
  id: "GF-A5.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.REARRANGE.ORDER"],

  params(rng) {
    return { a: rng.int(2, 9), b: rng.int(1, 12), c: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Make x the subject of ", A.math(`y = ${p.a}x + ${p.b}`), "."],
          ask: "Write x in terms of y.",
          answer: A.exact(right1(p)),
          wrong: [
            {
              code: "ALG.REARRANGE.ORDER",
              value: A.exact(`\\frac{y}{${p.a}} - ${p.b}`),
              feedback: `Undo the operations in reverse order: subtract ${p.b} first, then divide by ${p.a}.`,
            },
          ],
          solution: [{ say: "", math: `y - ${p.b} = ${p.a}x \\Rightarrow x = ${right1(p)}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Make s the subject of ", A.math("v^2 = u^2 + 2as"), "."],
              ask: "Write s in terms of v, u and a.",
            },
          ],
          answer: A.exact("\\frac{v^2 - u^2}{2a}"),
          wrong: [
            {
              code: "ALG.REARRANGE.ORDER",
              value: A.exact("\\frac{v^2}{2a} - u^2"),
              feedback: "Subtract u² from both sides first, then divide by 2a.",
            },
          ],
          solution: [{ say: "", math: `v^2 - u^2 = 2as \\Rightarrow s = \\frac{v^2 - u^2}{2a}` }],
        });
      default:
        return A.spotTheMistake({
          question: ["Raj makes x the subject of ", A.math(`y = ${p.c}x - ${p.b}`), "."],
          lines: [[A.math(`y + ${p.b} = ${p.c}x`)], [A.math(`x = y + \\frac{${p.b}}{${p.c}}`)]],
          mistake: 1,
          code: "ALG.REARRANGE.ORDER",
          feedback: `Divide the whole of y + ${p.b} by ${p.c}: x = (y + ${p.b}) ÷ ${p.c}.`,
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === right1(p);
    return true;
  },
});
