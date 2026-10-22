/**
 * @statement GH-G8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-G8: Describe changes and invariance for combinations of rotations, reflections and translations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Combo {
  first: string;
  then: string;
  single: string;
  /** Plausible but wrong single transformations. */
  traps: string[];
}

interface Params {
  combo: number;
  /** Lines x = m and x = n for the parallel-mirrors case; a point; a translation. */
  m: number;
  n: number;
  point: Coord;
  t: Coord;
}

function combos(p: Params): Combo[] {
  return [
    {
      first: "a reflection in the x-axis",
      then: "a reflection in the y-axis",
      single: "a rotation of 180° about the origin",
      traps: ["a reflection in the line y = x", "a translation"],
    },
    {
      first: `a reflection in the line x = ${p.m}`,
      then: `a reflection in the line x = ${p.n}`,
      single: `a translation by ${2 * (p.n - p.m)} units in the x-direction`,
      traps: [`a reflection in the line x = ${p.m + p.n}`, "a rotation of 180° about the origin"],
    },
    {
      first: "a rotation of 90° clockwise about the origin",
      then: "another rotation of 90° clockwise about the origin",
      single: "a rotation of 180° about the origin",
      traps: ["a reflection in the x-axis", "a rotation of 90° clockwise about the origin"],
    },
  ];
}

export default defineGenerator<Params>({
  id: "GH-G8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.COMBINE"],

  params(rng) {
    const m = rng.int(-3, 3);
    const n = rng.int(-3, 3);
    const point: Coord = [rng.int(-5, 5), rng.int(-5, 5)];
    const t: Coord = [rng.int(-4, 4), rng.int(-4, 4)];
    if (m === n || point[0] === m || t[0] === 0 || t[1] === 0)
      reject("distinct mirrors and a real translation");
    return { combo: rng.int(0, 2), m, n, point, t };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = combos(p)[p.combo] ?? (combos(p)[0] as Combo);
        return A.choice({
          rng,
          question: `A shape is transformed by ${c.first}, followed by ${c.then}.`,
          ask: "Which single transformation has the same effect?",
          correct: `${c.single[0]?.toUpperCase()}${c.single.slice(1)}`,
          distractors: c.traps.map((t) => ({
            content: `${t[0]?.toUpperCase()}${t.slice(1)}`,
            code: "POS.COMBINE",
            feedback:
              "Track one point through both transformations, then see what single move takes it to the same place.",
          })),
          solution: [
            {
              say: `Following one point through both steps shows the overall effect is ${c.single}.`,
            },
          ],
        });
      }
      case 2: {
        // Reflect in x = m, then translate by t.
        const [x, y] = p.point;
        const reflected: Coord = [2 * p.m - x, y];
        const right: Coord = [reflected[0] + p.t[0], reflected[1] + p.t[1]];
        const swapped: Coord = [2 * p.m - (x + p.t[0]), y + p.t[1]];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The point ",
            A.math(`P${coord(p.point)}`),
            ` is reflected in the line x = ${p.m}, then translated by `,
            A.math(`\\begin{pmatrix} ${p.t[0]} \\\\ ${p.t[1]} \\end{pmatrix}`),
            ".",
          ],
          ask: "Where does P end up?",
          correct: A.math(coord(right)),
          distractors: [
            ...(swapped[0] !== right[0] || swapped[1] !== right[1]
              ? [
                  {
                    content: A.math(coord(swapped)),
                    code: "POS.COMBINE",
                    feedback:
                      "Do the transformations in the order given: reflect first, then translate.",
                  },
                ]
              : []),
            {
              content: A.math(coord([reflected[0], reflected[1]])),
              code: "POS.COMBINE",
              feedback: "That is only the reflection; now apply the translation.",
            },
            {
              content: A.math(coord([x + p.t[0], y + p.t[1]])),
              code: "POS.COMBINE",
              feedback: "That is only the translation; reflect first.",
            },
          ].filter(
            (d, i, all) =>
              all.findIndex((e) => JSON.stringify(e.content) === JSON.stringify(d.content)) === i &&
              JSON.stringify(d.content) !== JSON.stringify(A.math(coord(right))),
          ),
          solution: [{ say: `Reflect: ${coord(reflected)}. Translate: ${coord(right)}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Mo says the order does not matter when you combine a reflection and a translation.",
          truth: false,
          reasons: [
            {
              text: `False. For example, reflecting P${coord(p.point)} in x = ${p.m} then translating by (${p.t[0]}, ${p.t[1]}) gives ${coord([2 * p.m - p.point[0] + p.t[0], p.point[1] + p.t[1]])}, but translating first gives ${coord([2 * p.m - p.point[0] - p.t[0], p.point[1] + p.t[1]])}.`,
              correct: true,
            },
            {
              text: "True. Both are just moves, so they can be done in any order.",
              code: "POS.COMBINE",
            },
            { text: "True. The shape stays the same size either way." },
          ],
          solution: [
            {
              say: "Any translation with a sideways part changes where the mirror line sends the shape, so the order matters.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) {
      const right: Coord = [2 * p.m - p.point[0] + p.t[0], p.point[1] + p.t[1]];
      return chosenText(question).includes(coord(right));
    }
    return true;
  },
});
