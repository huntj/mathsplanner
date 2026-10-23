/**
 * @statement FM-CP-22
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-22: Use vector and Cartesian equations of lines and planes; use the scalar product
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { deg } from "../shared/trig.ts";
import { col, mag, type Vec } from "../shared/vec.ts";

export interface Params {
  n: Vec;
  a: Vec;
  u: Vec;
  v: Vec;
}

const dot = (x: Vec, y: Vec) => x.reduce((s, xi, i) => s + xi * (y[i] ?? 0), 0);
const r1 = (x: number) => Math.round(x * 10) / 10;

/** The acute angle between lines with directions u and v, in degrees to 1 dp. */
const acute = (u: Vec, v: Vec) => r1(deg(Math.acos(Math.abs(dot(u, v)) / (mag(u) * mag(v)))));

export default defineGenerator<Params>({
  id: "FM-CP-22",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.PLANE", "GEO.VECTOR.ANGLE"],

  params(rng) {
    const e = () => rng.int(-4, 5);
    const p = { n: [e(), e(), e()], a: [e(), e(), e()], u: [e(), e(), e()], v: [e(), e(), e()] };
    if (p.n.includes(0) || dot(p.n, p.a) === 0) reject("a plane with every variable and d ≠ 0");
    if (mag(p.u) === 0 || mag(p.v) === 0 || dot(p.u, p.v) >= 0)
      reject("directions at an obtuse angle");
    const t = acute(p.u, p.v);
    if (!(t >= 10 && t <= 80)) reject("a clear acute angle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = dot(p.n, p.a);
        const [nx, ny, nz] = p.n as [number, number, number];
        const lhs =
          `${nx}x ${ny < 0 ? "-" : "+"} ${Math.abs(ny)}y ${nz < 0 ? "-" : "+"} ${Math.abs(nz)}z`.replace(
            /(^|[-+] )1([xyz])/g,
            "$1$2",
          );
        return A.standard({
          question: [
            "A plane has normal ",
            A.math(col(p.n)),
            " and passes through the point ",
            A.math(`(${p.a.join(", ")})`),
            ". Its equation is ",
            A.math(`${lhs} = d`),
            ".",
          ],
          ask: "Find d.",
          answer: A.number(d),
          wrong: signedWrongs(d, [
            {
              code: "GEO.VECTOR.PLANE",
              value: A.number(-d),
              feedback: "Substitute the point: d = n · a, with no change of sign in this form.",
            },
          ]),
          solution: [{ say: "", math: `d = ${col(p.n)} \\cdot ${col(p.a)} = ${d}` }],
        });
      }
      case 2: {
        const t = acute(p.u, p.v);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Two lines have direction vectors ",
                A.math(col(p.u)),
                " and ",
                A.math(col(p.v)),
                ".",
              ],
              ask: "Find the acute angle between the lines, in degrees to 1 decimal place.",
            },
          ],
          answer: A.number(t, { units: "°", accuracy: { dp: 1 } }),
          wrong: signedWrongs(t, [
            {
              code: "GEO.VECTOR.ANGLE",
              value: A.number(r1(180 - t), { units: "°", accuracy: { dp: 1 } }),
              feedback:
                "The scalar product is negative, which gives the obtuse angle: subtract from 180°.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\cos\\theta = \\frac{|${dot(p.u, p.v)}|}{\\sqrt{${dot(p.u, p.u)}}\\sqrt{${dot(p.v, p.v)}}}`,
            },
            { say: `θ = ${t}°.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Nia says the vector ",
            A.math(col(p.n)),
            " lies in the plane ",
            A.math(
              `${p.n[0]}x + ${p.n[1]}y + ${p.n[2]}z = ${dot(p.n, p.a)}`.replace(/\+ -/g, "- "),
            ),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The coefficients of x, y and z give a normal: it is perpendicular to the plane.",
              correct: true,
            },
            {
              text: "True. The coefficients give a direction in the plane.",
              code: "GEO.VECTOR.PLANE",
            },
            {
              text: "True. Every vector made from the equation lies in the plane.",
              code: "GEO.VECTOR.PLANE",
            },
          ],
          solution: [
            {
              say: "r · n = d describes every point whose position vector has the same component along n.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === dot(p.n, p.a);
    if (question.key.depth === 2) return numberAnswer(question) === acute(p.u, p.v);
    return true;
  },
});
