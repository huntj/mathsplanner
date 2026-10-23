/**
 * @statement GF-A9.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A9.a: Plot straight-line graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  m: number;
  c: number;
  k: number;
  px: number;
  onLine: boolean;
}

export default defineGenerator<Params>({
  id: "GF-A9.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = {
      m: rng.int(1, 3) * rng.pick([1, -1]),
      c: rng.int(-5, 5),
      k: rng.int(-3, 4),
      px: rng.int(-3, 3),
      onLine: rng.bool(),
    };
    if (p.c === 0 || p.k === 0 || Math.abs(p.m) === Math.abs(p.c) || !clearOfOrigin(p.m, p.c))
      reject("a line clear of the origin, intercept not the gradient");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = lineLatex(p.m, p.c);
    switch (depth) {
      case 1: {
        const v = p.m * p.k + p.c;
        return A.standard({
          question: ["To plot ", A.math(eq), ", Ben makes a table of values."],
          ask: ["Find y when ", A.math(`x = ${p.k}`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.m * p.k),
              feedback: `Add the ${p.c} as well: y = ${p.m} × ${p.k} ${p.c < 0 ? "−" : "+"} ${Math.abs(p.c)}.`,
            },
          ]),
          solution: [
            { say: "", math: `y = ${p.m}(${p.k}) ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)} = ${v}` },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The straight line is drawn on the grid.",
            A.figure(grid(8, [poly([p.m, p.c])], [], "A straight line on a coordinate grid.")),
          ],
          ask: "Which is its equation?",
          correct: A.math(eq),
          distractors: [
            {
              content: A.math(lineLatex(p.c, p.m)),
              code: "ALG.LINE.M-C",
              feedback:
                "The number added is where the line crosses the y-axis; the x coefficient is the gradient.",
            },
            {
              content: A.math(lineLatex(-p.m, p.c)),
              code: "ALG.LINE.M-C",
              feedback: `Check the direction: the line goes ${p.m > 0 ? "up" : "down"} from left to right.`,
            },
          ],
          solution: [
            {
              say: `It crosses the y-axis at ${p.c} and rises ${p.m} for each 1 across: `,
              math: eq,
            },
          ],
        });
      default: {
        const py = p.m * p.px + p.c + (p.onLine ? 0 : 1);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tia says the point ",
            A.math(coord([p.px, py])),
            " lies on the line ",
            A.math(eq),
            ".",
          ],
          truth: p.onLine,
          reasons: p.onLine
            ? [
                { text: `True. When x = ${p.px}, y = ${p.m * p.px + p.c}.`, correct: true },
                { text: "False. A point is only on a line if both coordinates are positive." },
                { text: `False. Swap the coordinates: x = ${py}.`, code: "ALG.LINE.M-C" },
              ]
            : [
                {
                  text: `False. When x = ${p.px}, y = ${p.m * p.px + p.c}, not ${py}.`,
                  correct: true,
                },
                { text: "True. Any point near the line is on it." },
                { text: `True. ${py} is close to the intercept ${p.c}.`, code: "ALG.LINE.M-C" },
              ],
          solution: [{ say: "Substitute the x-coordinate and compare the y values." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m * p.k + p.c;
    if (question.key.depth === 2) return chosenText(question) === lineLatex(p.m, p.c);
    return true;
  },
});
