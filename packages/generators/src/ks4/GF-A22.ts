/**
 * @statement GF-A22
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A22: Solve linear inequalities in one variable; represent the solution set on a number line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  x: number;
  strict: boolean;
  lo: number;
  hi: number;
}

const line = (
  from?: number,
  to?: number,
  fromIncluded = false,
  toIncluded = false,
): NumberLineSpec => ({
  type: "number-line",
  min: -6,
  max: 6,
  step: 1,
  intervals: [
    {
      ...(from === undefined ? {} : { from, fromIncluded }),
      ...(to === undefined ? {} : { to, toIncluded }),
    },
  ],
  description: "A number line from −6 to 6 showing an inequality.",
});

export default defineGenerator<Params>({
  id: "GF-A22",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.INEQUALITY.FLIP", "ALG.SOLVE.WRONG-INVERSE", "NPV.BOUNDS.ENDS"],

  params(rng) {
    const lo = rng.int(-5, 1);
    const hi = rng.int(lo + 2, 5);
    const x = rng.int(-4, 5);
    if (x === 0) reject("a non-zero boundary");
    return { a: rng.int(2, 6), b: rng.int(1, 12), x, strict: rng.bool(), lo, hi };
  },

  build(p, depth, rng): QuestionDraft {
    const sym = p.strict ? ">" : "\\ge";
    switch (depth) {
      case 1: {
        const rhs = p.a * p.x + p.b;
        const right = `x ${sym} ${p.x}`;
        return A.choice({
          rng,
          question: ["Solve ", A.math(`${p.a}x + ${p.b} ${sym} ${rhs}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x ${p.strict ? "<" : "\\le"} ${p.x}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "Only flip the sign when multiplying or dividing by a negative number.",
            },
            {
              content: A.math(`x ${sym} ${Math.round(((rhs + p.b) / p.a) * 100) / 100}`),
              code: "ALG.SOLVE.WRONG-INVERSE",
              feedback: `Subtract ${p.b} from both sides.`,
            },
          ],
          solution: [{ say: "", math: `${p.a}x ${sym} ${rhs - p.b} \\Rightarrow ${right}` }],
        });
      }
      case 2: {
        // −a·x < a·x0 ⇒ x > −x0
        const right = `x > ${-p.x}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Solve ", A.math(`-${p.a}x < ${p.a * p.x}`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x < ${-p.x}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `Dividing by −${p.a} reverses the inequality sign.`,
            },
            {
              content: A.math(`x > ${p.x}`),
              code: "ALG.SOLVE.WRONG-INVERSE",
              feedback: `${p.a * p.x} ÷ −${p.a} = ${-p.x}.`,
            },
          ],
          solution: [{ say: `Divide by −${p.a} and reverse the sign: `, math: right }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which number line shows ", A.math(`${p.lo} < x \\le ${p.hi}`), "?"],
          correct: line(p.lo, p.hi, false, true),
          distractors: [
            {
              figure: line(p.lo, p.hi, true, false),
              code: "NPV.BOUNDS.ENDS",
              feedback: `< ${p.lo} means ${p.lo} is not included (open circle); ≤ ${p.hi} means ${p.hi} is included (filled).`,
            },
            {
              figure: line(p.lo, p.hi, true, true),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${p.lo} is not included, so its circle is open.`,
            },
          ],
          solution: [
            {
              say: `Open circle at ${p.lo} (not included), filled circle at ${p.hi} (included), joined.`,
            },
          ],
        });
      default: {
        const ints = Array.from({ length: p.hi - p.lo }, (_, i) => p.lo + 1 + i);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kai says the integers that satisfy ",
            A.math(`${p.lo} < x \\le ${p.hi}`),
            ` are ${[p.lo, ...ints].join(", ")}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.lo} is not included, because x must be greater than ${p.lo}. The integers are ${ints.join(", ")}.`,
              correct: true,
            },
            { text: "True. Both ends are always included.", code: "NPV.BOUNDS.ENDS" },
            {
              text: `True. ${p.lo} is the first number in the inequality.`,
              code: "NPV.BOUNDS.ENDS",
            },
          ],
          solution: [{ say: `< leaves ${p.lo} out; ≤ keeps ${p.hi} in: ${ints.join(", ")}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `x ${p.strict ? ">" : "\\ge"} ${p.x}`;
    if (question.archetype === "varied-form") return chosenText(question) === `x > ${-p.x}`;
    if (question.archetype === "choose-the-diagram") {
      const iv = (chosenFigure(question) as NumberLineSpec | undefined)?.intervals?.[0];
      return iv?.fromIncluded === false && iv.toIncluded === true;
    }
    return true;
  },
});
