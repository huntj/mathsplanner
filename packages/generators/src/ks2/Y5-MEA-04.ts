/**
 * @statement Y5-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-04: Calculate and compare the area of rectangles (including squares), and including using
// standard units, square centimetres (cm²) and square metres (m²) and estimate the area of irregular
// shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { rectangle } from "../shared/mea.ts";

export interface Params {
  l: number;
  w: number;
  unit: "cm" | "m";
  s: number;
}

const dims = (g: GeometrySpec | undefined) => (g?.segments ?? []).map((s) => s.length ?? 0);

export default defineGenerator<Params>({
  id: "Y5-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.PERIMETER.AREA", "MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : numbers === "standard" ? 15 : 25;
    const l = rng.int(3, top);
    const w = rng.int(2, top);
    if (l <= w || l > 3 * w || l * w === 2 * (l + w))
      reject("a rectangle whose area and perimeter differ");
    // A square with nearly the same area, for comparing.
    const s = Math.round(Math.sqrt(l * w)) + rng.pick([-1, 0, 1]);
    if (s * s === l * w || s < 2) reject("a square of a different area");
    return { l, w, unit: rng.pick(["cm", "m"] as const), s };
  },

  build(p, depth, rng): QuestionDraft {
    const area = p.l * p.w;
    const u2 = `${p.unit}²`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(rectangle(p.l, p.w, p.unit))],
          ask: "What is the area of the rectangle?",
          answer: A.number(area, { units: u2 }),
          wrong: wrongs(area, [
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(2 * (p.l + p.w), { units: u2 }),
              feedback: "That is the perimeter. Area is length × width.",
            },
          ]),
          solution: [{ say: `${p.l} × ${p.w} = ${area} ${u2}.` }],
        });
      case 2:
        return A.missingValue({
          intro: `A rectangle has an area of ${area} ${u2}. It is ${p.l} ${p.unit} long. How wide is it?`,
          relation: [p.l, "\\times", p.w, "=", area],
          hide: 2,
          units: p.unit,
          wrong: wrongs(p.w, [
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(area - p.l, { units: p.unit }),
              feedback: "Area is length × width, so divide the area by the length.",
            },
          ]),
          solution: [{ say: `${area} ÷ ${p.l} = ${p.w} ${p.unit}.` }],
        });
      case 3: {
        // A rectangle whose perimeter is the target area, if there is one.
        const decoy: [number, number] | undefined = (() => {
          for (let w = 2; w < area / 2; w++) {
            const l = area / 2 - w;
            if (l > w && l <= 3 * w && Number.isInteger(l) && l * w !== area) return [l, w];
          }
          return undefined;
        })();
        const other: [number, number] = [p.l + 1, p.w];
        return A.chooseTheDiagram({
          rng,
          question: [`Which rectangle has an area of ${area} ${u2}?`],
          correct: rectangle(p.l, p.w, p.unit),
          distractors: [
            ...(decoy
              ? [
                  {
                    figure: rectangle(decoy[0], decoy[1], p.unit),
                    code: "MEA.PERIMETER.AREA",
                    feedback: `That rectangle has a perimeter of ${area} ${p.unit}, but its area is ${decoy[0] * decoy[1]} ${u2}.`,
                  },
                ]
              : []),
            {
              figure: rectangle(other[0], other[1], p.unit),
              feedback: `${other[0]} × ${other[1]} = ${other[0] * other[1]} ${u2}.`,
            },
          ],
          solution: [{ say: `${p.l} × ${p.w} = ${area} ${u2}.` }],
        });
      }
      default: {
        const sq = p.s * p.s;
        const truth = area > sq;
        return A.trueOrFalseWhy({
          rng,
          statement: `Rectangle A is ${p.l} ${p.unit} by ${p.w} ${p.unit}. Square B has sides of ${p.s} ${p.unit}. Lily says A has the bigger area because it is longer.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}, but not because it is longer. A is ${p.l} × ${p.w} = ${area} ${u2} and B is ${p.s} × ${p.s} = ${sq} ${u2}.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. The longer shape always has the bigger area.`,
              code: "MEA.COMPARE.LOOKS",
            },
            {
              text: `${truth ? "False" : "True"}. Compare the perimeters: ${2 * (p.l + p.w)} ${p.unit} and ${4 * p.s} ${p.unit}.`,
              code: "MEA.PERIMETER.AREA",
            },
          ],
          solution: [{ say: `A: ${area} ${u2}. B: ${sq} ${u2}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.l * p.w;
    if (question.archetype === "choose-the-diagram") {
      const [l = 0, w = 0] = dims(chosenFigure(question) as GeometrySpec | undefined);
      return l * w === p.l * p.w;
    }
    return true;
  },
});
