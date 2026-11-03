/**
 * @statement GF-G7.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G7.d: Enlarge shapes, including by fractional scale factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

const FACTORS: [number, number][] = [
  [1, 2],
  [1, 3],
  [3, 2],
  [2, 3],
  [5, 2],
];

interface Params {
  f: number;
  side: number;
  x: number;
  y: number;
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-G7.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.ENLARGE.ADD", "POS.ENLARGE.CENTRE", "GEO.CONGRUENT.SIMILAR"],

  params(rng) {
    const p = {
      f: rng.int(0, FACTORS.length - 1),
      side: rng.int(2, 8) * 6,
      x: rng.int(-4, 6),
      y: rng.int(-4, 6),
      a: rng.int(-2, 2),
      b: rng.int(-2, 2),
      k: rng.pick([2, 3]),
    };
    if (p.a === 0 && p.b === 0) reject("a centre away from the origin");
    if (p.x === p.a && p.y === p.b) reject("a point away from the centre");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [n, d] = FACTORS[p.f] ?? [1, 2];
    switch (depth) {
      case 1: {
        const v = (p.side * n) / d;
        return A.standard({
          question: [
            `A shape has a side of length ${p.side} cm. It is enlarged by scale factor `,
            A.math(toLatex(frac(n, d))),
            ".",
          ],
          ask: "How long is that side on the image?",
          answer: A.number(v, { units: "cm" }),
          wrong: wrongs(v, [
            {
              code: "POS.ENLARGE.ADD",
              value: A.number(p.side + n / d, { units: "cm" }),
              feedback: "Multiply every length by the scale factor; do not add it.",
            },
          ]),
          solution: [
            { say: "", math: `${p.side} \\times ${toLatex(frac(n, d))} = ${v} \\text{ cm}` },
          ],
        });
      }
      case 2: {
        const right = coord([p.a + p.k * (p.x - p.a), p.b + p.k * (p.y - p.b)]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(coord([p.x, p.y])),
            ` is enlarged by scale factor ${p.k}, centre `,
            A.math(coord([p.a, p.b])),
            ".",
          ],
          ask: "Where does it end up?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.k * p.x, p.k * p.y])),
              code: "POS.ENLARGE.CENTRE",
              feedback: `That uses the origin as the centre. Multiply the distance from (${p.a}, ${p.b}) instead.`,
            },
            {
              content: A.math(coord([p.x + p.k * (p.x - p.a), p.y + p.k * (p.y - p.b)])),
              code: "POS.ENLARGE.CENTRE",
              feedback: "Measure the new distance from the centre, not from the point.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `From the centre, the point is ${p.x - p.a} across and ${p.y - p.b} up; multiply by ${p.k}: `,
              math: right,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ivy says an enlargement by scale factor ",
                A.math(toLatex(frac(n, d))),
                " gives an image congruent to the shape.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. The lengths change, so the image is similar (same shape) but not congruent (same shape and size).",
                  correct: true,
                },
                {
                  text: "True. The angles stay the same, so the shapes are congruent.",
                  code: "GEO.CONGRUENT.SIMILAR",
                },
                {
                  text: "True. Enlarged shapes are always congruent.",
                  code: "GEO.CONGRUENT.SIMILAR",
                },
              ],
              solution: [{ say: "Only a scale factor of 1 (or −1) gives a congruent image." }],
            }),
          [
            {
              statement:
                "A triangle with sides 3, 4 and 5 cm is enlarged by scale factor 2. Sam says the new sides are 6, 8 and 10 cm.",
              truth: true,
              right: "True. Every length doubles.",
              wrong: [
                ["False. They are 5, 6 and 7 cm.", "POS.ENLARGE.ADD"],
                ["False. Only the longest side doubles."],
              ],
            },
            {
              claim: "An enlargement with scale factor between 0 and 1 makes a shape smaller.",
              truth: "always",
              right: "Always. Every length is multiplied by less than 1.",
              wrong: [
                ["Never. Enlargements make things bigger.", "POS.ENLARGE.ADD"],
                ["Sometimes. It depends on the centre.", "POS.ENLARGE.CENTRE"],
              ],
            },
            {
              statement:
                "Kim says enlarging a shape by scale factor 3 gives an image congruent to it.",
              truth: false,
              right: "False. The image is similar, not congruent: its lengths are 3 times as long.",
              wrong: [
                ["True. Enlargements keep the shape.", "GEO.CONGRUENT.SIMILAR"],
                ["True. Congruent and similar mean the same.", "GEO.CONGRUENT.SIMILAR"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const [n, d] = FACTORS[p.f] ?? [1, 2];
    if (question.key.depth === 1) return numberAnswer(question) === (p.side * n) / d;
    if (question.key.depth === 2)
      return chosenText(question) === coord([p.a + p.k * (p.x - p.a), p.b + p.k * (p.y - p.b)]);
    return true;
  },
});
