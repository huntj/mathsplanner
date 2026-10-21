/**
 * @statement Y9-ALG-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-09: Solve linear inequalities in one variable and represent the solution on a number line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

interface Params {
  /** a·x + b (op) c, with solution x (op') k. */
  a: number;
  b: number;
  k: number;
  strict: boolean;
  greater: boolean;
}

const sym = (greater: boolean, strict: boolean) =>
  greater ? (strict ? ">" : "\\ge") : strict ? "<" : "\\le";
const line = (k: number, greater: boolean, strict: boolean): NumberLineSpec => ({
  type: "number-line",
  min: k - 5,
  max: k + 5,
  step: 1,
  intervals: [greater ? { from: k, fromIncluded: !strict } : { to: k, toIncluded: !strict }],
  description: "A number line with an inequality shown on it.",
});

export default defineGenerator<Params>({
  id: "Y9-ALG-09",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["ALG.INEQUALITY.FLIP", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const a = rng.int(2, 6) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const b = rng.int(1, 12) * rng.pick([1, -1]);
    const k = rng.int(-5, 8);
    if (k === 0) reject("a non-zero boundary");
    return { a, b, k, strict: rng.bool(), greater: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    // The inequality as given: a·x + b (op) a·k + b, where op is the solution's sign, flipped if a < 0.
    const given = sym(p.a < 0 ? !p.greater : p.greater, p.strict);
    const c = p.a * p.k + p.b;
    const lhs = `${p.a === -1 ? "-" : p.a}x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`;
    const answer = `x ${sym(p.greater, p.strict)} ${p.k}`;
    const flipped = `x ${sym(!p.greater, p.strict)} ${p.k}`;
    const how = `${p.b < 0 ? "Add" : "Subtract"} ${Math.abs(p.b)}: ${p.a}x ${given} ${c - p.b}. Divide by ${p.a}${p.a < 0 ? ", and because ${p.a} is negative, reverse the inequality" : ""}: ${answer}.`;
    switch (depth) {
      case 1:
      case 2:
        return A.choice({
          rng,
          archetype: depth === 1 ? "standard" : "varied-form",
          question: ["Solve ", A.math(`${lhs} ${given} ${c}`), "."],
          correct: A.math(answer),
          distractors: [
            {
              content: A.math(flipped),
              code: "ALG.INEQUALITY.FLIP",
              feedback:
                p.a < 0
                  ? "Dividing by a negative number reverses the inequality."
                  : "Dividing by a positive number keeps the inequality the same way round.",
            },
            {
              content: A.math(
                `x ${sym(p.greater, p.strict)} ${(c + p.b) / p.a === p.k ? p.k + 1 : Number(((c + p.b) / p.a).toFixed(2))}`,
              ),
              code: "ALG.SOLVE.WRONG-INVERSE",
              feedback: `Undo ${p.b < 0 ? "− " : "+ "}${Math.abs(p.b)} with the inverse first.`,
            },
            {
              content: A.math(`x ${sym(p.greater, !p.strict)} ${p.k}`),
              feedback: p.strict
                ? `The inequality is strict, so ${p.k} itself is not included.`
                : `${p.k} itself is included.`,
            },
          ],
          solution: [{ say: how.replace(/\\ge/g, "≥").replace(/\\le/g, "≤") }],
        });
      default:
        return A.chooseTheDiagram({
          rng,
          question: ["Which number line shows ", A.math(answer), "?"],
          correct: line(p.k, p.greater, p.strict),
          distractors: [
            {
              figure: line(p.k, !p.greater, p.strict),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `${p.greater ? "Greater" : "Less"} than ${p.k} goes to the ${p.greater ? "right" : "left"}.`,
            },
            {
              figure: line(p.k, p.greater, !p.strict),
              feedback: p.strict
                ? "A strict inequality uses an open circle: the end is not included."
                : "≤ and ≥ use a filled circle: the end is included.",
            },
          ],
          solution: [
            {
              say: `${p.strict ? "An open" : "A filled"} circle at ${p.k}, with the line going ${p.greater ? "right" : "left"}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") {
      const l = chosenFigure(question) as NumberLineSpec | undefined;
      const r = l?.intervals?.[0];
      return p.greater
        ? r?.from === p.k && r.fromIncluded === !p.strict
        : r?.to === p.k && r.toIncluded === !p.strict;
    }
    return chosenText(question) === `x ${sym(p.greater, p.strict)} ${p.k}`;
  },
});
