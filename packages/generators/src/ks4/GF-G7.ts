/**
 * @statement GF-G7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G7: Identify, describe and construct congruent and similar shapes, including on coordinate axes,
// by considering rotation, reflection, translation and enlargement (including fractional scale
// factors)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { Coord } from "@mathsplanner/diagrams";
import { chosenText } from "../shared/counting.ts";
import { coord, distinctFrom, enlarge } from "../shared/pos.ts";

interface Params {
  v: Coord;
  c: Coord;
  claim: number;
}

const TRANS = [
  "a rotation of 90°",
  "a reflection in a line",
  "a translation",
  "an enlargement with scale factor 3",
];

export default defineGenerator<Params>({
  id: "GF-G7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.ENLARGE.CENTRE", "POS.ENLARGE.ADD", "GEO.CONGRUENT.SIMILAR"],

  params(rng) {
    const c: Coord = [rng.int(-2, 2), rng.int(-2, 2)];
    const v: Coord = [c[0] + 2 * rng.int(-4, 4), c[1] + 2 * rng.int(-4, 4)];
    if (v[0] === c[0] || v[1] === c[1] || (c[0] === 0 && c[1] === 0))
      reject("a vertex off the centre's lines, centre not the origin");
    return { v, c, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const img = enlarge([p.v], 0.5, p.c)[0] as Coord;
        const right = coord(img);
        return A.choice({
          rng,
          question: [
            "A shape has a vertex at ",
            A.math(coord(p.v)),
            ". It is enlarged by scale factor ",
            A.math("\\frac{1}{2}"),
            " with centre ",
            A.math(coord(p.c)),
            ".",
          ],
          ask: "Where is the image of that vertex?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([p.v[0] / 2, p.v[1] / 2])),
              code: "POS.ENLARGE.CENTRE",
              feedback: "Halve the distance from the centre of enlargement, not from the origin.",
            },
            {
              content: A.math(coord(enlarge([p.v], 2, p.c)[0] as Coord)),
              code: "POS.ENLARGE.ADD",
              feedback: "Scale factor ½ brings the point halfway towards the centre.",
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `From ${coord(p.c)} to ${coord(p.v)} is (${p.v[0] - p.c[0]}, ${p.v[1] - p.c[1]}). Half of that from the centre: ${right}.`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: "A shape is transformed.",
          ask: "Which transformation does NOT give a congruent image?",
          correct: TRANS[3] ?? "",
          distractors: TRANS.slice(0, 3).map((t) => ({
            content: t,
            code: "GEO.CONGRUENT.SIMILAR",
            feedback: `${t[0]?.toUpperCase()}${t.slice(1)} keeps every length, so the image is congruent.`,
          })),
          solution: [
            {
              say: "Rotations, reflections and translations keep lengths: congruent. Enlargements change lengths: similar.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            p.claim === 0
              ? "Kai says that enlarging a triangle by scale factor ½ gives a triangle congruent to the original."
              : "Kai says that enlarging a triangle by scale factor ½ gives a triangle similar to the original.",
          truth: p.claim === 1,
          reasons: [
            {
              text:
                p.claim === 1
                  ? "True. The angles stay the same and every length is halved, so the triangles are similar."
                  : "False. Every length is halved, so the triangles are similar but not congruent.",
              correct: true,
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. Enlargements always give congruent shapes.`,
              code: "GEO.CONGRUENT.SIMILAR",
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. Similar and congruent mean the same.`,
              code: "GEO.CONGRUENT.SIMILAR",
            },
          ],
          solution: [
            { say: "Congruent: same shape and size. Similar: same shape, lengths in proportion." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === coord(enlarge([p.v], 0.5, p.c)[0] as Coord);
    if (question.archetype === "varied-form") return chosenText(question) === TRANS[3];
    return true;
  },
});
