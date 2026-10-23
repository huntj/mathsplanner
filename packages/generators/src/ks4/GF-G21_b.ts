/**
 * @statement GF-G21.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G21.b: Know exact values of tan
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";
import { EXACT } from "../shared/trig.ts";

const VALUES = ["\\frac{\\sqrt{3}}{3}", "1", "\\sqrt{3}"];

interface Params {
  angle: 30 | 45 | 60;
  a: number;
}

export default defineGenerator<Params>({
  id: "GF-G21.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.EXACT"],

  params(rng) {
    return { angle: rng.pick([30, 45, 60] as const), a: rng.int(2, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = EXACT.tan[p.angle][0];
        return A.choice({
          rng,
          question: ["What is the exact value of ", A.math(`\\tan ${p.angle}^\\circ`), "?"],
          correct: A.math(right),
          distractors: VALUES.filter((v) => v !== right).map((v) => ({
            content: A.math(v),
            code: "GEO.TRIG.EXACT",
            feedback: "tan = sin ÷ cos. tan grows from 0 at 0°, through 1 at 45°.",
          })),
          solution: [{ say: "", math: `\\tan ${p.angle}^\\circ = ${right}` }],
        });
      }
      case 2: {
        const v = Surd.term(p.a, 3);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `In a right-angled triangle, the side adjacent to an angle of 60° is ${p.a} cm.`,
              ],
              ask: "Find the exact length of the side opposite the 60° angle.",
            },
          ],
          answer: A.exact(v, "surd"),
          wrong: [
            {
              code: "GEO.TRIG.EXACT",
              value: A.exact(Surd.term(p.a, 2)),
              feedback: "tan 60° = √3, so opposite = adjacent × √3.",
            },
          ],
          solution: [
            { say: "", math: `${p.a} \\times \\tan 60^\\circ = ${toLatex(v)} \\text{ cm}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zoe says ",
            A.math("\\tan 45^\\circ = 1"),
            " because a right-angled triangle with a 45° angle has its two shorter sides equal.",
          ],
          truth: true,
          reasons: [
            { text: "True. The triangle is isosceles, so opposite ÷ adjacent = 1.", correct: true },
            { text: "False. tan 45° = √2/2.", code: "GEO.TRIG.EXACT" },
            { text: "False. tan 45° = 45 ÷ 90 = ½.", code: "GEO.TRIG.EXACT" },
          ],
          solution: [{ say: "tan 45° = sin 45° ÷ cos 45° = 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === EXACT.tan[p.angle][0];
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(Surd.term(p.a, 3));
    return true;
  },
});
