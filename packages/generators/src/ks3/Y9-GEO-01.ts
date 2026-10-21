/**
 * @statement Y9-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-GEO-01: Use Pythagoras' theorem and trigonometric ratios in similar triangles to solve problems
// involving right-angled triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Legs a (across) and b (up) and hypotenuse c. */
  t: [number, number, number];
  ratio: number;
  claimTrue: boolean;
}

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [8, 15, 17],
  [15, 8, 17],
  [9, 12, 15],
  [12, 9, 15],
  [7, 24, 25],
  [20, 21, 29],
];
const r1 = (x: number) => Math.round(x * 10) / 10;
const cm = (n: number | string) => (typeof n === "number" ? `${n}\\text{ cm}` : n);

/** A right-angled triangle with the right angle at B, legs AB (across) and BC (up). */
function right(
  a: number,
  b: number,
  labels: [number | string | undefined, number | string | undefined, number | string | undefined],
  theta = false,
): GeometrySpec {
  const [la, lb, lc] = labels;
  return {
    type: "geometry",
    points: { A: [0, 0], B: [a, 0], C: [a, b] },
    polygons: [{ vertices: ["A", "B", "C"] }],
    segments: [
      ...(la === undefined
        ? []
        : [
            {
              from: "A",
              to: "B",
              label: cm(la),
              ...(typeof la === "number" ? { length: la } : {}),
            },
          ]),
      ...(lb === undefined
        ? []
        : [
            {
              from: "B",
              to: "C",
              label: cm(lb),
              ...(typeof lb === "number" ? { length: lb } : {}),
            },
          ]),
      ...(lc === undefined
        ? []
        : [
            {
              from: "C",
              to: "A",
              label: cm(lc),
              ...(typeof lc === "number" ? { length: lc } : {}),
            },
          ]),
    ],
    angles: [
      { vertex: "B", from: "C", to: "A", right: true },
      ...(theta ? [{ vertex: "A", from: "B", to: "C", label: "\\theta" }] : []),
    ],
    description: "A right-angled triangle with some sides labelled.",
  };
}

const RATIOS = ["sin", "cos", "tan"] as const;

export default defineGenerator<Params>({
  id: "Y9-GEO-01",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["GEO.PYTHAG.NO-SQUARE", "GEO.PYTHAG.ADD-FOR-SHORT", "GEO.TRIG.RATIO"],

  params(rng, numbers) {
    const pool = numbers === "friendly" ? TRIPLES.slice(0, 4) : TRIPLES;
    return { t: rng.pick(pool), ratio: rng.int(0, 2), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, c] = p.t;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.figure(right(a, b, [a, b, "x"]))],
          ask: "Work out the length x.",
          answer: A.number(c, { units: "cm" }),
          wrong: wrongs(c, [
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(a + b, { units: "cm" }),
              feedback: "Square the two shorter sides, add, then take the square root.",
            },
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(a * a + b * b, { units: "cm" }),
              feedback: "That is x². Take the square root to find x.",
            },
          ]),
          solution: [
            {
              say: `x² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, so x = √${c * c} = ${c} cm.`,
            },
          ],
        });
      case 2: {
        const wrong = r1(Math.sqrt(c * c + a * a));
        return A.standard({
          question: [A.figure(right(a, b, [a, "x", c]))],
          ask: "Work out the length x.",
          answer: A.number(b, { units: "cm" }),
          wrong: wrongs(b, [
            {
              code: "GEO.PYTHAG.ADD-FOR-SHORT",
              value: A.number(wrong, { units: "cm", accuracy: { dp: 1 } }),
              feedback: `x is a shorter side, so subtract: x² = ${c}² − ${a}². It must be less than the hypotenuse, ${c} cm.`,
            },
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(c - a, { units: "cm" }),
              feedback: "Square the sides before subtracting.",
            },
          ]),
          solution: [
            { say: `x² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}, so x = ${b} cm.` },
          ],
        });
      }
      case 4: {
        const ratio = RATIOS[p.ratio] ?? "sin";
        const truthFrac = ratio === "sin" ? [b, c] : ratio === "cos" ? [a, c] : [b, a];
        const wrongFrac = ratio === "sin" ? [a, c] : ratio === "cos" ? [b, c] : [a, b];
        const [n, d] = p.claimTrue ? truthFrac : wrongFrac;
        const word =
          ratio === "sin"
            ? "opposite ÷ hypotenuse"
            : ratio === "cos"
              ? "adjacent ÷ hypotenuse"
              : "opposite ÷ adjacent";
        return A.trueOrFalseWhy({
          rng,
          statement: [
            A.figure(right(a, b, [a, b, c], true)),
            "Ella says ",
            A.math(`\\${ratio}\\theta = \\frac{${n}}{${d}}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: [
            {
              text: `${p.claimTrue ? "True" : "False"}. ${ratio} θ = ${word} = ${truthFrac[0]}/${truthFrac[1]}. The side opposite θ is ${b} cm, the adjacent side is ${a} cm and the hypotenuse is ${c} cm.`,
              correct: true,
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. The opposite side is the one next to θ.`,
              code: "GEO.TRIG.RATIO",
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. ${ratio} θ uses the two shorter sides.`,
              code: "GEO.TRIG.RATIO",
            },
          ],
          solution: [
            { say: "SOH CAH TOA: label the sides from θ first — opposite, adjacent, hypotenuse." },
          ],
        });
      }
      default: {
        const angle = Math.round((Math.acos(a / c) * 180) / Math.PI);
        return A.multiStepContext({
          context: `A ladder ${c} m long leans against a vertical wall. Its foot is ${a} m from the wall on level ground.`,
          parts: [
            {
              ask: "How far up the wall does the ladder reach?",
              answer: A.number(b, { units: "m" }),
              wrong: wrongs(b, [
                {
                  code: "GEO.PYTHAG.ADD-FOR-SHORT",
                  value: A.number(r1(Math.sqrt(c * c + a * a)), {
                    units: "m",
                    accuracy: { dp: 1 },
                  }),
                  feedback: "The ladder is the hypotenuse, so subtract the squares.",
                },
              ]),
            },
            {
              ask: "Work out the angle between the ladder and the ground, to the nearest degree.",
              answer: A.number(angle, { units: "°", accuracy: { dp: 0 } }),
              wrong: wrongs(angle, [
                {
                  code: "GEO.TRIG.RATIO",
                  value: A.number(90 - angle, { units: "°", accuracy: { dp: 0 } }),
                  feedback:
                    "That is the angle with the wall. The ground is next to the foot of the ladder: cos θ = adjacent ÷ hypotenuse.",
                },
              ]),
            },
          ],
          solution: [
            { say: `Height² = ${c}² − ${a}² = ${b * b}, so the height is ${b} m.` },
            { say: `cos θ = ${a}/${c}, so θ = cos⁻¹(${a}/${c}) ≈ ${angle}°.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const [a, b, c] = p.t;
    if (a * a + b * b !== c * c) return false;
    if (question.archetype === "standard")
      return numberAnswer(question) === c || numberAnswer(question) === b;
    if (question.archetype === "multi-step-context") return numberAnswer(question) === b;
    return true;
  },
});
