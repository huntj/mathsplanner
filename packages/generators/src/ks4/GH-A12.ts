/**
 * @statement GH-A12
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A12: Recognise, sketch and interpret exponential graphs y = kˣ and trig graphs y = sin x, cos x,
// tan x for any angle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { numberAnswer } from "../shared/counting.ts";

type Trig = "sin" | "cos";

interface Params {
  k: 2 | 3;
  trig: Trig;
  /** Depth 2: a known angle whose sine or cosine is matched again. */
  angle: 30 | 45 | 60;
  claim: number;
}

function expGraph(k: number): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: -3, max: 3, step: 1 },
    y: { min: 0, max: 10, step: 1 },
    grid: true,
    curves: [{ y: `${k}^x`, domain: [-3, Math.log(10) / Math.log(k)] }],
    description:
      "A curve that rises ever more steeply from left to right, staying above the x-axis.",
  };
}

function trigGraph(y: string, label: string): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 360, step: 90 },
    y: { min: -1, max: 1, step: 0.5 },
    grid: true,
    curves: [{ y, domain: [0, 360], degrees: true }],
    description: `A trigonometric graph${label} for 0° ≤ x ≤ 360°.`,
  };
}

const CLAIMS = [
  {
    text: "the graph of y = 2^x crosses the x-axis",
    truth: false,
    why: "2^x is positive for every x: the curve gets closer and closer to the x-axis but never reaches it.",
  },
  {
    text: "every graph y = k^x with k > 0 passes through (0, 1)",
    truth: true,
    why: "k^0 = 1 for every positive k.",
  },
  {
    text: "the largest value of sin x is 90",
    truth: false,
    why: "sin x is never more than 1; its largest value, 1, happens when x = 90°.",
  },
] as const;

export default defineGenerator<Params>({
  id: "GH-A12",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.GRAPH.SHAPE", "ALG.TRIG.SYMMETRY"],

  params(rng) {
    return {
      k: rng.pick([2, 3] as const),
      trig: rng.pick(["sin", "cos"] as const),
      angle: rng.pick([30, 45, 60] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Here is the graph of a curve.", A.figure(expGraph(p.k))],
          ask: "Which equation could it be?",
          correct: A.math(`y = ${p.k}^x`),
          distractors: [
            {
              content: A.math(`y = x^${p.k}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: `y = x^${p.k} ${p.k === 2 ? "is a U-shaped parabola" : "goes below the x-axis for negative x"}.`,
            },
            {
              content: A.math(`y = ${p.k}x`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "That is a straight line through the origin.",
            },
            {
              content: A.math(`y = \\frac{${p.k}}{x}`),
              code: "ALG.GRAPH.SHAPE",
              feedback: "A reciprocal graph has two separate branches.",
            },
          ],
          solution: [
            {
              say: `The curve passes through (0, 1) and (1, ${p.k}), stays above the x-axis and grows faster and faster: an exponential graph.`,
            },
          ],
        });
      case 2: {
        const other = p.trig === "sin" ? 180 - p.angle : 360 - p.angle;
        const wrong = p.trig === "sin" ? 180 + p.angle : 180 - p.angle;
        const value =
          p.angle === 30
            ? p.trig === "sin"
              ? "0.5"
              : "\\frac{\\sqrt{3}}{2}"
            : p.angle === 45
              ? "\\frac{\\sqrt{2}}{2}"
              : p.trig === "sin"
                ? "\\frac{\\sqrt{3}}{2}"
                : "0.5";
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The graph shows y = ${p.trig} x for 0° ≤ x ≤ 360°.`,
                A.figure(trigGraph(`${p.trig}(x)`, "")),
                "One solution of ",
                A.math(`\\${p.trig} x = ${value}`),
                ` is x = ${p.angle}°.`,
              ],
              ask: "Use the symmetry of the graph to find the other solution between 0° and 360°.",
            },
          ],
          answer: A.number(other, { units: "°" }),
          wrong: [
            {
              code: "ALG.TRIG.SYMMETRY",
              value: A.number(wrong, { units: "°" }),
              feedback:
                p.trig === "sin"
                  ? "The sine graph is symmetrical about x = 90°, so the other solution is 180° − x."
                  : "The cosine graph is symmetrical about x = 180°, so the other solution is 360° − x.",
            },
          ],
          solution: [
            {
              say:
                p.trig === "sin"
                  ? `180° − ${p.angle}° = ${other}°.`
                  : `360° − ${p.angle}° = ${other}°.`,
            },
          ],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which graph shows ", A.math(`y = \\${p.trig} x`), " for 0° ≤ x ≤ 360°?"],
          correct: trigGraph(`${p.trig}(x)`, ""),
          distractors: [
            {
              figure: trigGraph(`${p.trig === "sin" ? "cos" : "sin"}(x)`, ""),
              code: "ALG.GRAPH.SHAPE",
              feedback:
                p.trig === "sin"
                  ? "y = sin x starts at 0, not 1."
                  : "y = cos x starts at 1, not 0.",
            },
            {
              figure: trigGraph(`-${p.trig}(x)`, ""),
              code: "ALG.GRAPH.SHAPE",
              feedback:
                p.trig === "sin"
                  ? "y = sin x rises to 1 at 90° first."
                  : "y = cos x starts at 1, at the top.",
            },
          ],
          solution: [
            {
              say:
                p.trig === "sin"
                  ? "sin 0° = 0, sin 90° = 1, sin 270° = −1."
                  : "cos 0° = 1, cos 180° = −1, cos 360° = 1.",
            },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] ?? (CLAIMS[0] as (typeof CLAIMS)[number]);
        return A.trueOrFalseWhy({
          rng,
          statement: `Kai says ${c.text}.`,
          truth: c.truth,
          reasons: c.truth
            ? [
                { text: `True. ${c.why}`, correct: true },
                { text: "False. It depends on the value of k.", code: "ALG.GRAPH.SHAPE" },
                {
                  text: "False. Exponential graphs pass through the origin.",
                  code: "ALG.GRAPH.SHAPE",
                },
              ]
            : [
                { text: `False. ${c.why}`, correct: true },
                { text: "True. Every curve crosses both axes somewhere.", code: "ALG.GRAPH.SHAPE" },
                { text: "True. You can read it from the axes." },
              ],
          solution: [{ say: c.why }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.trig === "sin" ? 180 - p.angle : 360 - p.angle);
    return true;
  },
});
