/**
 * @statement GH-A16.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A16.a: Use the equation of a circle centred at the origin
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

const PLACES = ["On the circle", "Inside the circle", "Outside the circle"];

interface Params {
  r: number;
  x: number;
  y: number;
  c: number;
}

const place = (p: Params) => {
  const d = p.x * p.x + p.y * p.y;
  return d === p.c ? 0 : d < p.c ? 1 : 2;
};

export default defineGenerator<Params>({
  id: "GH-A16.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.CIRCLE.RADIUS-SQUARED"],

  params(rng) {
    const p = {
      r: rng.int(2, 12),
      x: rng.int(-6, 6),
      y: rng.int(-6, 6),
      c: rng.pick([25, 50, 65, 85, 100]),
    };
    if (p.x === 0 || p.y === 0) reject("a point off the axes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["What is the radius of the circle ", A.math(`x^2 + y^2 = ${p.r * p.r}`), "?"],
          answer: A.number(p.r),
          wrong: wrongs(p.r, [
            {
              code: "ALG.CIRCLE.RADIUS-SQUARED",
              value: A.number(p.r * p.r),
              feedback: `x² + y² = r², so r = √${p.r * p.r}.`,
            },
          ]),
          solution: [{ say: "", math: `r = \\sqrt{${p.r * p.r}} = ${p.r}` }],
        });
      case 2: {
        const right = PLACES[place(p)] as string;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Where is the point ",
            A.math(coord([p.x, p.y])),
            " compared with the circle ",
            A.math(`x^2 + y^2 = ${p.c}`),
            "?",
          ],
          correct: right,
          distractors: PLACES.filter((x) => x !== right).map((x) => ({
            content: x,
            code: "ALG.CIRCLE.RADIUS-SQUARED",
            feedback: `Compare x² + y² = ${p.x * p.x + p.y * p.y} with ${p.c} (the radius squared), not with the radius.`,
          })),
          solution: [
            {
              say: `${p.x}² + ${p.y}² = ${p.x * p.x + p.y * p.y}, which is ${["equal to", "less than", "more than"][place(p)]} ${p.c}.`.replace(
                "+ -",
                "+ (−",
              ),
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Cal says the circle ",
            A.math(`x^2 + y^2 = ${p.r * p.r}`),
            " passes through ",
            A.math(coord([p.r, p.r])),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.r}² + ${p.r}² = ${2 * p.r * p.r}, not ${p.r * p.r}. The circle passes through (${p.r}, 0) and (0, ${p.r}).`,
              correct: true,
            },
            {
              text: `True. The radius is ${p.r}, so both coordinates are ${p.r}.`,
              code: "ALG.CIRCLE.RADIUS-SQUARED",
            },
            { text: "True. Every point with equal coordinates is on it." },
          ],
          solution: [
            { say: "A point is on the circle when x² + y² equals the number on the right." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.r;
    if (question.key.depth === 2) return chosenText(question) === PLACES[place(p)];
    return true;
  },
});
