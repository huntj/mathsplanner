/**
 * @statement FM-FM2-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM2-02: Find centres of mass of plane figures and laminas, including by integration
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  m: number[];
  x: number[];
  n: number;
  a: number;
}

const xbar = (p: Params) =>
  round(p.m.reduce((s, mi, i) => s + mi * (p.x[i] ?? 0), 0) / p.m.reduce((s, mi) => s + mi, 0), 2);
const lamina = (p: Params) => toLatex(frac((p.n + 1) * p.a, p.n + 2));

export default defineGenerator<Params>({
  id: "FM-FM2-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CENTRE-MASS"],

  params(rng) {
    const p = {
      m: [rng.int(1, 6), rng.int(1, 6), rng.int(1, 6)],
      x: [rng.int(0, 3), rng.int(4, 7), rng.int(8, 12)],
      n: rng.int(1, 3),
      a: rng.int(1, 6),
    };
    const plain = round(p.x.reduce((s, v) => s + v, 0) / 3, 2);
    if (new Set(p.m).size === 1 || Math.abs(plain - xbar(p)) < 0.05)
      reject("unequal masses that move the centre");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = xbar(p);
        return A.standard({
          question: [
            `Particles of mass ${p.m[0]} kg, ${p.m[1]} kg and ${p.m[2]} kg are placed on the x-axis at x = ${p.x[0]}, x = ${p.x[1]} and x = ${p.x[2]}.`,
          ],
          ask: "Find the x-coordinate of their centre of mass, to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.CENTRE-MASS",
              value: A.number(round(p.x.reduce((s, x) => s + x, 0) / 3, 2), {
                accuracy: { dp: 2 },
              }),
              feedback: "Weight each position by its mass: x̄ = Σmx/Σm.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\bar{x} = \\frac{${p.m.map((mi, i) => `${mi} \\times ${p.x[i]}`).join(" + ")}}{${p.m.join(" + ")}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = lamina(p);
        const curve = p.n === 1 ? "y = x" : `y = x^${p.n}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A uniform lamina occupies the region between ",
                A.math(curve),
                ", the x-axis and the line ",
                A.math(`x = ${p.a}`),
                ".",
              ],
              ask: "Find the exact x-coordinate of its centre of mass.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "MECH.CENTRE-MASS",
              value: A.exact(toLatex(frac(p.a, 2))),
              feedback:
                "The lamina is not symmetrical about x = a/2: more of its area is near x = a. Use x̄ = ∫xy dx / ∫y dx.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\bar{x} = \\frac{\\int_0^{${p.a}} x^{${p.n + 1}}\\,dx}{\\int_0^{${p.a}} x^{${p.n}}\\,dx} = \\frac{${p.n + 1}}{${p.n + 2}} \\times ${p.a} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Hal says the centre of mass of an object must always be at a point of the object itself.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The centre of mass of a uniform ring is at its centre, where there is no material at all.",
              correct: true,
            },
            {
              text: "True. The mass is all in the object, so its centre must be too.",
              code: "MECH.CENTRE-MASS",
            },
            { text: "True. It is always at the middle of the material.", code: "MECH.CENTRE-MASS" },
          ],
          solution: [
            {
              say: "The same is true of an L-shaped lamina, whose centre of mass can lie outside it.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === xbar(p);
    if (question.key.depth === 2) return exactAnswer(question) === lamina(p);
    return true;
  },
});
