/**
 * @statement Y3-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-02: Measure the perimeter of simple 2-D shapes
import * as A from "@mathsplanner/archetypes";
import { triangleSSS } from "@mathsplanner/diagrams";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { onGrid } from "../shared/mea.ts";

interface Params {
  w: number;
  h: number;
  sides: [number, number, number];
  area: number;
}

const rectOnGrid = (w: number, h: number) =>
  onGrid(
    [
      [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ],
    ],
    "A rectangle drawn on a grid of centimetre squares.",
  );

function labelledTriangle([a, b, c]: [number, number, number]): GeometrySpec {
  const pts = triangleSSS(a, b, c);
  return {
    type: "geometry",
    points: pts,
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      { from: "A", to: "B", label: `${a}\\text{ cm}`, length: a },
      { from: "B", to: "C", label: `${b}\\text{ cm}`, length: b },
      { from: "C", to: "A", label: `${c}\\text{ cm}`, length: c },
    ],
    description: `A triangle with sides ${a} cm, ${b} cm and ${c} cm.`,
  };
}

export default defineGenerator<Params>({
  id: "Y3-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.PERIMETER.AREA", "MEA.AREA.SAME-PERIMETER"],

  params(rng, numbers) {
    const w = rng.int(2, numbers === "friendly" ? 5 : 8);
    const h = rng.int(1, numbers === "friendly" ? 4 : 6);
    if (w === h || w * h === 2 * (w + h)) reject("a rectangle whose area and perimeter differ");
    const a = rng.int(4, 12);
    const b = rng.int(4, 12);
    const c = rng.int(4, 12);
    if (a >= b + c || b >= a + c || c >= a + b || Math.min(a, b, c) * 2 < Math.max(a, b, c))
      reject("a sensible triangle");
    return { w, h, sides: [a, b, c], area: rng.pick([4, 6, 8, 12]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const per = 2 * (p.w + p.h);
        return A.standard({
          question: ["Each square is 1 cm long.", A.figure(rectOnGrid(p.w, p.h))],
          ask: "What is the perimeter of the rectangle?",
          answer: A.number(per, { units: "cm" }),
          wrong: wrongs(per, [
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(p.w * p.h, { units: "cm" }),
              feedback:
                "That counts the squares inside. Perimeter is the distance all the way round the edge.",
            },
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(p.w + p.h, { units: "cm" }),
              feedback: "Go all the way round: there are four sides.",
            },
          ]),
          solution: [{ say: `${p.w} + ${p.h} + ${p.w} + ${p.h} = ${per} cm.` }],
        });
      }
      case 2: {
        const per = p.sides[0] + p.sides[1] + p.sides[2];
        return A.standard({
          question: [A.figure(labelledTriangle(p.sides))],
          ask: "What is the perimeter of the triangle?",
          answer: A.number(per, { units: "cm" }),
          solution: [{ say: `Add the three sides: ${p.sides.join(" + ")} = ${per} cm.` }],
        });
      }
      default: {
        // Two rectangles with the same number of squares.
        const pairs: Record<number, [number, number][]> = {
          4: [
            [2, 2],
            [4, 1],
          ],
          6: [
            [3, 2],
            [6, 1],
          ],
          8: [
            [4, 2],
            [8, 1],
          ],
          12: [
            [4, 3],
            [6, 2],
          ],
        };
        const [[a, b], [c, d]] = (pairs[p.area] ?? [
          [2, 2],
          [4, 1],
        ]) as [[number, number], [number, number]];
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Each square is 1 cm long. Both rectangles cover the same number of squares.",
            A.figure(
              onGrid(
                [
                  [
                    [0, 0],
                    [a, 0],
                    [a, b],
                    [0, b],
                  ],
                  [
                    [0, 0],
                    [c, 0],
                    [c, d],
                    [0, d],
                  ],
                ],
                "Two rectangles drawn on a grid of centimetre squares.",
              ),
            ),
            "Ola says they must have the same perimeter.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The perimeters are ${2 * (a + b)} cm and ${2 * (c + d)} cm. Covering the same squares does not mean the same distance round.`,
              correct: true,
            },
            {
              text: "True. Same squares inside means the same perimeter.",
              code: "MEA.AREA.SAME-PERIMETER",
            },
            { text: `True. Both perimeters are ${p.area} cm.`, code: "MEA.PERIMETER.AREA" },
          ],
          solution: [
            {
              say: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm and ${c} + ${d} + ${c} + ${d} = ${2 * (c + d)} cm.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === 2 * (p.w + p.h) || n === p.sides[0] + p.sides[1] + p.sides[2];
  },
});
