/**
 * @statement Y4-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-02: Measure and calculate the perimeter of a rectilinear figure (including squares) in
// centimetres and metres
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { rectangle } from "../shared/mea.ts";

interface Params {
  l: number;
  w: number;
  unit: "cm" | "m";
  side: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y4-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "MEA.PERIMETER.MISSING-SIDES",
    "MEA.PERIMETER.AREA",
    "GEO.RECTANGLE.PERIMETER-PAIRS",
  ],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : numbers === "standard" ? 20 : 45;
    const l = rng.int(3, top);
    const w = rng.int(2, top);
    if (l <= w || l > 3 * w) reject("a rectangle that looks like one");
    const side = (l + w) / 2;
    const claimTrue = rng.bool();
    if (claimTrue && !Number.isInteger(side)) reject("a whole-number square side for a true claim");
    return {
      l,
      w,
      unit: rng.pick(["cm", "m"] as const),
      side: claimTrue ? side : Math.round(side) + 1,
      claimTrue,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const per = 2 * (p.l + p.w);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(rectangle(p.l, p.w, p.unit))],
          ask: "What is the perimeter of the rectangle?",
          answer: A.number(per, { units: p.unit }),
          wrong: wrongs(per, [
            {
              code: "MEA.PERIMETER.MISSING-SIDES",
              value: A.number(p.l + p.w, { units: p.unit }),
              feedback:
                "Only two sides are labelled, but the opposite sides are the same length. Add all four.",
            },
            {
              code: "MEA.PERIMETER.AREA",
              value: A.number(p.l * p.w, { units: p.unit }),
              feedback: "Multiplying gives the area. Perimeter is the distance all the way round.",
            },
          ]),
          solution: [{ say: `${p.l} + ${p.w} + ${p.l} + ${p.w} = ${per} ${p.unit}.` }],
        });
      case 2:
        return A.standard({
          question: `A rectangle has a perimeter of ${per} ${p.unit}. It is ${p.l} ${p.unit} long.`,
          ask: "How wide is it?",
          answer: A.number(p.w, { units: p.unit }),
          wrong: wrongs(p.w, [
            {
              code: "GEO.RECTANGLE.PERIMETER-PAIRS",
              value: A.number(per - p.l, { units: p.unit }),
              feedback: `There are two lengths and two widths: ${per} − ${p.l} − ${p.l} leaves the two widths.`,
            },
          ]),
          solution: [
            {
              say: `Half the perimeter is one length and one width: ${per} ÷ 2 = ${per / 2}, and ${per / 2} − ${p.l} = ${p.w} ${p.unit}.`,
            },
          ],
        });
      default: {
        const sq = 4 * p.side;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(rectangle(p.l, p.w, p.unit)),
            `Ivy says a square with sides of ${p.side} ${p.unit} has the same perimeter as this rectangle.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The square's perimeter is 4 × ${p.side} = ${sq} ${p.unit}, and the rectangle's is ${per} ${p.unit}.`,
                  correct: true,
                },
                {
                  text: `False. The square's perimeter is ${p.side * p.side} ${p.unit}.`,
                  code: "MEA.PERIMETER.AREA",
                },
                {
                  text: `False. The rectangle's perimeter is ${p.l + p.w} ${p.unit}.`,
                  code: "MEA.PERIMETER.MISSING-SIDES",
                },
              ]
            : [
                {
                  text: `False. The square's perimeter is 4 × ${p.side} = ${sq} ${p.unit}, but the rectangle's is ${per} ${p.unit}.`,
                  correct: true,
                },
                { text: "True. Squares and rectangles always have the same perimeter." },
                {
                  text: `True. The rectangle's perimeter is ${p.l + p.w} ${p.unit}.`,
                  code: "MEA.PERIMETER.MISSING-SIDES",
                },
              ],
          solution: [
            {
              say: `Rectangle: 2 × (${p.l} + ${p.w}) = ${per} ${p.unit}. Square: 4 × ${p.side} = ${sq} ${p.unit}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why")
      return (4 * p.side === 2 * (p.l + p.w)) === p.claimTrue;
    const n = numberAnswer(question);
    return n === 2 * (p.l + p.w) || n === p.w;
  },
});
