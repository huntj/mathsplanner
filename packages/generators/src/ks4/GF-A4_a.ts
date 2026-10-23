/**
 * @statement GF-A4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.a: Collect like terms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";

const LETTERS = [
  ["x", "y"],
  ["a", "b"],
  ["m", "n"],
  ["p", "q"],
  ["s", "t"],
] as const;

interface Params {
  /** Coefficients of u, v, u, v in that order. */
  c: number[];
  pair: number;
  /** Depth 2: coefficients of x², x, x², x. */
  q: number[];
  /** Depth 3: three more expressions to match. */
  set: number[][];
  style: number;
}

const total = (c: number[]) => [(c[0] ?? 0) + (c[2] ?? 0), (c[1] ?? 0) + (c[3] ?? 0)];

export default defineGenerator<Params>({
  id: "GF-A4.a",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.LIKE-TERMS.UNLIKE", "ALG.LIKE-TERMS.SIGN"],

  params(rng, numbers) {
    const coef = () => {
      const size = rng.int(1, numbers === "stretch" ? 15 : 9);
      return numbers === "friendly" ? size : size * rng.pick([1, 1, -1]);
    };
    const four = () => [rng.int(2, 9), coef(), coef(), coef()];
    const p = {
      c: four(),
      pair: rng.int(0, LETTERS.length - 1),
      q: four(),
      set: [four(), four(), four()],
      style: rng.int(0, 1),
    };
    for (const c of [p.c, p.q, ...p.set]) {
      const [u, v] = total(c);
      if (u === 0 || v === 0 || u === 1 || v === 1) reject("two like terms that do not vanish");
    }
    if (new Set(p.set.map((c) => total(c).join())).size < 3) reject("three different answers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [u, v] = LETTERS[p.pair] ?? (LETTERS[0] as (typeof LETTERS)[number]);
    const [a = 0, b = 0, c = 0, d = 0] = p.c;
    const expr = (k: number[]) =>
      linear([
        [k[0] ?? 0, u],
        [k[1] ?? 0, v],
        [k[2] ?? 0, u],
        [k[3] ?? 0, v],
      ]);
    const simplified = (k: number[]) => {
      const [x, y] = total(k);
      return linear([
        [x ?? 0, u],
        [y ?? 0, v],
      ]);
    };
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Simplify ", A.math(expr(p.c)), "."],
          answer: A.exact(simplified(p.c), "collected"),
          wrong: [
            // With a subtracted term, the slip is losing its sign; otherwise, adding unlike terms.
            c < 0
              ? {
                  code: "ALG.LIKE-TERMS.SIGN",
                  value: A.exact(
                    linear([
                      [a - c, u],
                      [b + d, v],
                    ]),
                  ),
                  feedback: `Each term keeps the sign in front of it: ${linear([[c, u]])} takes ${Math.abs(c)}${u} away.`,
                }
              : {
                  code: "ALG.LIKE-TERMS.UNLIKE",
                  value: A.exact(`${a + b + c + d}${u}${v}`),
                  feedback: `${u} and ${v} terms are unlike: they are collected separately.`,
                },
          ],
          solution: [
            {
              say: `Collect the ${u} terms and the ${v} terms separately: `,
              math: simplified(p.c),
            },
          ],
        });
      case 2: {
        const [a2 = 0, b2 = 0, c2 = 0, d2 = 0] = p.q;
        const sq = `${u}^2`;
        const right = linear([
          [a2 + c2, sq],
          [b2 + d2, u],
        ]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Simplify ",
                A.math(
                  linear([
                    [a2, sq],
                    [b2, u],
                    [c2, sq],
                    [d2, u],
                  ]),
                ),
                ".",
              ],
            },
          ],
          answer: A.exact(right, "collected"),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.UNLIKE",
              value: A.exact(linear([[a2 + b2 + c2 + d2, sq]])),
              feedback: `${sq} and ${u} are unlike terms: they cannot be added together.`,
            },
          ],
          solution: [{ say: `${sq} terms and ${u} terms are collected separately: `, math: right }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each expression to its simplified form.",
          pairs: p.set.map(
            (k) => [A.math(expr(k)), A.math(simplified(k))] as [A.RichInput, A.RichInput],
          ),
          solution: p.set.map((k) => ({ say: "", math: `${expr(k)} = ${simplified(k)}` })),
        });
      default:
        if (p.style === 0 && c < 0) {
          const bad = linear([
            [a - c, u],
            [b + d, v],
          ]);
          return A.spotTheMistake({
            question: ["Kai simplifies ", A.math(expr(p.c)), "."],
            lines: [
              [
                A.math(
                  `= ${linear([
                    [a, u],
                    [-c, u],
                    [b, v],
                    [d, v],
                  ])}`,
                ),
              ],
              [A.math(`= ${bad}`)],
            ],
            mistake: 0,
            code: "ALG.LIKE-TERMS.SIGN",
            feedback: `Line 1 changes the sign of ${linear([[c, u]])}. Each term moves with the sign in front of it, giving ${simplified(p.c)}.`,
          });
        }
        return A.alwaysSometimesNever({
          rng,
          claim: ["For numbers a and b, ", A.math("3a + 2b = 5ab"), "."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. It works for a = b = 1 (5 = 5), but not for a = b = 2 (10 and 20). 3a and 2b are unlike terms, so 3a + 2b does not simplify.",
              correct: true,
            },
            {
              text: "Always. Add the numbers and write the letters together.",
              code: "ALG.LIKE-TERMS.UNLIKE",
            },
            { text: "Never. Letters can never be added." },
          ],
          solution: [
            { say: "Like terms have exactly the same letters and powers; 3a and 2b do not." },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) {
      const [u, v] = LETTERS[p.pair] ?? LETTERS[0];
      const [x = 0, y = 0] = total(p.c);
      return (
        a?.type === "exact" &&
        a.value ===
          linear([
            [x, u],
            [y, v],
          ])
      );
    }
    return true;
  },
});
