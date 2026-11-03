/**
 * @statement GF-G3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G3.b: Use angle facts in triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { triangle } from "../shared/geo.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  apex: number;
}

export default defineGenerator<Params>({
  id: "GF-G3.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ANGLES.TRIANGLE-360", "GEO.ISOSCELES.APEX-EQUALS-BASE"],

  params(rng) {
    const p = { a: rng.int(35, 85), b: rng.int(35, 85), apex: rng.int(10, 50) * 2 };
    if (p.a + p.b > 150 || p.a === p.b) reject("a clear scalene triangle");
    if ((180 - p.apex) / 2 === p.apex) reject("an apex angle that differs from the base angles");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 180 - p.a - p.b;
        return A.standard({
          question: [
            A.figure(triangle(p.a, 5, p.b, {}, { A: `${p.a}^\\circ`, B: `${p.b}^\\circ`, C: "x" })),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.ANGLES.TRIANGLE-360",
              value: A.degrees(360 - p.a - p.b),
              feedback: "The angles in a triangle add up to 180°.",
            },
          ]),
          solution: [
            { say: "", math: `x = 180^\\circ - ${p.a}^\\circ - ${p.b}^\\circ = ${v}^\\circ` },
          ],
        });
      }
      case 2: {
        const base = (180 - p.apex) / 2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Triangle ABC is isosceles with CA = CB. Angle ACB = ${p.apex}°.`,
                A.figure(triangle(base, 5, base, {}, { A: "x", C: `${p.apex}^\\circ` })),
              ],
              ask: "Find the angle x.",
            },
            {
              question: [
                `An isosceles triangle has an angle of ${p.apex}° between its two equal sides.`,
              ],
              ask: "Find the size of each of its other angles.",
            },
          ],
          answer: A.degrees(base),
          wrong: wrongs(base, [
            {
              code: "GEO.ISOSCELES.APEX-EQUALS-BASE",
              value: A.degrees(p.apex),
              feedback:
                "The two equal angles are the ones at the ends of the third side, not the one between the equal sides.",
            },
            {
              code: "GEO.ANGLES.TRIANGLE-360",
              value: A.degrees(180 - p.apex),
              feedback: `The two base angles share the ${180 - p.apex}° between them.`,
            },
          ]),
          solution: [{ say: "", math: `(180^\\circ - ${p.apex}^\\circ) \\div 2 = ${base}^\\circ` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ren says the exterior angle of a triangle equals the sum of the two interior angles opposite it.",
              ],
              truth: true,
              reasons: [
                {
                  text: `True. With interior angles ${p.a}° and ${p.b}°, the third is ${180 - p.a - p.b}°, and the exterior angle next to it is 180° − ${180 - p.a - p.b}° = ${p.a + p.b}°.`,
                  correct: true,
                },
                {
                  text: "False. It equals the angle next to it inside the triangle.",
                  code: "GEO.ANGLES.TRIANGLE-360",
                },
                {
                  text: "False. The exterior angles of a triangle are all 180°.",
                  code: "GEO.ANGLES.TRIANGLE-360",
                },
              ],
              solution: [
                { say: "Angles on a straight line and angles in a triangle both total 180°." },
              ],
            }),
          [
            {
              statement:
                "An isosceles triangle has a top angle of 40°. Gil says each base angle is 70°.",
              truth: true,
              right: "True. (180 − 40) ÷ 2 = 70.",
              wrong: [
                ["False. Each is 40°.", "GEO.ISOSCELES.APEX-EQUALS-BASE"],
                ["False. Each is 160°.", "GEO.ANGLES.TRIANGLE-360"],
              ],
            },
            {
              claim: "The angles in a triangle add up to 180°.",
              truth: "always",
              right: "Always. They make a straight line when put together.",
              wrong: [
                ["Never. They add up to 360°.", "GEO.ANGLES.TRIANGLE-360"],
                ["Sometimes. Only in right-angled triangles."],
              ],
            },
            {
              statement: "Two angles of a triangle are 50° and 60°. Ana says the third is 250°.",
              truth: false,
              right: "False. 180 − 50 − 60 = 70°.",
              wrong: [
                ["True. 360 − 110 = 250.", "GEO.ANGLES.TRIANGLE-360"],
                ["True. Triangles add to 360°.", "GEO.ANGLES.TRIANGLE-360"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 180 - p.a - p.b;
    if (question.key.depth === 2) return numberAnswer(question) === (180 - p.apex) / 2;
    return true;
  },
});
