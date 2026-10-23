/**
 * @statement Y7-GEO-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-06.b: Find the angle sum of any polygon
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  known: number[];
  m: number;
}

const NAMES: Record<number, string> = { 4: "quadrilateral", 5: "pentagon", 6: "hexagon" };

export default defineGenerator<Params>({
  id: "Y7-GEO-06.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLYGON.SUM-N-TIMES-180", "GEO.ANGLES.QUADRILATERAL-180"],

  params(rng) {
    const n = rng.int(5, 6);
    const known = Array.from({ length: n - 1 }, () => rng.int(9, 16) * 10);
    const last = (n - 2) * 180 - known.reduce((s, x) => s + x, 0);
    if (last < 60 || last > 170) reject("a convex polygon");
    return { n, known, m: rng.int(7, 20) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const sum = (p.n - 2) * 180;
        const v = sum - p.known.reduce((s, x) => s + x, 0);
        return A.standard({
          question: [
            `A ${NAMES[p.n]} has angles of ${p.known.map((x) => `${x}°`).join(", ")} and x.`,
          ],
          ask: "Find x.",
          answer: A.degrees(v),
          wrong: wrongs(v, [
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.degrees(p.n * 180 - p.known.reduce((s, x) => s + x, 0)),
              feedback: `A ${NAMES[p.n]} splits into ${p.n - 2} triangles: its angles add up to ${sum}°.`,
            },
          ]),
          solution: [
            { say: `Angle sum = (${p.n} − 2) × 180° = ${sum}°, so `, math: `x = ${v}^\\circ` },
          ],
        });
      }
      case 2: {
        const sum = (p.m - 2) * 180;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`The interior angles of a polygon add up to ${sum}°.`],
              ask: "How many sides does it have?",
            },
          ],
          answer: A.number(p.m),
          wrong: wrongs(p.m, [
            {
              code: "GEO.POLYGON.SUM-N-TIMES-180",
              value: A.number(p.m - 2),
              feedback: "That is the number of triangles. The polygon has 2 more sides than that.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${sum} \\div 180 = ${p.m - 2} \\text{ triangles, so } ${p.m} \\text{ sides}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Rob says the angles in a quadrilateral add up to 180°, like a triangle."],
          truth: false,
          reasons: [
            {
              text: "False. A diagonal splits a quadrilateral into two triangles, so its angles add up to 2 × 180° = 360°.",
              correct: true,
            },
            {
              text: "True. Every polygon's angles add up to 180°.",
              code: "GEO.ANGLES.QUADRILATERAL-180",
            },
            { text: "True. A square has four 45° angles.", code: "GEO.ANGLES.QUADRILATERAL-180" },
          ],
          solution: [{ say: "Angle sum = (n − 2) × 180°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.n - 2) * 180 - p.known.reduce((s, x) => s + x, 0);
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
