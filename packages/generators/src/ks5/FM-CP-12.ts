/**
 * @statement FM-CP-12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-12: Solve three linear simultaneous equations using matrices and interpret geometrically
// (consistency, planes)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { det3 } from "../shared/mat.ts";

const POINT = "They meet at a single point";
const SHEAF = "They meet in a common line (a sheaf)";
const PRISM = "They form a triangular prism with no common point";

interface Params {
  r1: number[];
  r2: number[];
  d1: number;
  d2: number;
  /** 0 a single point, 1 a sheaf, 2 a prism. */
  kind: number;
  extra: number[];
  a: number;
  u: number[];
}

/** A linear expression in x, y and z. */
const lhs = (r: number[]) =>
  r
    .flatMap((c, i) =>
      c === 0 ? [] : [`${c === 1 ? "" : c === -1 ? "-" : c}${["x", "y", "z"][i]}`],
    )
    .join(" + ")
    .replace(/\+ -/g, "- ");

export default defineGenerator<Params>({
  id: "FM-CP-12",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MAT.SYSTEM", "MAT.DETERMINANT"],

  params(rng) {
    const e = () => rng.int(-3, 4);
    const p = {
      r1: [e(), e(), e()],
      r2: [e(), e(), e()],
      d1: rng.int(-6, 9),
      d2: rng.int(-6, 9),
      kind: rng.int(0, 2),
      extra: [e(), e(), e()],
      a: rng.int(-3, 4),
      u: [rng.int(-2, 4), rng.int(-2, 4)],
    };
    const r3 = p.r1.map((x, i) => x + (p.r2[i] ?? 0));
    const cross = (u: number[], v: number[]) => [
      (u[1] ?? 0) * (v[2] ?? 0) - (u[2] ?? 0) * (v[1] ?? 0),
      (u[2] ?? 0) * (v[0] ?? 0) - (u[0] ?? 0) * (v[2] ?? 0),
      (u[0] ?? 0) * (v[1] ?? 0) - (u[1] ?? 0) * (v[0] ?? 0),
    ];
    const parallel = (u: number[], v: number[]) => cross(u, v).every((x) => x === 0);
    if ([p.r1, p.r2, r3].some((r) => r.filter((x) => x !== 0).length < 2))
      reject("planes using at least two variables");
    if (parallel(p.r1, p.r2) || parallel(p.r1, r3) || parallel(p.r2, r3))
      reject("no two planes parallel");
    if (p.kind === 0 && det3([p.r1, p.r2, p.extra]) === 0) reject("a non-singular system");
    if (p.kind === 0 && p.extra.filter((x) => x !== 0).length < 2)
      reject("planes using at least two variables");
    // Depth 2: det [[1, a, k], u..., ...] = 0 for an integer k.
    const C = (p.u[0] ?? 0) * (p.r2[1] ?? 0) - (p.u[1] ?? 0) * (p.r2[0] ?? 0);
    const rest = 1 * ((p.u[1] ?? 0) * (p.r2[2] ?? 0)) - p.a * ((p.u[0] ?? 0) * (p.r2[2] ?? 0));
    if (C === 0 || rest % C !== 0 || rest === 0 || (p.r2[2] ?? 0) === 0) reject("an integer k ≠ 0");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const r3 = p.r1.map((x, i) => x + (p.r2[i] ?? 0));
    switch (depth) {
      case 1: {
        const third = p.kind === 0 ? p.extra : r3;
        const d3 = p.kind === 2 ? p.d1 + p.d2 + 1 : p.d1 + p.d2;
        const answer = [POINT, SHEAF, PRISM][p.kind] as string;
        const others = [POINT, SHEAF, PRISM].filter((x) => x !== answer);
        return A.choice({
          rng,
          question: [
            "Three planes have equations ",
            A.math(`${lhs(p.r1)} = ${p.d1}`),
            ", ",
            A.math(`${lhs(p.r2)} = ${p.d2}`),
            " and ",
            A.math(`${lhs(third)} = ${d3}`),
            ".",
          ],
          ask: "Which describes how the planes meet?",
          correct: answer,
          distractors: others.map((o) => ({
            content: o,
            code: "MAT.SYSTEM",
            feedback:
              p.kind === 0
                ? "The determinant is not zero, so there is exactly one solution."
                : p.kind === 1
                  ? "The third equation is the sum of the first two, so every point on the line of the first two planes lies on it too."
                  : "The left side of the third equation is the sum of the first two but the right side is not: inconsistent, and no two planes are parallel.",
          })),
          solution: [
            p.kind === 0
              ? {
                  say: `The determinant of the coefficients is ${det3([p.r1, p.r2, p.extra])}, which is not 0.`,
                }
              : {
                  say: `The determinant is 0, since row 3 = row 1 + row 2 on the left. On the right, ${p.d1} + ${p.d2} ${p.kind === 1 ? "=" : "≠"} ${d3}.`,
                },
          ],
        });
      }
      case 2: {
        const C = (p.u[0] ?? 0) * (p.r2[1] ?? 0) - (p.u[1] ?? 0) * (p.r2[0] ?? 0);
        const rest = (p.u[1] ?? 0) * (p.r2[2] ?? 0) - p.a * ((p.u[0] ?? 0) * (p.r2[2] ?? 0));
        const k = -rest / C;
        const row1 = [1, p.a];
        const row2 = [p.u[0] ?? 0, p.u[1] ?? 0, 0];
        const m = [[...row1, k], row2, p.r2];
        const matTex = `\\begin{pmatrix} 1 & ${p.a} & k \\\\ ${row2.join(" & ")} \\\\ ${p.r2.join(" & ")} \\end{pmatrix}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The matrix ", A.math(`\\mathbf{M} = ${matTex}`), " is singular."],
              ask: "Find the value of k.",
            },
          ],
          answer: A.number(k),
          wrong: signedWrongs(k, [
            {
              code: "MAT.DETERMINANT",
              value: A.number(-k),
              feedback: "Set det M = 0, remembering the signs +, −, + along the top row.",
            },
          ]),
          solution: [
            {
              say: "Expand along the top row and set the determinant to 0: ",
              math: `${rest} + ${C}k = 0 \\Rightarrow k = ${k}`,
            },
            { say: `Check: det M = ${det3(m)}.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dev says that if the determinant of the coefficient matrix is 0, three simultaneous equations have no solutions.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A zero determinant means there is no unique solution: the equations may be inconsistent (no solutions) or consistent with infinitely many (a sheaf or coincident planes).",
              correct: true,
            },
            {
              text: "True. The inverse does not exist, so nothing solves the equations.",
              code: "MAT.SYSTEM",
            },
            { text: "True. Zero determinant means the planes are parallel.", code: "MAT.SYSTEM" },
          ],
          solution: [
            {
              say: "For example x + y + z = 1, x − y = 0, 2x + z = 1 has det 0 but a whole line of solutions.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === [POINT, SHEAF, PRISM][p.kind];
    if (question.key.depth === 2) {
      const C = (p.u[0] ?? 0) * (p.r2[1] ?? 0) - (p.u[1] ?? 0) * (p.r2[0] ?? 0);
      const rest = (p.u[1] ?? 0) * (p.r2[2] ?? 0) - p.a * ((p.u[0] ?? 0) * (p.r2[2] ?? 0));
      const k = -rest / C;
      return (
        numberAnswer(question) === k &&
        det3([[1, p.a, k], [p.u[0] ?? 0, p.u[1] ?? 0, 0], p.r2]) === 0
      );
    }
    return true;
  },
});
