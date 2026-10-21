/**
 * @statement Y8-ALG-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-06: Recognise, sketch and produce graphs of linear functions of one variable with appropriate
// scaling, using equations in x and y and the Cartesian plane
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { clearOfOrigin, grid, lineLatex, poly } from "../shared/alg.ts";

interface Params {
  m: number;
  c: number;
  x: number;
  claimTrue: boolean;
}

const curveOf = (m: number, c: number) => `${m}*x + ${c}`;
const HIDDEN = "A straight line on a coordinate grid.";

export default defineGenerator<Params>({
  id: "Y8-ALG-06",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["ALG.LINE.M-C", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const m = rng.int(1, 3) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const c = rng.int(-4, 4);
    if (Math.abs(m) === Math.abs(c) || c === 0) reject("a gradient and intercept that differ");
    if (![clearOfOrigin(m, c), clearOfOrigin(c, m), clearOfOrigin(-m, c)].every(Boolean))
      reject("lines clear of the origin label");
    return { m, c, x: rng.int(-4, 5), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const eq = lineLatex(p.m, p.c);
    switch (depth) {
      case 1: {
        const y = p.m * p.x + p.c;
        return A.standard({
          question: ["A line has equation ", A.math(eq), "."],
          ask: ["Find y when ", A.math(`x = ${p.x}`), "."],
          answer: A.number(y),
          wrong: wrongs(y, [
            p.x !== 0
              ? {
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                  value: A.number(p.m * (p.x + p.c)),
                  feedback: `Multiply ${p.m} by x first, then ${p.c < 0 ? "subtract" : "add"} ${Math.abs(p.c)}.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: `y = ${p.m} × ${p.x < 0 ? `(${p.x})` : p.x} ${p.c < 0 ? "−" : "+"} ${Math.abs(p.c)} = ${y}.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which graph shows ", A.math(eq), "?"],
          correct: grid(6, [curveOf(p.m, p.c)], [], HIDDEN),
          distractors: [
            {
              figure: grid(6, [curveOf(p.c, p.m)], [], HIDDEN),
              code: "ALG.LINE.M-C",
              feedback: `That line crosses the y-axis at ${p.m} and has gradient ${p.c}: the numbers are swapped.`,
            },
            {
              figure: grid(6, [curveOf(-p.m, p.c)], [], HIDDEN),
              feedback: `That line slopes the wrong way: its gradient is ${-p.m}.`,
            },
          ],
          solution: [
            {
              say: `y = ${poly([p.m, p.c])} crosses the y-axis at ${p.c} and goes ${p.m > 0 ? "up" : "down"} ${Math.abs(p.m)} for every 1 across.`,
            },
          ],
        });
      default: {
        const px = p.x;
        const py = p.claimTrue ? p.m * px + p.c : p.m * px + p.c + 1;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Hal says the line ",
            A.math(eq),
            " passes through ",
            A.math(`(${px}, ${py})`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. When x = ${px}, y = ${p.m * px + p.c}, so (${px}, ${py}) is on the line.`,
                  correct: true,
                },
                { text: "False. Swap the coordinates and check again.", code: "ALG.LINE.M-C" },
                { text: "False. Lines only pass through points on the axes." },
              ]
            : [
                { text: `False. When x = ${px}, y = ${p.m * px + p.c}, not ${py}.`, correct: true },
                { text: "True. Any point close to the line is on it.", code: "ALG.LINE.M-C" },
                { text: "True. The y-coordinate is bigger than the x-coordinate." },
              ],
          solution: [{ say: `Substitute x = ${px}: y = ${p.m * px + p.c}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.m * p.x + p.c;
    if (question.archetype === "choose-the-diagram")
      return (
        (chosenFigure(question) as CartesianSpec | undefined)?.curves?.[0]?.y === curveOf(p.m, p.c)
      );
    return true;
  },
});
