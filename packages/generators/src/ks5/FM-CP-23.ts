/**
 * @statement FM-CP-23
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-23: Find intersections, angles and shortest distances between points, lines and planes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { deg } from "../shared/trig.ts";
import { col, mag, type Vec } from "../shared/vec.ts";

/** Normals with whole-number lengths. */
const NORMALS: Vec[] = [
  [1, 2, 2],
  [2, 3, 6],
  [1, 4, 8],
  [2, 6, 9],
  [4, 4, 7],
  [2, -1, 2],
  [6, -2, 3],
];

interface Params {
  ni: number;
  p: Vec;
  k: number;
  u: Vec;
}

const dot = (x: Vec, y: Vec) => x.reduce((s, xi, i) => s + xi * (y[i] ?? 0), 0);
const r1 = (x: number) => Math.round(x * 10) / 10;
const normal = (i: number) => NORMALS[i] ?? [1, 2, 2];
/** The angle between a line with direction u and a plane with normal n. */
const lineToPlane = (u: Vec, n: Vec) => r1(deg(Math.asin(Math.abs(dot(u, n)) / (mag(u) * mag(n)))));

const plane = (n: Vec, d: number) =>
  `${n
    .map(
      (c, i) => `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${["x", "y", "z"][i]}`,
    )
    .join(" ")
    .replace(/^\+ /, "")} = ${d}`;

export default defineGenerator<Params>({
  id: "FM-CP-23",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.PLANE", "GEO.VECTOR.ANGLE"],

  params(rng) {
    const e = () => rng.int(-4, 5);
    const p = {
      ni: rng.int(0, NORMALS.length - 1),
      p: [e(), e(), e()],
      k: rng.pick([-1, 1]) * rng.int(1, 5),
      u: [e(), e(), e()],
    };
    if (mag(p.u) === 0) reject("a direction");
    const t = lineToPlane(p.u, normal(p.ni));
    if (!(t >= 10 && t <= 80)) reject("a clear angle with the plane");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const n = normal(p.ni);
    const N = mag(n);
    switch (depth) {
      case 1: {
        const d = dot(n, p.p) - p.k * N;
        const dist = Math.abs(p.k);
        return A.standard({
          question: [
            "Find the shortest distance from the point ",
            A.math(`(${p.p.join(", ")})`),
            " to the plane ",
            A.math(plane(n, d)),
            ".",
          ],
          answer: A.number(dist),
          wrong: wrongs(dist, [
            {
              code: "GEO.VECTOR.PLANE",
              value: A.number(dist * N),
              feedback: `Divide by the length of the normal, √(${dot(n, n)}) = ${N}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{|${dot(n, p.p)} - ${d}|}{\\sqrt{${dot(n, n)}}} = \\frac{${dist * N}}{${N}} = ${dist}`,
            },
          ],
        });
      }
      case 2: {
        const t = lineToPlane(p.u, n);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A line has direction ",
                A.math(col(p.u)),
                " and a plane has equation ",
                A.math(plane(n, 0)),
                ".",
              ],
              ask: "Find the acute angle between the line and the plane, in degrees to 1 decimal place.",
            },
          ],
          answer: A.number(t, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(t, [
            {
              code: "GEO.VECTOR.ANGLE",
              value: A.number(r1(90 - t), { units: "°", accuracy: { dp: 1 } }),
              feedback:
                "The scalar product gives the angle with the normal; the angle with the plane is 90° minus that.",
            },
          ]),
          solution: [
            {
              say: "The angle with the normal: ",
              math: `\\cos\\phi = \\frac{|${dot(p.u, n)}|}{\\sqrt{${dot(p.u, p.u)}} \\times ${N}}`,
            },
            { say: `The angle with the plane is 90° − φ = ${t}°.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Oli says that two lines in three dimensions that are not parallel must intersect.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. In three dimensions, non-parallel lines can miss each other: these are skew lines.",
              correct: true,
            },
            {
              text: "True. Lines that are not parallel always cross somewhere.",
              code: "GEO.VECTOR.ANGLE",
            },
            {
              text: "True. Their direction vectors are different, so they meet.",
              code: "GEO.VECTOR.ANGLE",
            },
          ],
          solution: [
            {
              say: "Check by solving for the parameters: if the three equations are inconsistent, the lines are skew.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Math.abs(p.k);
    if (question.key.depth === 2) return numberAnswer(question) === lineToPlane(p.u, normal(p.ni));
    return true;
  },
});
