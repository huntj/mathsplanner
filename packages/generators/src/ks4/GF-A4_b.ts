/**
 * @statement GF-A4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.b: Expand a single bracket
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";

interface Params {
  k: number;
  a: number;
  b: number;
  m: number;
  n: number;
  set: number[][];
  style: number;
}

/** k(ax + b) as LaTeX. */
const bracketed = (k: number, a: number, b: number) =>
  `${k === 1 ? "" : k === -1 ? "-" : k}(${linear([
    [a, "x"],
    [b, ""],
  ])})`;
const expanded = (k: number, a: number, b: number) =>
  linear([
    [k * a, "x"],
    [k * b, ""],
  ]);

export default defineGenerator<Params>({
  id: "GF-A4.b",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.EXPAND.NEGATIVE"],

  params(rng, numbers) {
    const big = numbers === "stretch" ? 12 : 9;
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const p = {
      k: rng.int(2, big),
      a: rng.int(1, numbers === "friendly" ? 1 : 5),
      b: rng.int(1, big) * sign(),
      m: rng.int(2, 6),
      n: rng.int(1, 9),
      set: [0, 1, 2].map(() => [rng.int(2, 7), rng.int(1, 4), rng.int(1, 9) * sign()]),
      style: rng.int(0, 1),
    };
    if (new Set(p.set.map(([k = 0, a = 0, b = 0]) => expanded(k, a, b))).size < 3)
      reject("three different expansions");
    if (p.k * p.a === p.m) reject("an x term that does not vanish in depth 2");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = expanded(p.k, p.a, p.b);
        return A.standard({
          question: ["Expand ", A.math(bracketed(p.k, p.a, p.b)), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.exact(
                linear([
                  [p.k * p.a, "x"],
                  [p.b, ""],
                ]),
              ),
              feedback: `Multiply every term in the bracket by ${p.k}, including ${p.b}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.k} \\times ${linear([[p.a, "x"]])} ${p.b < 0 ? "-" : "+"} ${p.k} \\times ${Math.abs(p.b)} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        // k(ax + b) − m(x − n)
        const x = p.k * p.a - p.m;
        const c = p.k * p.b + p.m * p.n;
        const right = linear([
          [x, "x"],
          [c, ""],
        ]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Expand and simplify ",
                A.math(`${bracketed(p.k, p.a, p.b)} - ${p.m}(x - ${p.n})`),
                ".",
              ],
            },
            {
              question: [
                "Multiply out and simplify ",
                A.math(`${bracketed(p.k, p.a, p.b)} - ${p.m}(x - ${p.n})`),
                ".",
              ],
            },
          ],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.exact(
                linear([
                  [x, "x"],
                  [p.k * p.b - p.m * p.n, ""],
                ]),
              ),
              feedback: `−${p.m} × −${p.n} = +${p.m * p.n}: the minus sign multiplies both terms in the bracket.`,
            },
          ],
          solution: [
            { say: "", math: `${expanded(p.k, p.a, p.b)} - ${p.m}x + ${p.m * p.n} = ${right}` },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each expression to its expansion.",
          pairs: p.set.map(
            ([k = 2, a = 1, b = 1]) =>
              [A.math(bracketed(k, a, b)), A.math(expanded(k, a, b))] as [A.RichInput, A.RichInput],
          ),
          solution: p.set.map(([k = 2, a = 1, b = 1]) => ({
            say: "",
            math: `${bracketed(k, a, b)} = ${expanded(k, a, b)}`,
          })),
        });
      default: {
        const right = linear([
          [-p.m, "x"],
          [p.m * p.n, ""],
        ]);
        const bad = linear([
          [-p.m, "x"],
          [-p.m * p.n, ""],
        ]);
        if (p.style === 0)
          return A.spotTheMistake({
            question: ["Ava expands ", A.math(`-${p.m}(x - ${p.n})`), "."],
            lines: [[A.math(`= -${p.m} \\times x - ${p.m} \\times ${p.n}`)], [A.math(`= ${bad}`)]],
            mistake: 0,
            code: "ALG.EXPAND.NEGATIVE",
            feedback: `−${p.m} × −${p.n} is +${p.m * p.n}, so the answer is ${right}.`,
          });
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ben says ", A.math(`-${p.m}(x - ${p.n}) = ${bad}`), "."],
          truth: false,
          reasons: [
            { text: `False. −${p.m} × −${p.n} = +${p.m * p.n}, so it is ${right}.`, correct: true },
            {
              text: "True. The minus sign only applies to the x term.",
              code: "ALG.EXPAND.NEGATIVE",
            },
            {
              text: `True. Multiply ${p.m} by each term and keep the signs.`,
              code: "ALG.EXPAND.NEGATIVE",
            },
          ],
          solution: [{ say: "", math: `-${p.m}(x - ${p.n}) = ${right}` }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === expanded(p.k, p.a, p.b);
    return true;
  },
});
