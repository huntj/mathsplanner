/**
 * @statement Y7-GEO-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-05.b: Use angles on a straight line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { anglesOnLine } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-05.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ANGLES.STRAIGHT-LINE-360", "GEO.ANGLES.ADDS-KNOWN"],

  params(rng) {
    const p = { a: rng.int(25, 155), b: rng.int(20, 60) };
    if (p.a === 90 || (180 - p.b) % 3 !== 0 || (180 - p.b) / 3 < 25)
      reject("a clear angle and a whole-number x");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = 180 - p.a;
        return A.standard({
          question: [
            A.figure(
              anglesOnLine([
                { value: p.a, label: `${p.a}^\\circ` },
                { value: x, label: "x" },
              ]),
            ),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(x),
          wrong: wrongs(x, [
            {
              code: "GEO.ANGLES.STRAIGHT-LINE-360",
              value: A.degrees(360 - p.a),
              feedback: "Angles on a straight line add up to 180°.",
            },
          ]),
          solution: [{ say: "", math: `x = 180^\\circ - ${p.a}^\\circ = ${x}^\\circ` }],
        });
      }
      case 2: {
        const x = (180 - p.b) / 3;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  anglesOnLine([
                    { value: x, label: "x" },
                    { value: p.b, label: `${p.b}^\\circ` },
                    { value: 2 * x, label: "2x" },
                  ]),
                ),
              ],
              ask: "Find the value of x.",
            },
          ],
          answer: A.number(x),
          wrong: wrongs(x, [
            {
              code: "GEO.ANGLES.ADDS-KNOWN",
              value: A.number(Math.round(((180 + p.b) / 3) * 100) / 100),
              feedback: `Subtract the known ${p.b}° from 180°: 3x = ${180 - p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `3x + ${p.b} = 180 \\Rightarrow x = ${x}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Sam says two angles of ${p.a}° and ${180 - p.a + 10}° can sit together on a straight line.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Angles on a straight line add up to 180°, but these make ${p.a + 180 - p.a + 10}°.`,
                  correct: true,
                },
                {
                  text: "True. Any two angles can sit on a line.",
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                },
                {
                  text: "True. Angles on a line add up to 360°.",
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                },
              ],
              solution: [{ say: "A straight line is a half turn: 180°." }],
            }),
          [
            {
              statement: `Two angles sit together on a straight line. One is ${p.a}°. Ria says the other is ${180 - p.a}°.`,
              truth: true,
              right: `True. Angles on a straight line add up to 180°: 180 − ${p.a} = ${180 - p.a}.`,
              wrong: [
                [`False. It is ${360 - p.a}°.`, "GEO.ANGLES.STRAIGHT-LINE-360"],
                [`False. It is ${p.a}° as well.`],
              ],
            },
            {
              claim: "Two angles that sit together on a straight line are equal.",
              truth: "sometimes",
              right:
                "Sometimes. They are equal only when both are 90°; 70° and 110° sit on a line too.",
              wrong: [
                ["Always. A straight line is cut exactly in half."],
                ["Never. Angles on a line are always different."],
              ],
            },
            {
              claim: "Two obtuse angles can sit together on a straight line.",
              truth: "never",
              right:
                "Never. Two obtuse angles add up to more than 180°, and angles on a line make exactly 180°.",
              wrong: [
                ["Always. Any two angles can sit on a line.", "GEO.ANGLES.STRAIGHT-LINE-360"],
                ["Sometimes. If they add up to 360°.", "GEO.ANGLES.STRAIGHT-LINE-360"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 180 - p.a;
    if (question.key.depth === 2) return numberAnswer(question) === (180 - p.b) / 3;
    return true;
  },
});
