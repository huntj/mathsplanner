/**
 * @statement AL-P2.5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.5.b: Interpret inequalities graphically and as regions, using set notation
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P2.5.ts";

interface Params {
  u: number;
  v: number;
  above: boolean;
}

const set = (a: string) => `\\{x : ${a}\\}`;

const own: GeneratorDefinition<Params> = {
  id: "AL-P2.5.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["ALG.INEQUALITY.QUADRATIC-REGION"],

  params(rng) {
    const p = { u: rng.int(-5, 3), v: rng.int(-2, 7), above: rng.bool() };
    if (p.v - p.u < 2) reject("two roots apart");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const curve = `y = ${poly([1, -(p.u + p.v), p.u * p.v])}`;
    const outside = `${set(`x < ${p.u}`)} \\cup ${set(`x > ${p.v}`)}`;
    const inside = set(`${p.u} < x < ${p.v}`);
    if (depth === 1) {
      return A.choice({
        rng,
        question: [
          "The curve ",
          A.math(curve),
          ` crosses the x-axis at x = ${p.u} and x = ${p.v}.`,
        ],
        ask: `For which values of x is the curve ${p.above ? "above" : "below"} the x-axis?`,
        correct: A.math(p.above ? outside : inside),
        distractors: [
          {
            content: A.math(p.above ? inside : outside),
            code: "ALG.INEQUALITY.QUADRATIC-REGION",
            feedback: `A positive x² curve is a ∪ shape: it is below the axis between the roots and above it outside them.`,
          },
          {
            content: A.math(
              p.above ? `${set(`x > ${p.u}`)} \\cap ${set(`x > ${p.v}`)}` : set(`x > ${p.u}`),
            ),
            code: "ALG.INEQUALITY.QUADRATIC-REGION",
            feedback: "Sketch the curve and look at both sides of the roots.",
          },
        ],
        solution: [
          {
            say: `The curve is ∪-shaped, so it is below the axis for ${p.u} < x < ${p.v} and above it outside.`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Ana says the set ",
        A.math(`${set(`x < ${p.u}`)} \\cap ${set(`x > ${p.v}`)}`),
        " contains every number outside the roots.",
      ],
      truth: false,
      reasons: [
        {
          text: `False. ∩ means both at once, and no number is below ${p.u} and above ${p.v}: the set is empty. ∪ joins the two parts.`,
          correct: true,
        },
        { text: "True. ∩ means 'or'.", code: "ALG.INEQUALITY.QUADRATIC-REGION" },
        { text: "True. Any two inequalities together cover the outside of the roots." },
      ],
      solution: [{ say: "∪ (union) means in either set; ∩ (intersection) means in both sets." }],
    });
  },

  verify(p, question) {
    if (question.key.depth !== 1) return true;
    return chosenText(question).includes(p.above ? `x < ${p.u}\\} \\cup` : `${p.u} < x < ${p.v}`);
  },
};

export default defineGenerator(
  mixFamilies("AL-P2.5.b", { 1: own, 2: { ...parent.definition, id: "AL-P2.5.b" }, 4: own }),
);
