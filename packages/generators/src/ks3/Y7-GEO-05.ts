/**
 * @statement Y7-GEO-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// Y7-GEO-05: Apply the properties of angles at a point, on a straight line, and vertically
// opposite angles
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  expression,
  reject,
  signed,
  type QuestionDraft,
} from "@mathsplanner/core";
import { anglesAtPoint, anglesOnLine, crossingLines } from "@mathsplanner/diagrams";
import { deg, wrongs } from "../shared/angles.ts";

/** An angle written k·x + c. */
interface Expr {
  k: number;
  c: number;
}

interface Params {
  x: number;
  /** Two angles on a straight line. */
  line: [Expr, Expr];
  /** Three angles at a point. */
  point: [Expr, Expr, Expr];
  /** Two vertically opposite angles (equal), with different coefficients. */
  opposite: [Expr, Expr];
}

const value = (e: Expr, x: number) => e.k * x + e.c;
const latex = (e: Expr) =>
  expression([
    [e.k, "x"],
    [e.c, ""],
  ]);
const reasonable = (v: number) => v >= 25 && v <= 160 && v !== 90;

export default defineGenerator<Params>({
  id: "Y7-GEO-05",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "GEO.ANGLES.STRAIGHT-LINE-360",
    "GEO.ANGLES.POINT-180",
    "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
  ],

  params(rng, numbers) {
    const x =
      numbers === "friendly" ? rng.int(2, 8) * 5 : rng.int(numbers === "standard" ? 12 : 11, 40);
    const k = () => rng.int(2, numbers === "stretch" ? 7 : 5);
    const c = () =>
      rng.pick([-1, 1]) *
      rng.int(1, numbers === "friendly" ? 3 : 6) *
      (numbers === "stretch" ? 3 : 5);
    // Straight line: the second constant is whatever makes 180°.
    const l1 = { k: k(), c: c() };
    const l2k = k();
    const line: [Expr, Expr] = [l1, { k: l2k, c: 180 - value(l1, x) - l2k * x }];
    // At a point: the third constant makes 360°.
    const p1 = { k: k(), c: c() };
    const p2 = { k: k(), c: c() };
    const p3k = k();
    const point: [Expr, Expr, Expr] = [
      p1,
      p2,
      { k: p3k, c: 360 - value(p1, x) - value(p2, x) - p3k * x },
    ];
    // Vertically opposite: k1·x + c1 = k2·x + c2 with k1 ≠ k2.
    const o1 = { k: k(), c: c() };
    let o2k = k();
    if (o2k === o1.k) o2k = o1.k + 1;
    const opposite: [Expr, Expr] = [o1, { k: o2k, c: value(o1, x) - o2k * x }];
    return { x, line, point, opposite };
  },

  accept: (p) =>
    p.line.every((e) => reasonable(value(e, p.x))) &&
    p.point.every((e) => reasonable(value(e, p.x))) &&
    p.opposite.every((e) => reasonable(value(e, p.x))) &&
    [...p.line, ...p.point, ...p.opposite].every((e) => e.c !== 0 && Math.abs(e.c) <= 90),

  build(p, depth, rng): QuestionDraft {
    const ask = ["Work out the value of ", A.math("x"), "."];
    switch (depth) {
      case 1: {
        const [a, b] = p.line;
        const ks = a.k + b.k;
        const cs = a.c + b.c;
        const wrong360 = (360 - cs) / ks;
        return A.standard({
          question: [
            "The diagram shows two angles on a straight line.",
            A.figure(anglesOnLine(p.line.map((e) => ({ value: value(e, p.x), label: latex(e) })))),
          ],
          ask,
          answer: A.number(p.x),
          wrong: wrongs(p.x, [
            Number.isInteger(wrong360)
              ? {
                  code: "GEO.ANGLES.STRAIGHT-LINE-360",
                  value: A.number(wrong360),
                  feedback: "Angles on a straight line add up to 180°, not 360°.",
                }
              : undefined,
          ]),
          solution: [
            {
              say: "Angles on a straight line add up to 180°.",
              math: `${latex(a)} + ${latex(b)} = 180`,
            },
            {
              say: "Collect like terms.",
              math: `${expression([
                [ks, "x"],
                [cs, ""],
              ])} = 180`,
            },
            {
              say:
                cs === 0
                  ? "Divide."
                  : `${cs > 0 ? "Subtract" : "Add"} ${Math.abs(cs)}, then divide by ${ks}.`,
              math: `x = ${(180 - cs) / ks}`,
            },
          ],
        });
      }
      case 2: {
        const ks = p.point.reduce((s, e) => s + e.k, 0);
        const cs = p.point.reduce((s, e) => s + e.c, 0);
        const wrong180 = (180 - cs) / ks;
        return A.standard({
          question: [
            "The diagram shows three angles at a point.",
            A.figure(
              anglesAtPoint(p.point.map((e) => ({ value: value(e, p.x), label: latex(e) }))),
            ),
          ],
          ask,
          answer: A.number(p.x),
          wrong: wrongs(p.x, [
            Number.isInteger(wrong180) && wrong180 > 0
              ? {
                  code: "GEO.ANGLES.POINT-180",
                  value: A.number(wrong180),
                  feedback: "Angles at a point add up to 360°, not 180°.",
                }
              : undefined,
          ]),
          solution: [
            {
              say: "Angles at a point add up to 360°.",
              math: `${p.point.map(latex).join(" + ")} = 360`,
            },
            {
              say: "Collect like terms.",
              math: `${expression([
                [ks, "x"],
                [cs, ""],
              ])} = 360`,
            },
            { say: "Solve for x.", math: `x = ${(360 - cs) / ks}` },
          ],
        });
      }
      case 4: {
        // Working with one wrong step: the constant moved across without changing sign.
        const [a, b] = p.line;
        const ks = a.k + b.k;
        const cs = a.c + b.c;
        if (cs === 0) reject("no constant to move");
        const wrongRhs = 180 + cs;
        return A.spotTheMistake({
          question: [
            "Two angles on a straight line are ",
            A.math(latex(a)),
            " and ",
            A.math(latex(b)),
            ". Sam works out x:",
          ],
          lines: [
            [A.math(`${latex(a)} + ${latex(b)} = 180`)],
            [
              A.math(
                `${expression([
                  [ks, "x"],
                  [cs, ""],
                ])} = 180`,
              ),
            ],
            [A.math(`${ks}x = 180 ${signed(cs)}`)],
            [
              A.math(
                `x = ${Number.isInteger(wrongRhs / ks) ? wrongRhs / ks : `\\frac{${wrongRhs}}{${ks}}`}`,
              ),
            ],
          ],
          mistake: 2,
          feedback: `Line 3 is wrong: to undo ${signed(cs).replace(" ", "")} on the left, ${cs > 0 ? "subtract" : "add"} ${Math.abs(cs)} on the right, giving ${ks}x = ${180 - cs}.`,
          solution: [
            {
              say: `Line 3 is the first mistake: ${cs > 0 ? "subtract" : "add"} ${Math.abs(cs)} from both sides.`,
              math: `${ks}x = ${180 - cs}`,
            },
            { say: "Then divide.", math: `x = ${p.x}` },
          ],
        });
      }
      default: {
        // Vertically opposite angles are equal; then the angle next to them makes a straight line.
        const [a, b] = p.opposite;
        const angle = value(a, p.x);
        const spec = crossingLines(angle, rng.int(5, 35));
        return A.multiStepContext({
          context: [
            "Two straight lines cross. Two vertically opposite angles are marked.",
            A.figure({
              ...spec,
              angles: [
                { vertex: "O", from: "A", to: "C", value: angle, label: latex(a) },
                { vertex: "O", from: "B", to: "D", value: angle, label: latex(b) },
                { vertex: "O", from: "C", to: "B", value: 180 - angle, label: "y" },
              ],
            }),
          ],
          parts: [
            {
              ask: ["Work out the value of ", A.math("x"), "."],
              answer: A.number(p.x),
            },
            {
              ask: ["Work out the size of angle ", A.math("y"), "."],
              answer: A.degrees(180 - angle),
              wrong: wrongs(180 - angle, [
                {
                  code: "GEO.ANGLES.VERT-OPP-SUPPLEMENTARY",
                  value: A.degrees(angle),
                  feedback:
                    "Angle y is next to the marked angle, on a straight line, not opposite it.",
                },
              ]),
            },
          ],
          solution: [
            { say: "Vertically opposite angles are equal.", math: `${latex(a)} = ${latex(b)}` },
            { say: "Solve for x.", math: `x = ${p.x}` },
            {
              say: "So each marked angle is",
              math: `${latex(a).replace(/x/g, `\\times ${p.x}`)} = ${deg(angle)}`,
            },
            {
              say: "Angle y is on a straight line with it.",
              math: `y = 180^\\circ - ${deg(angle)} = ${deg(180 - angle)}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    // Substitute the answer back into the expressions.
    const x = question.parts[0]?.answer;
    if (x?.type !== "number") return true;
    if (question.archetype === "spot-the-mistake")
      return p.line.reduce((s, e) => s + value(e, p.x), 0) === 180;
    if (question.parts.length === 2) {
      const y = question.parts[1]?.answer;
      return (
        value(p.opposite[0], x.value) === value(p.opposite[1], x.value) &&
        y?.type === "number" &&
        y.value + value(p.opposite[0], x.value) === 180
      );
    }
    const exprs =
      question.diagrams[0] &&
      Array.isArray(question.diagrams[0].angles) &&
      (question.diagrams[0].angles as unknown[]).length === 3
        ? p.point
        : p.line;
    const total = exprs.length === 3 ? 360 : 180;
    return exprs.reduce((s, e) => s + value(e, x.value), 0) === total;
  },

  bounds: { friendly: { min: 1, dp: 0 }, standard: { min: 1, dp: 0 }, stretch: { min: 1, dp: 0 } },
});
