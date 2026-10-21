/**
 * @statement Y4-MEA-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-03: Find the area of rectilinear shapes by counting squares
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { lVertices, onGrid, polygonArea, polygonPerimeter } from "../shared/mea.ts";

interface Params {
  W: number;
  H: number;
  a: number;
  b: number;
  /** A second shape for comparing. */
  W2: number;
  H2: number;
}

const L = (W: number, H: number, a: number, b: number): Coord[] => lVertices(W, H, a, b);
const rect = (W: number, H: number): Coord[] => [
  [0, 0],
  [W, 0],
  [W, H],
  [0, H],
];
const area = (v: Coord[]) => polygonArea(v);

export default defineGenerator<Params>({
  id: "Y4-MEA-03",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.PERIMETER.AREA"],

  params(rng, numbers) {
    const W = rng.int(3, numbers === "friendly" ? 4 : 6);
    const H = rng.int(3, numbers === "friendly" ? 4 : 5);
    const a = rng.int(1, W - 1);
    const b = rng.int(1, H - 1);
    const shape = L(W, H, a, b);
    if (polygonPerimeter(shape) === area(shape)) reject("an area that differs from the perimeter");
    const W2 = rng.int(2, 6);
    const H2 = rng.int(2, 5);
    if (W2 === H2) reject("a non-square second shape");
    return { W, H, a, b, W2, H2 };
  },

  build(p, depth, rng): QuestionDraft {
    const shape = L(p.W, p.H, p.a, p.b);
    const n = area(shape);
    const per = polygonPerimeter(shape);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "The shape is drawn on a grid of centimetre squares.",
            A.figure(onGrid([shape], "An L-shape drawn on a grid of centimetre squares.")),
          ],
          ask: "What is the area of the shape, in square centimetres?",
          answer: A.number(n, { units: "cm²" }),
          wrong: wrongs(n, [
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(per, { units: "cm²" }),
              feedback: "That is the distance round the edge. Area counts the squares inside.",
            },
          ]),
          solution: [{ say: `Count the squares inside: ${n}, so the area is ${n} cm².` }],
        });
      case 2:
        return A.missingValue({
          intro: `A rectangle on a centimetre grid covers ${p.W2 * p.H2} squares. It is ${p.W2} squares long. How many squares wide is it?`,
          relation: [p.W2, "\\times", p.H2, "=", p.W2 * p.H2],
          hide: 2,
          wrong: wrongs(p.H2, [
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number((p.W2 * p.H2) / 2 - p.W2),
              feedback: "The area is rows times columns, not the distance round.",
            },
          ]),
          solution: [{ say: `${p.W2} × ${p.H2} = ${p.W2 * p.H2}, so it is ${p.H2} squares wide.` }],
        });
      case 3: {
        const target = n;
        // A rectangle whose perimeter equals the target area, and one that is one square out.
        const decoys: Coord[][] = [];
        for (let w = 1; w <= 8 && decoys.length < 1; w++)
          for (let h = 1; h <= 6; h++)
            if (2 * (w + h) === target && w * h !== target) decoys.push(rect(w, h));
        const off = rect(p.W, p.H);
        return A.chooseTheDiagram({
          rng,
          question: [
            `Which shape has an area of ${target} square centimetres? Each square is 1 cm².`,
          ],
          correct: onGrid([shape], "A shape drawn on a centimetre grid."),
          distractors: [
            ...decoys.map((v) => ({
              figure: onGrid([v], "A shape drawn on a centimetre grid.") as CartesianSpec,
              code: "MEA.PERIMETER.AREA",
              feedback: `That shape has a perimeter of ${target} cm, but an area of ${area(v)} cm².`,
            })),
            ...(area(off) === target
              ? []
              : [
                  {
                    figure: onGrid([off], "A shape drawn on a centimetre grid."),
                    feedback: `Count the squares: that shape covers ${area(off)}.`,
                  },
                ]),
          ],
          solution: [{ say: `Count the squares inside each shape: the L-shape covers ${target}.` }],
        });
      }
      default: {
        const r = rect(p.W2, p.H2);
        const truth = area(r) === n;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Each square is 1 cm².",
            A.figure(onGrid([shape, r], "An L-shape and a rectangle drawn on a centimetre grid.")),
            `Asha says the two shapes have the same area.`,
          ],
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. The L-shape covers ${n} squares and the rectangle covers ${area(r)}.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. ${per === polygonPerimeter(r) ? "They have the same perimeter, so they have the same area." : "Shapes that look different always have different areas."}`,
              code: "MEA.PERIMETER.AREA",
            },
            { text: `${truth ? "False" : "True"}. The taller shape always has the bigger area.` },
          ],
          solution: [{ say: `L-shape: ${n} cm². Rectangle: ${p.W2} × ${p.H2} = ${area(r)} cm².` }],
        });
      }
    }
  },

  verify(p, question) {
    const n = area(L(p.W, p.H, p.a, p.b));
    if (question.archetype === "standard") return numberAnswer(question) === n;
    if (question.archetype === "choose-the-diagram") {
      const fig = chosenFigure(question) as CartesianSpec | undefined;
      return area(fig?.polygons?.[0]?.vertices ?? []) === n;
    }
    return true;
  },
});
