/**
 * @statement Y9-ALG-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-04: Find the gradient and intercept of a straight line; identify parallel lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { lineLatex } from "../shared/alg.ts";

interface Params {
  x1: number;
  y1: number;
  dx: number;
  dy: number;
  m: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRADIENT.RUN-RISE", "ALG.LINE.M-C"],

  params(rng, numbers) {
    const dx = rng.int(1, 6);
    const dy = rng.int(1, 9) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const m = rng.int(2, 6) * rng.pick([1, -1]);
    const c = rng.int(1, 9) * rng.pick([1, -1]);
    if (Math.abs(dy) === dx || Math.abs(m) === Math.abs(c))
      reject("a gradient that is not ±1; m and c that differ");
    return { x1: rng.int(-5, 5), y1: rng.int(-5, 5), dx, dy, m, c };
  },

  build(p, depth, rng): QuestionDraft {
    const [x2, y2] = [p.x1 + p.dx, p.y1 + p.dy];
    const g = frac(p.dy, p.dx);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A straight line passes through ",
            A.math(`(${p.x1}, ${p.y1})`),
            " and ",
            A.math(`(${x2}, ${y2})`),
            ".",
          ],
          ask: "Find its gradient.",
          answer: A.exact(g),
          wrong: [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.exact(toLatex(frac(p.dx, p.dy))),
              feedback: "Gradient = change in y ÷ change in x: up over across.",
            },
          ],
          solution: [
            {
              say: `Change in y: ${y2} − ${p.y1 < 0 ? `(${p.y1})` : p.y1} = ${p.dy}. Change in x: ${x2} − ${p.x1 < 0 ? `(${p.x1})` : p.x1} = ${p.dx}. Gradient = ${p.dy} ÷ ${p.dx} = ${g.toString()}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which line is parallel to ", A.math(lineLatex(p.m, p.c)), "?"],
          correct: A.math(lineLatex(p.m, -p.c)),
          distractors: [
            {
              content: A.math(lineLatex(p.c, p.m)),
              code: "ALG.LINE.M-C",
              feedback: `Parallel lines have the same gradient, the number in front of x: ${p.m}.`,
            },
            {
              content: A.math(lineLatex(-p.m, p.c)),
              feedback: `That has gradient ${-p.m}: it slopes the other way.`,
            },
            {
              content: A.math(
                `y = ${toLatex(frac(1, p.m))}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`,
              ),
              feedback: `That has gradient ${frac(1, p.m).toString()}, not ${p.m}.`,
            },
          ],
          solution: [
            {
              say: `Parallel lines have equal gradients. y = ${p.m}x ${-p.c < 0 ? "−" : "+"} ${Math.abs(p.c)} has gradient ${p.m}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lee says ",
            A.math(lineLatex(p.m, p.c)),
            " and ",
            A.math(lineLatex(p.c, p.m)),
            " are parallel because they use the same numbers.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Their gradients are ${p.m} and ${p.c}. Parallel lines need the same gradient, the coefficient of x.`,
              correct: true,
            },
            { text: "True. Lines with the same two numbers are parallel.", code: "ALG.LINE.M-C" },
            { text: "True. All straight lines are parallel." },
          ],
          solution: [{ say: "In y = mx + c, m is the gradient and c is the y-intercept." }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return a.value === toLatex(frac(p.dy, p.dx));
    if (question.archetype === "varied-form") return chosenText(question) === lineLatex(p.m, -p.c);
    return true;
  },
});
