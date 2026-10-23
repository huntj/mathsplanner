/**
 * @statement FM-FP2-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP2-01: Use the division and Euclidean algorithms, modular arithmetic, Fermat's little theorem and
// divisibility tests
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

export interface Params {
  p: number;
  a: number;
  q: number;
  r: number;
  m: number;
  c: number;
  x: number;
}

/** bᵉ mod m by repeated squaring. */
function powMod(b: number, e: number, m: number): number {
  let out = 1;
  let base = b % m;
  for (let k = e; k > 0; k = Math.floor(k / 2)) {
    if (k % 2 === 1) out = (out * base) % m;
    base = (base * base) % m;
  }
  return out;
}

export default defineGenerator<Params>({
  id: "FM-FP2-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.MODULAR"],

  params(rng) {
    const p = rng.pick([5, 7, 11, 13]);
    const m = rng.pick([7, 9, 11, 13, 17]);
    const out = {
      p,
      a: rng.int(2, 9),
      q: rng.int(5, 30),
      r: rng.int(1, p - 2),
      m,
      c: rng.int(2, m - 1),
      x: rng.int(2, m - 1),
    };
    const N = (p - 1) * out.q + out.r;
    if (out.a % p === 0 || powMod(out.a, N % p, p) === powMod(out.a, out.r, p))
      reject("a base coprime to p and a revealing slip");
    if (
      gcdOf(out.c, m) !== 1 ||
      (out.c * ((out.c * out.x) % m)) % m === out.x ||
      out.x === (out.c * out.x) % m
    )
      reject("an invertible coefficient and a distinct slip");
    return out;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const N = (p.p - 1) * p.q + p.r;
        const v = powMod(p.a, p.r, p.p);
        return A.standard({
          question: [
            "Use Fermat's little theorem to find the remainder when ",
            A.math(`${p.a}^{${N}}`),
            " is divided by ",
            A.math(String(p.p)),
            ".",
          ],
          answer: A.number(v),
          wrong: [
            {
              code: "NPV.MODULAR",
              value: A.number(powMod(p.a, N % p.p, p.p)),
              feedback: `${p.a}^${p.p - 1} ≡ 1 (mod ${p.p}), so reduce the power modulo ${p.p - 1}, not ${p.p}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${N} = ${p.p - 1} \\times ${p.q} + ${p.r}, \\text{ so } ${p.a}^{${N}} \\equiv ${p.a}^{${p.r}} \\equiv ${v} \\pmod{${p.p}}`,
            },
          ],
        });
      }
      case 2: {
        const b = (p.c * p.x) % p.m;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(`${p.c}x \\equiv ${b} \\pmod{${p.m}}`),
                ", giving the solution with ",
                A.math(`0 \\le x < ${p.m}`),
                ".",
              ],
            },
          ],
          answer: A.number(p.x),
          wrong: [
            {
              code: "NPV.MODULAR",
              value: A.number((p.c * b) % p.m),
              feedback: `Multiply by the inverse of ${p.c} modulo ${p.m}, not by ${p.c} itself.`,
            },
          ],
          solution: [
            {
              say: `Check: ${p.c} × ${p.x} = ${p.c * p.x} = ${Math.floor((p.c * p.x) / p.m)} × ${p.m} + ${b}.`,
            },
          ],
        });
      }
      default: {
        const digitSum = (x: number) => [...String(x)].reduce((t, d) => t + Number(d), 0);
        let n = 11 * rng.int(10, 90);
        while (digitSum(n) % 11 === 0) n += 11;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Hana says a number is divisible by 11 exactly when its digit sum is divisible by 11. She tests ${n}.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. The test for 11 uses the alternating sum of the digits (units − tens + hundreds − …), because 10 ≡ −1 (mod 11).",
              correct: true,
            },
            { text: "True. The digit sum test works for every divisor.", code: "NPV.MODULAR" },
            { text: "True. It works for 3 and 9, so it works for 11.", code: "NPV.MODULAR" },
          ],
          solution: [{ say: `${n} is a multiple of 11, but its digit sum is ${digitSum(n)}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === powMod(p.a, (p.p - 1) * p.q + p.r, p.p);
    if (question.key.depth === 2) return (p.c * numberAnswer(question)) % p.m === (p.c * p.x) % p.m;
    return true;
  },
});
