/**
 * @statement CM-LP7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP7: Solve linear inequalities in two variables, showing the region on a graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  m: number;
  c: number;
  s: number;
  pts: [number, number][];
}

const inRegion = (p: Params, [x, y]: [number, number]) =>
  y > p.m * x + p.c && x + y <= p.s && x >= 0;
const pt = ([x, y]: [number, number]) => `(${x}, ${y})`;

export default defineGenerator<Params>({
  id: "CM-LP7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.FLIP"],

  params(rng) {
    const p = {
      m: rng.int(1, 3),
      c: rng.int(-2, 3),
      s: rng.int(8, 14),
      pts: [0, 1, 2].map((): [number, number] => [rng.int(0, 6), rng.int(0, 10)]),
    };
    const inside = p.pts.filter((q) => inRegion(p, q)).length;
    if (inside !== 1 || new Set(p.pts.map(pt)).size < 3) reject("exactly one point in the region");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const ineq = [
      A.math(`y > ${p.m === 1 ? "" : p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`),
      ", ",
      A.math(`x + y \\le ${p.s}`),
      " and ",
      A.math("x \\ge 0"),
    ];
    switch (depth) {
      case 1: {
        const good = p.pts.find((q) => inRegion(p, q)) ?? [0, 0];
        return A.choice({
          rng,
          question: ["A region is defined by ", ...ineq, "."],
          ask: "Which point is in the region?",
          correct: A.math(pt(good)),
          distractors: p.pts
            .filter((q) => !inRegion(p, q))
            .map((q) => ({
              content: A.math(pt(q)),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `Substitute ${pt(q)} into every inequality: at least one is not satisfied.`,
            })),
          solution: [{ say: `${pt(good)} satisfies all three inequalities.` }],
        });
      }
      case 2: {
        const right = `y \\ge ${p.m === 1 ? "" : p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "A region lies on or above the line ",
            A.math(`y = ${p.m === 1 ? "" : p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`),
            ".",
          ],
          ask: "Which inequality describes it?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(right.replace("\\ge", "\\le")),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "Above the line, y is bigger than the line's value: y ≥ …",
            },
            {
              content: A.math(right.replace("\\ge", ">")),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "'On or above' includes the line itself: use ≥ and a solid line.",
            },
          ],
          solution: [
            {
              say: "Points above the line have larger y-values, and 'on' means the boundary is included: ",
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zac says the boundary of the region ",
            A.math(`y < ${p.s}`),
            " should be drawn as a solid line.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Points on y = ${p.s} do not satisfy the strict inequality <, so the boundary is drawn dashed.`,
              correct: true,
            },
            { text: "True. Every boundary line is solid.", code: "ALG.INEQUALITY.FLIP" },
            { text: "True. < and ≤ are drawn the same way.", code: "ALG.INEQUALITY.FLIP" },
          ],
          solution: [{ say: "Solid for ≤ or ≥; dashed for < or >." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === pt(p.pts.find((q) => inRegion(p, q)) ?? [0, 0]);
    return true;
  },
});
