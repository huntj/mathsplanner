/**
 * @statement GH-N8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N8: Calculate exactly with surds; simplify surds (e.g. √12 = 2√3) and rationalise denominators
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Depth 1: √(a²b). Depth 2: √(a²b) + √(c²b). */
  a: number;
  b: number;
  c: number;
  /** Depth 3: four surds to simplify, as [outside, inside] pairs. */
  match: [number, number][];
  /** Depth 4: which claim. */
  claimSum: boolean;
  /** Depth 5: k(q² − qb)/(q + √qb) = k(q − √qb). */
  q: number;
  qb: number;
  k: number;
}

const SQUARE_FREE = [2, 3, 5, 6, 7, 10] as const;
const root = (n: number) => `\\sqrt{${n}}`;

export default defineGenerator<Params>({
  id: "GH-N8",
  version: "1.0.0",
  depths: [1, 2, 3, 4, 5],
  misconceptions: [
    "NPV.SURD.SIMPLIFY",
    "NPV.SURD.ADD-INSIDE",
    "NPV.SURD.RATIONALISE",
    "ALG.EXPAND.NEGATIVE",
  ],

  params(rng) {
    const a = rng.int(2, 6);
    const c = rng.int(2, 6);
    const b = rng.pick(SQUARE_FREE);
    // Four different surds with different values for the match.
    const match = rng
      .shuffle(SQUARE_FREE.flatMap((s) => [2, 3, 4, 5].map((o) => [o, s] as [number, number])))
      .slice(0, 4);
    const q = rng.int(2, 5);
    const qb = rng.pick(SQUARE_FREE);
    if (a === c || q * q <= qb) reject("different coefficients and a positive q² − b");
    return { a, b, c, match, claimSum: rng.bool(), q, qb, k: rng.int(1, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.a * p.a * p.b;
        return A.standard({
          question: ["Simplify ", A.math(root(n)), "."],
          answer: A.exact(Surd.term(p.a, p.b), "surd"),
          wrong: [
            {
              code: "NPV.SURD.SIMPLIFY",
              value: A.exact(Surd.term(p.a * p.a, p.b)),
              feedback: `${n} = ${p.a * p.a} × ${p.b}, and √${p.a * p.a} = ${p.a}, so ${p.a} comes outside the root.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${root(n)} = ${root(p.a * p.a)} \\times ${root(p.b)} = ${toLatex(Surd.term(p.a, p.b))}`,
            },
          ],
        });
      }
      case 2: {
        const x = p.a * p.a * p.b;
        const y = p.c * p.c * p.b;
        const sum = Surd.term(p.a + p.c, p.b);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Simplify ", A.math(`${root(x)} + ${root(y)}`), "."] },
            {
              question: [
                "Write ",
                A.math(`${root(x)} + ${root(y)}`),
                " in the form ",
                A.math("a\\sqrt{b}"),
                ".",
              ],
            },
          ],
          answer: A.exact(sum, "surd"),
          wrong: [
            {
              code: "NPV.SURD.ADD-INSIDE",
              value: A.exact(Surd.term(1, x + y)),
              feedback:
                "You cannot add the numbers under the roots. Simplify each surd first, then add like surds.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${root(x)} + ${root(y)} = ${toLatex(Surd.term(p.a, p.b))} + ${toLatex(Surd.term(p.c, p.b))} = ${toLatex(sum)}`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each surd to its simplest form.",
          pairs: p.match.map(
            ([o, s]) =>
              [A.math(root(o * o * s)), A.math(toLatex(Surd.term(o, s)))] as [
                A.RichInput,
                A.RichInput,
              ],
          ),
          solution: [{ say: "Find the largest square factor and take its square root outside." }],
        });
      case 4:
        return p.claimSum
          ? A.trueOrFalseWhy({
              rng,
              statement: [
                "Leo says ",
                A.math(`${root(p.a * p.a)} + ${root(p.b)} = ${root(p.a * p.a + p.b)}`),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. √${p.a * p.a} + √${p.b} = ${p.a} + √${p.b}, which is not √${p.a * p.a + p.b}. Roots do not add like that.`,
                  correct: true,
                },
                { text: "True. You add the numbers under the roots.", code: "NPV.SURD.ADD-INSIDE" },
                { text: "True. It works for multiplying, so it works for adding." },
              ],
              solution: [
                {
                  say: `Check with decimals: ${p.a} + ${Math.sqrt(p.b).toFixed(2)} = ${(p.a + Math.sqrt(p.b)).toFixed(2)}, but √${p.a * p.a + p.b} ≈ ${Math.sqrt(p.a * p.a + p.b).toFixed(2)}.`,
                },
              ],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: [
                "Leo says ",
                A.math(`${root(p.a)} \\times ${root(p.b)} = ${root(p.a * p.b)}`),
                ".",
              ],
              truth: true,
              reasons: [
                { text: "True. √x × √y = √(xy) for any positive x and y.", correct: true },
                { text: "False. You can only multiply surds with the same number inside." },
                { text: `False. It is √${p.a + p.b}.`, code: "NPV.SURD.ADD-INSIDE" },
              ],
              solution: [
                {
                  say: "Multiplying square roots multiplies the numbers inside; adding them does not add the numbers inside.",
                },
              ],
            });
      default: {
        const d = p.q * p.q - p.qb;
        const top = p.k * d;
        const product = Surd.from(p.q)
          .add(Surd.term(1, p.qb))
          .mul(Surd.from(p.q).sub(Surd.term(1, p.qb)));
        const result = Surd.from(top).div(Surd.from(p.q).add(Surd.term(1, p.qb)));
        return A.multiStepContext({
          context: [
            "This question is about the number ",
            A.math(`\\frac{${top}}{${p.q} + ${root(p.qb)}}`),
            ".",
          ],
          parts: [
            {
              ask: [
                "Expand and simplify ",
                A.math(`(${p.q} + ${root(p.qb)})(${p.q} - ${root(p.qb)})`),
                ".",
              ],
              answer: A.exact(product),
              wrong: [
                {
                  code: "ALG.EXPAND.NEGATIVE",
                  value: A.exact(p.q * p.q + p.qb),
                  feedback: `√${p.qb} × −√${p.qb} = −${p.qb}, so subtract.`,
                },
              ],
            },
            {
              ask: "Rationalise the denominator and simplify.",
              answer: A.exact(result),
              wrong: [
                {
                  code: "NPV.SURD.RATIONALISE",
                  value: A.exact(Surd.from(p.k).mul(Surd.from(p.q).add(Surd.term(1, p.qb)))),
                  feedback: "Multiply top and bottom by the conjugate, with the opposite sign.",
                },
              ],
            },
          ],
          solution: [
            { say: "The middle terms cancel: ", math: `${p.q * p.q} - ${p.qb} = ${d}` },
            { say: `Multiply top and bottom by ${p.q} − √${p.qb}: `, math: toLatex(result) },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(Surd.term(p.a, p.b));
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(Surd.term(p.a + p.c, p.b));
    if (question.key.depth === 5) {
      return a?.type === "exact" && a.value === String(p.q * p.q - p.qb);
    }
    return true;
  },
});
