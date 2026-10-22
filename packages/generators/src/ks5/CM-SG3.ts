/**
 * @statement CM-SG3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG3: Sketch and interpret quadratic, reciprocal, y = xⁿ and exponential y = kˣ graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const SHAPES = [
  { words: "A U-shaped curve, symmetrical about the y-axis", eq: "y = x^2" },
  { words: "Two separate curves, never touching either axis", eq: "y = \\frac{1}{x}" },
  { words: "A curve through (0, 1) that rises more and more steeply", eq: "y = 2^x" },
  {
    words:
      "A curve through the origin, rising from bottom left to top right with a flat point at the origin",
    eq: "y = x^3",
  },
];

interface Params {
  s: number;
  a: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "CM-SG3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.SHAPE"],

  params(rng) {
    return { s: rng.int(0, SHAPES.length - 1), a: rng.int(2, 9), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const S = SHAPES[p.s] ?? (SHAPES[0] as (typeof SHAPES)[number]);
        return A.choice({
          rng,
          question: [`A graph is described as: "${S.words}".`],
          ask: "Which equation has this graph?",
          correct: A.math(S.eq),
          distractors: rng
            .shuffle(SHAPES.filter((x) => x !== S))
            .slice(0, 2)
            .map((x) => ({
              content: A.math(x.eq),
              code: "ALG.GRAPH.SHAPE",
              feedback: `That graph is ${x.words.charAt(0).toLowerCase()}${x.words.slice(1)}.`,
            })),
          solution: [{ say: `${S.words}: `, math: S.eq }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Where does the graph of ",
                A.math(`y = ${p.a} \\times ${p.k}^x`),
                " cross the y-axis?",
              ],
              ask: "Give the y-coordinate.",
            },
          ],
          answer: A.number(p.a),
          wrong: wrongs(p.a, [
            {
              code: "ALG.GRAPH.SHAPE",
              value: A.number(p.k),
              feedback: `At x = 0, ${p.k}⁰ = 1, so y = ${p.a} × 1.`,
            },
          ]),
          solution: [{ say: "", math: `y = ${p.a} \\times ${p.k}^0 = ${p.a}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gus says the graph of ",
            A.math("y = \\frac{1}{x}"),
            " crosses the x-axis somewhere far to the right.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. 1/x is never 0, so the curve gets closer and closer to the x-axis (an asymptote) without ever reaching it.",
              correct: true,
            },
            { text: "True. For large enough x, 1/x becomes 0.", code: "ALG.GRAPH.SHAPE" },
            { text: "True. Every curve crosses both axes.", code: "ALG.GRAPH.SHAPE" },
          ],
          solution: [{ say: "Similarly it never crosses the y-axis, because 1/0 is undefined." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === SHAPES[p.s]?.eq;
    if (question.key.depth === 2) return numberAnswer(question) === p.a;
    return true;
  },
});
