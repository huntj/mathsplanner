/**
 * @statement FM-CP-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-05: Represent and interpret loci and regions in the Argand diagram, e.g. |z − a| = r and
// arg(z − a) = θ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { cx } from "../shared/cplx.ts";

export interface Params {
  a: number;
  b: number;
  r: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.LOCUS", "ALG.CIRCLE.RADIUS-SQUARED"],

  params(rng) {
    const p = {
      a: rng.int(-5, 5),
      b: rng.int(-5, 5),
      r: rng.int(2, 6),
      c: rng.int(-5, 5),
      d: rng.int(-5, 5),
    };
    if (p.a === 0 || p.b === 0 || (p.a === p.c && p.b === p.d))
      reject("a centre off the axes and two different points");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Describe the locus of points z with ",
            A.math(`|z - (${cx(p.a, p.b)})| = ${p.r}`),
            ".",
          ],
          correct: `A circle with centre (${p.a}, ${p.b}) and radius ${p.r}`,
          distractors: [
            {
              content: `A circle with centre (${-p.a}, ${-p.b}) and radius ${p.r}`,
              code: "CPLX.LOCUS",
              feedback: `|z − w| is the distance from w, so the centre is the point ${cx(p.a, p.b)}.`,
            },
            {
              content: `A circle with centre (${p.a}, ${p.b}) and radius ${p.r * p.r}`,
              code: "ALG.CIRCLE.RADIUS-SQUARED",
              feedback: "The modulus is the distance itself, not its square.",
            },
          ],
          solution: [{ say: `The points at distance ${p.r} from ${cx(p.a, p.b)}: a circle.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Describe the locus of points z with ",
            A.math(`|z - (${cx(p.a, p.b)})| = |z - (${cx(p.c, p.d)})|`),
            ".",
          ],
          correct: `The perpendicular bisector of the line joining (${p.a}, ${p.b}) and (${p.c}, ${p.d})`,
          distractors: [
            {
              content: `The circle through (${p.a}, ${p.b}) and (${p.c}, ${p.d})`,
              code: "CPLX.LOCUS",
              feedback:
                "Points the same distance from two fixed points lie on the perpendicular bisector.",
            },
            {
              content: `The line through (${p.a}, ${p.b}) and (${p.c}, ${p.d})`,
              code: "CPLX.LOCUS",
              feedback: "Equidistant points lie on a line perpendicular to the one joining them.",
            },
          ],
          solution: [
            {
              say: "z is equidistant from the two points, so it lies on their perpendicular bisector.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kim says the locus ",
            A.math(`\\arg(z - (${cx(p.a, p.b)})) = \\frac{\\pi}{4}`),
            " is a whole straight line through the point ",
            A.math(`(${p.a}, ${p.b})`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. It is a half-line starting at (${p.a}, ${p.b}) (not including that point), going at π/4 to the positive real direction.`,
              correct: true,
            },
            { text: "True. Fixing an angle gives a line in both directions.", code: "CPLX.LOCUS" },
            {
              text: "True. Every locus in the Argand diagram is a line or a circle.",
              code: "CPLX.LOCUS",
            },
          ],
          solution: [{ say: "The opposite direction has argument −3π/4, not π/4." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `A circle with centre (${p.a}, ${p.b}) and radius ${p.r}`;
    return true;
  },
});
