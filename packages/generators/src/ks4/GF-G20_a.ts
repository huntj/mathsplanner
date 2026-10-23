/**
 * @statement GF-G20.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G20.a: Use Pythagoras' theorem in 2D
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { legsTriangle } from "../shared/geo.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  k: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G20.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.PYTHAG.NO-SQUARE", "GEO.PYTHAG.ADD-FOR-SHORT"],

  params(rng) {
    const p = { a: rng.int(3, 15), b: rng.int(3, 15), c: rng.int(8, 20), k: rng.pick([1, 2, 3]) };
    if (p.a === p.b || Number.isInteger(Math.hypot(p.a, p.b)))
      reject("a hypotenuse that needs rounding");
    if (p.a > 2.5 * p.b || p.b > 2.5 * p.a) reject("a triangle that is not too thin");
    if (p.a >= p.c - 1 || Number.isInteger(Math.sqrt(p.c * p.c - p.a * p.a)))
      reject("a shorter side that needs rounding");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.hypot(p.a, p.b));
        return A.standard({
          question: [
            A.figure(
              legsTriangle(p.a, p.b, { ab: `${p.a}\\text{ cm}`, bc: `${p.b}\\text{ cm}`, ca: "x" }),
            ),
          ],
          ask: "Find the length x, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(p.a + p.b, { accuracy: { dp: 1 } }),
              feedback: "Square the two shorter sides, add, then square root.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `x = \\sqrt{${p.a}^2 + ${p.b}^2} = \\sqrt{${p.a * p.a + p.b * p.b}} = ${v} \\text{ cm}`,
            },
          ],
        });
      }
      case 2: {
        const b = Math.sqrt(p.c * p.c - p.a * p.a);
        const v = r1(b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  legsTriangle(p.a, b, {
                    ab: `${p.a}\\text{ cm}`,
                    bc: "x",
                    ca: `${p.c}\\text{ cm}`,
                  }),
                ),
              ],
              ask: "Find the length x, in cm, to 1 decimal place.",
            },
            {
              question: [
                `A ladder ${p.c} m long leans against a wall. Its foot is ${p.a} m from the wall.`,
              ],
              ask: "How high up the wall does it reach, in m, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.PYTHAG.ADD-FOR-SHORT",
              value: A.number(r1(Math.hypot(p.a, p.c)), { accuracy: { dp: 1 } }),
              feedback: `${p.c} is the hypotenuse, so subtract: ${p.c}² − ${p.a}².`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `x = \\sqrt{${p.c}^2 - ${p.a}^2} = \\sqrt{${p.c * p.c - p.a * p.a}} = ${v}`,
            },
          ],
        });
      }
      default: {
        const [x, y, z] = [3 * p.k, 4 * p.k, 5 * p.k + 1];
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ola says a triangle with sides ${x} cm, ${y} cm and ${z} cm is right-angled.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${x}² + ${y}² = ${x * x + y * y}, but ${z}² = ${z * z}. They are not equal, so there is no right angle.`,
              correct: true,
            },
            { text: `True. ${x} + ${y} is more than ${z}.`, code: "GEO.PYTHAG.NO-SQUARE" },
            { text: "True. Any triangle with a long side is right-angled." },
          ],
          solution: [
            { say: "A triangle is right-angled exactly when a² + b² = c² for its longest side c." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.hypot(p.a, p.b));
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(Math.sqrt(p.c * p.c - p.a * p.a));
    return true;
  },
});
