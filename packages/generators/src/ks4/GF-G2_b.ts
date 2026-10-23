/**
 * @statement GF-G2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G2.b: Solve loci problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const LOCI: [string, string, string][] = [
  ["{r} cm from a point P", "A circle, centre P, radius {r} cm", "A straight line {r} cm long"],
  [
    "{r} cm from a straight line",
    "Two lines parallel to it, {r} cm away on each side",
    "A circle of radius {r} cm",
  ],
  [
    "the same distance from two points A and B",
    "The perpendicular bisector of AB",
    "A circle through A and B",
  ],
  [
    "the same distance from two lines that cross",
    "The lines bisecting the angles between them",
    "A line parallel to both",
  ],
];

interface Params {
  locus: number;
  r: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-G2.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.LOCUS.TYPE"],

  params(rng) {
    return { locus: rng.int(0, LOCI.length - 1), r: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const fill = (s: string) => s.split("{r}").join(String(p.r));
    switch (depth) {
      case 1: {
        const [what, right, wrong] = (LOCI[p.locus] ?? LOCI[0] ?? ["", "", ""]).map(fill);
        const other = fill(LOCI[(p.locus + 1) % LOCI.length]?.[1] ?? "");
        return A.choice({
          rng,
          question: [`What is the locus of points ${what}?`],
          correct: right ?? "",
          distractors: [
            {
              content: wrong ?? "",
              code: "GEO.LOCUS.TYPE",
              feedback: "Picture all the points that fit, in every direction.",
            },
            {
              content: other,
              code: "GEO.LOCUS.TYPE",
              feedback: "That is the locus for a different rule.",
            },
          ],
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const v = r1(0.75 * Math.PI * p.r * p.r);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A goat is tied to the outside corner of a large square shed by a rope ${p.r} m long. It can walk anywhere the rope reaches, except inside the shed.`,
              ],
              ask: "Find the area it can reach, in m², to 1 decimal place.",
            },
            {
              question: [
                `A dog on a ${p.r} m lead is tied to the corner of a building, outside it. The building's walls meet at a right angle.`,
              ],
              ask: "Find the area of ground the dog can reach, in m², to 1 decimal place.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.LOCUS.TYPE",
              value: A.number(r1(Math.PI * p.r * p.r), { accuracy: { dp: 1 } }),
              feedback:
                "The building blocks a quarter of the circle, so the locus is three quarters of a circle.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{3}{4} \\times \\pi \\times ${p.r}^2 = ${v} \\text{ m}^2` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "The points that are the same distance from two fixed points lie on a straight line.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. They lie on the perpendicular bisector of the line joining the two points.",
              correct: true,
            },
            { text: "Never. They lie on a circle.", code: "GEO.LOCUS.TYPE" },
            { text: "Sometimes. Only the midpoint works.", code: "GEO.LOCUS.TYPE" },
          ],
          solution: [{ say: "Construct the perpendicular bisector to draw this locus." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === (LOCI[p.locus]?.[1] ?? "").split("{r}").join(String(p.r));
    if (question.key.depth === 2) return numberAnswer(question) === r1(0.75 * Math.PI * p.r * p.r);
    return true;
  },
});
