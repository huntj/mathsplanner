/**
 * @statement Y6-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-05: Recognise when it is possible to use formulae for area and volume of shapes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { lShape } from "../shared/mea.ts";

interface Params {
  shape: number;
  l: number;
  w: number;
  h: number;
  W: number;
  H: number;
  a: number;
  b: number;
}

// [what, right formula, wrong formulas with codes]
const FORMULAE: [string, string, [string, string][]][] = [
  [
    "the area of a rectangle",
    "A = l \\times w",
    [
      ["A = 2(l + w)", "MEA.PERIMETER.AREA"],
      ["A = l + w", "MEA.PERIMETER.AREA"],
      ["A = l \\times w \\times h", "MEA.VOLUME.ADDS"],
    ],
  ],
  [
    "the volume of a cuboid",
    "V = l \\times w \\times h",
    [
      ["V = l + w + h", "MEA.VOLUME.ADDS"],
      ["V = l \\times w", "MEA.VOLUME.ADDS"],
      ["V = 2(l + w + h)", "MEA.VOLUME.ADDS"],
    ],
  ],
  [
    "the area of a triangle",
    "A = \\frac{1}{2} b h",
    [
      ["A = b h", "MEA.AREA.TRIANGLE-HALF"],
      ["A = b + h", "MEA.PERIMETER.AREA"],
      ["A = 2 b h", "MEA.AREA.TRIANGLE-HALF"],
    ],
  ],
  [
    "the area of a parallelogram",
    "A = b h",
    [
      ["A = \\frac{1}{2} b h", "MEA.AREA.TRIANGLE-HALF"],
      ["A = 2(b + h)", "MEA.PERIMETER.AREA"],
      ["A = b + h", "MEA.PERIMETER.AREA"],
    ],
  ],
];

export default defineGenerator<Params>({
  id: "Y6-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.PERIMETER.AREA", "MEA.VOLUME.ADDS", "MEA.AREA.TRIANGLE-HALF"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : 12;
    const W = rng.int(6, 12);
    const H = rng.int(5, 10);
    const a = rng.int(Math.ceil(W / 4), W - 2);
    const b = rng.int(Math.ceil(H / 3), H - 2);
    const l = rng.int(2, top);
    const w = rng.int(2, top);
    const h = rng.int(2, top);
    if (l * w * h === l + w + h) reject("a volume that differs from the sum");
    return { shape: rng.int(0, FORMULAE.length - 1), l, w, h, W, H, a, b };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, right, wrong] = (FORMULAE[p.shape] ??
          FORMULAE[0]) as (typeof FORMULAE)[number];
        return A.choice({
          rng,
          question: `Which formula gives ${what}?`,
          correct: A.math(right),
          distractors: wrong.map(([f, code]) => ({
            content: A.math(f),
            code,
            feedback: `That formula does not give ${what}. ${right.replace(/\\times/g, "×").replace(/\\frac\{1\}\{2\}/, "½")}.`,
          })),
          solution: [{ say: `${what[0]?.toUpperCase()}${what.slice(1)}: `, math: right }],
        });
      }
      case 2: {
        const v = p.l * p.w * p.h;
        return A.standard({
          question: [
            "Use ",
            A.math("V = l \\times w \\times h"),
            ` to find the volume of a cuboid with l = ${p.l} cm, w = ${p.w} cm and h = ${p.h} cm.`,
          ],
          answer: A.number(v, { units: "cm³" }),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.l + p.w + p.h, { units: "cm³" }),
              feedback: "The formula multiplies the three lengths.",
            },
          ]),
          solution: [{ say: `V = ${p.l} × ${p.w} × ${p.h} = ${v} cm³.` }],
        });
      }
      default: {
        const area = p.W * p.H - p.a * p.b;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(lShape(p.W, p.H, p.a, p.b, [0, 1, 2, 3, 4, 5])),
            `Ravi says the area is ${p.W} × ${p.H} = ${p.W * p.H} cm², using length × width.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The shape is not a rectangle, so l × w does not fit it. Split it into rectangles, or take the cut corner away: ${p.W * p.H} − ${p.a * p.b} = ${area} cm².`,
              correct: true,
            },
            { text: "True. Length × width works for any shape.", code: "MEA.PERIMETER.AREA" },
            { text: "True. The longest side times the tallest side always gives the area." },
          ],
          solution: [{ say: `${p.W} × ${p.H} − ${p.a} × ${p.b} = ${area} cm².` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.l * p.w * p.h;
    if (question.archetype === "standard")
      return (
        chosenText(question) ===
        ((FORMULAE[p.shape] ?? FORMULAE[0]) as (typeof FORMULAE)[number])[1]
      );
    return true;
  },
});
