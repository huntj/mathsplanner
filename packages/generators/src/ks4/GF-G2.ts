/**
 * @statement GF-G2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G2: Use the standard ruler and compass constructions to construct figures and solve loci
// problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  locus: number;
  r: number;
  claim: number;
}

const LOCI: [string, string, string[], string][] = [
  [
    "points exactly {r} cm from a fixed point A",
    "a circle with centre A and radius {r} cm",
    ["a straight line {r} cm long", "the perpendicular bisector of A"],
    "GEO.LOCUS.TYPE",
  ],
  [
    "points the same distance from two fixed points A and B",
    "the perpendicular bisector of AB",
    ["the bisector of the angle at A", "a circle through A and B"],
    "GEO.CONSTRUCT.BISECTORS",
  ],
  [
    "points the same distance from two lines that cross",
    "the bisectors of the angles between the lines",
    ["the perpendicular bisector of the lines", "a circle round the crossing point"],
    "GEO.CONSTRUCT.BISECTORS",
  ],
  [
    "points exactly {r} cm from a straight line segment",
    "two parallel lines with a semicircle at each end",
    ["a circle of radius {r} cm", "one line parallel to the segment"],
    "GEO.LOCUS.TYPE",
  ],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "The locus of points less than 4 cm from a point is the region inside a circle of radius 4 cm.",
    truth: true,
    why: "Every point inside the circle is closer than 4 cm; points on it are exactly 4 cm.",
  },
  {
    text: "The locus of points equidistant from A and B is the line AB.",
    truth: false,
    why: "Points on AB other than its midpoint are nearer one end. The locus is the perpendicular bisector of AB.",
  },
  {
    text: "Points nearer to A than to B lie on A's side of the perpendicular bisector of AB.",
    truth: true,
    why: "The perpendicular bisector separates the points nearer A from those nearer B.",
  },
];

export default defineGenerator<Params>({
  id: "GF-G2",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.LOCUS.TYPE", "GEO.CONSTRUCT.BISECTORS"],

  params(rng) {
    return {
      locus: rng.int(0, LOCI.length - 1),
      r: rng.int(2, 8),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const fill = (s: string) => s.split("{r}").join(String(p.r));
    if (depth === 1) {
      const [what, right, wrong, code] = LOCI[p.locus] as (typeof LOCI)[number];
      return A.choice({
        rng,
        question: `Describe the locus of ${fill(what)}.`,
        correct: fill(right),
        distractors: wrong.map((w) => ({
          content: fill(w),
          code,
          feedback: "Imagine plotting many such points: what shape do they make?",
        })),
        solution: [{ say: `The locus is ${fill(right)}.` }],
      });
    }
    const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
    return A.trueOrFalseWhy({
      rng,
      statement: `Ali says: "${c.text}"`,
      truth: c.truth,
      reasons: [
        { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
        {
          text: `${c.truth ? "False" : "True"}. A locus is always a straight line.`,
          code: "GEO.LOCUS.TYPE",
        },
        {
          text: `${c.truth ? "False" : "True"}. Equidistant from two points and from two lines are the same locus.`,
          code: "GEO.CONSTRUCT.BISECTORS",
        },
      ],
      solution: [
        {
          say: "Fixed distance from a point: circle. Equidistant from two points: perpendicular bisector. Equidistant from two lines: angle bisector.",
        },
      ],
    });
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        chosenText(question) ===
        (LOCI[p.locus] as (typeof LOCI)[number])[1].split("{r}").join(String(p.r))
      );
    return true;
  },
});
