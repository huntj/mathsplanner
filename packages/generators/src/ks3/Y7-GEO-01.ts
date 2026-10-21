/**
 * @statement Y7-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-GEO-01: Derive and apply formulae to calculate and solve problems involving perimeter and area
// of triangles, parallelograms and trapezia
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { trapezium } from "../shared/mea.ts";

interface Params {
  a: number;
  b: number;
  h: number;
  offset: number;
  /** Depth 2: a parallelogram's base and height. */
  base: number;
  height: number;
  /** Depth 5: a house shape, a rectangle with a triangle on top. */
  w: number;
  wall: number;
  roof: number;
}

/** A rectangle with an isosceles triangle on top, the triangle's height dashed. */
const house = (w: number, wall: number, roof: number): GeometrySpec => ({
  type: "geometry",
  points: {
    A: [0, 0],
    B: [w, 0],
    C: [w, wall],
    E: [w / 2, wall + roof],
    D: [0, wall],
    M: [w / 2, wall],
  },
  polygons: [{ vertices: ["A", "B", "C", "E", "D"] }],
  segments: [
    { from: "A", to: "B", label: `${w}\\text{ m}`, length: w },
    { from: "B", to: "C", label: `${wall}\\text{ m}`, length: wall },
    { from: "D", to: "C", dashed: true },
    { from: "M", to: "E", label: `${roof}\\text{ m}`, length: roof, dashed: true },
  ],
  angles: [{ vertex: "M", from: "C", to: "E", right: true }],
  description: `A rectangle ${w} m by ${wall} m with a triangle ${roof} m tall on top.`,
});

export default defineGenerator<Params>({
  id: "Y7-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: [
    "MEA.AREA.TRAPEZIUM-HALF",
    "MEA.AREA.TRIANGLE-HALF",
    "MEA.PERIMETER.AREA",
    "AS.MULTISTEP.ONE-STEP",
  ],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 16;
    const b = rng.int(6, top);
    const a = rng.int(2, b - 2);
    const h = rng.int(3, top - 2);
    const offset = rng.int(1, Math.max(1, b - a - 1));
    if ((a + b) % 2 !== 0 && numbers === "friendly") reject("a whole-number area");
    if (offset + a > b || h > 1.5 * b || h * 2.5 < b) reject("a trapezium that looks like one");
    const w = rng.int(3, 8) * 2;
    return {
      a,
      b,
      h,
      offset,
      base: rng.int(4, 15),
      height: rng.int(3, 12),
      w,
      wall: rng.int(3, 8),
      roof: rng.int(3, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const area = ((p.a + p.b) / 2) * p.h;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(trapezium(p.a, p.b, p.h, p.offset))],
          ask: "What is the area of the trapezium?",
          answer: A.number(area, { units: "cm²" }),
          wrong: wrongs(area, [
            {
              code: "MEA.AREA.TRAPEZIUM-HALF",
              value: A.number((p.a + p.b) * p.h, { units: "cm²" }),
              feedback: "Two copies of the trapezium make a parallelogram, so halve: ½(a + b)h.",
            },
          ]),
          solution: [{ say: `Area = ½(a + b)h = ½ × (${p.a} + ${p.b}) × ${p.h} = ${area} cm².` }],
        });
      case 2: {
        const ar = p.base * p.height;
        return A.missingValue({
          intro: `A parallelogram has an area of ${ar} cm² and a base of ${p.base} cm. Find its perpendicular height.`,
          relation: [p.base, "\\times", p.height, "=", ar],
          hide: 2,
          units: "cm",
          wrong: wrongs(p.height, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number((2 * ar) / p.base, { units: "cm" }),
              feedback: "A parallelogram's area is base × height, with no halving.",
            },
          ]),
          solution: [{ say: `${ar} ÷ ${p.base} = ${p.height} cm.` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question:
            "Match each shape to the formula for its area, where b is the base, h the perpendicular height, and a and b the parallel sides.",
          pairs: [
            ["triangle", A.math("\\frac{1}{2}bh")],
            ["parallelogram", A.math("bh")],
            ["trapezium", A.math("\\frac{1}{2}(a + b)h")],
          ],
          solution: [
            {
              say: "A triangle is half a parallelogram, and two trapezia make a parallelogram with base a + b.",
            },
          ],
        });
      case 4: {
        const truth = rng.bool();
        const ar = truth ? area : (p.a + p.b) * p.h;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(trapezium(p.a, p.b, p.h, p.offset)),
            `Sam says the area is (${p.a} + ${p.b}) × ${p.h}${truth ? " ÷ 2" : ""} = ${ar} cm².`,
          ],
          truth,
          reasons: truth
            ? [
                {
                  text: "True. Two of these trapezia fit together to make a parallelogram, so the area is half of (a + b) × h.",
                  correct: true,
                },
                {
                  text: "False. You do not halve for a trapezium.",
                  code: "MEA.AREA.TRAPEZIUM-HALF",
                },
                { text: "False. Multiply all four sides together." },
              ]
            : [
                {
                  text: `False. That is the area of two trapezia. Halve it: ${area} cm².`,
                  correct: true,
                },
                {
                  text: "True. Area is the sum of the parallel sides times the height.",
                  code: "MEA.AREA.TRAPEZIUM-HALF",
                },
                { text: "True. You only halve for triangles.", code: "MEA.AREA.TRAPEZIUM-HALF" },
              ],
          solution: [{ say: `½ × (${p.a} + ${p.b}) × ${p.h} = ${area} cm².` }],
        });
      }
      default: {
        const rect = p.w * p.wall;
        const tri = (p.w * p.roof) / 2;
        return A.multiStepContext({
          context: [
            `The end wall of a shed is a rectangle ${p.w} m wide and ${p.wall} m tall, with a triangle on top that is ${p.roof} m tall.`,
            A.figure(house(p.w, p.wall, p.roof)),
          ],
          parts: [
            {
              ask: "What is the area of the triangle?",
              answer: A.number(tri, { units: "m²" }),
              wrong: wrongs(tri, [
                {
                  code: "MEA.AREA.TRIANGLE-HALF",
                  value: A.number(p.w * p.roof, { units: "m²" }),
                  feedback: "A triangle's area is half of base × height.",
                },
              ]),
            },
            {
              ask: "What is the area of the whole end wall?",
              answer: A.number(rect + tri, { units: "m²" }),
              wrong: wrongs(rect + tri, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(rect, { units: "m²" }),
                  feedback: "Add the triangle to the rectangle.",
                },
              ]),
            },
          ],
          solution: [
            { say: `Triangle: ½ × ${p.w} × ${p.roof} = ${tri} m².` },
            { say: `Rectangle: ${p.w} × ${p.wall} = ${rect} m². Total: ${rect + tri} m².` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === ((p.a + p.b) / 2) * p.h;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.height;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === p.w * p.wall + (p.w * p.roof) / 2;
    return true;
  },
});
