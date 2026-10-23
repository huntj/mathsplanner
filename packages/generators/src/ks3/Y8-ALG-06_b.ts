/**
 * @statement Y8-ALG-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-06.b: Recognise and sketch linear graphs from their equations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, lineLatex, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";

interface Params {
  m: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-06.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = { m: rng.int(1, 3) * rng.pick([1, -1]), c: rng.int(-4, 4) };
    if (p.c === 0 || Math.abs(p.c) === Math.abs(p.m) || !clearOfOrigin(p.m, p.c))
      reject("a gradient and intercept that differ, clear of the origin");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const right = lineLatex(p.m, p.c);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which line has gradient ${p.m} and crosses the y-axis at ${p.c}?`],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(lineLatex(p.c, p.m)),
              code: "ALG.LINE.M-C",
              feedback: "In y = mx + c, m (with x) is the gradient and c is the intercept.",
            },
            {
              content: A.math(lineLatex(p.m, -p.c)),
              feedback: `The line crosses the y-axis at ${p.c}, so c = ${p.c}.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: right }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which equation matches the line on the graph?",
            A.figure(grid(6, [poly([p.m, p.c])], [], "A straight line on a coordinate grid.")),
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(lineLatex(p.c, p.m)),
              code: "ALG.LINE.M-C",
              feedback:
                "Read the intercept where the line crosses the y-axis, and the gradient from its steepness.",
            },
            {
              content: A.math(lineLatex(-p.m, p.c)),
              feedback: `The line goes ${p.m > 0 ? "up" : "down"} from left to right, so the gradient is ${p.m > 0 ? "positive" : "negative"}.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [
            {
              say: `It crosses the y-axis at ${p.c} and goes ${Math.abs(p.m)} ${p.m > 0 ? "up" : "down"} for each 1 across: `,
              math: right,
            },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The graph of ", A.math(`y = ${p.c}`), " is a horizontal line."],
          truth: "always",
          reasons: [
            {
              text: `Always. Every point on it has y = ${p.c}, whatever x is, so it is flat: its gradient is 0.`,
              correct: true,
            },
            { text: "Never. It is a vertical line.", code: "ALG.LINE.M-C" },
            { text: `Sometimes. It has gradient ${p.c}.`, code: "ALG.LINE.M-C" },
          ],
          solution: [{ say: "y = c is horizontal; x = c is vertical." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return chosenText(question) === lineLatex(p.m, p.c);
    return true;
  },
});
