/**
 * @statement GF-A12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A12: Recognise, sketch and interpret graphs of linear functions, quadratic functions, simple
// cubic functions and the reciprocal function y = 1/x with x ≠ 0
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { grid } from "../shared/alg.ts";
import { chosenFigure, chosenText } from "../shared/counting.ts";

interface Params {
  kind: number;
  claim: number;
}

const KINDS: [string, string, string][] = [
  ["2x + 3", "straight line", "linear"],
  ["x^2 - 3", "U-shaped parabola", "quadratic"],
  ["x^3 + 3", "S-shaped cubic curve", "cubic"],
  ["4/x", "two-part reciprocal curve", "reciprocal"],
];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "The graph of y = 1/x crosses both axes.",
    truth: false,
    why: "x cannot be 0 and y is never 0, so the curve gets closer and closer to the axes but never meets them.",
  },
  {
    text: "The graph of y = x³ passes through the origin.",
    truth: true,
    why: "When x = 0, y = 0³ = 0.",
  },
  {
    text: "The graph of y = x² + 1 is a straight line.",
    truth: false,
    why: "The x² term makes it a U-shaped parabola.",
  },
];

export default defineGenerator<Params>({
  id: "GF-A12",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["ALG.GRAPH.SHAPE"],

  params(rng) {
    return { kind: rng.int(0, KINDS.length - 1), claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [expr, , name] = KINDS[p.kind] as (typeof KINDS)[number];
    const shown = (e: string) => grid(6, [e], [], "A graph on a coordinate grid.");
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "What type of graph is ",
            A.math(`y = ${expr.replace("4/x", "\\frac{4}{x}")}`),
            "?",
          ],
          correct: name,
          distractors: KINDS.filter((k) => k[2] !== name).map((k) => ({
            content: k[2],
            code: "ALG.GRAPH.SHAPE",
            feedback: `Look at the highest power of x: a ${k[2]} graph comes from ${k[0]}-type equations.`,
          })),
          solution: [
            { say: `y = ${expr} gives a ${(KINDS[p.kind] as (typeof KINDS)[number])[1]}.` },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [
            "Which graph shows ",
            A.math(`y = ${expr.replace("4/x", "\\frac{4}{x}")}`),
            "?",
          ],
          correct: shown(expr),
          distractors: KINDS.filter((k) => k[0] !== expr)
            .slice(0, 2)
            .map((k) => ({
              figure: shown(k[0]),
              code: "ALG.GRAPH.SHAPE",
              feedback: `That is a ${k[1]}.`,
            })),
          solution: [{ say: `y = ${expr} is a ${(KINDS[p.kind] as (typeof KINDS)[number])[1]}.` }],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Eva says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Every graph is a straight line or a parabola.`,
              code: "ALG.GRAPH.SHAPE",
            },
            {
              text: `${c.truth ? "False" : "True"}. All graphs pass through (0, 0).`,
              code: "ALG.GRAPH.SHAPE",
            },
          ],
          solution: [
            {
              say: "Linear: straight line. Quadratic: parabola. Cubic: S-shape. Reciprocal: two curves approaching the axes.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const [expr, , name] = KINDS[p.kind] as (typeof KINDS)[number];
    if (question.archetype === "standard") return chosenText(question) === name;
    if (question.archetype === "choose-the-diagram")
      return (chosenFigure(question) as CartesianSpec | undefined)?.curves?.[0]?.y === expr;
    return true;
  },
});
