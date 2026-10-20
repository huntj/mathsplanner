/**
 * @statement Y9-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-NPV-01: Use the four operations with numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type Question, type QuestionDraft } from "@mathsplanner/core";
import { ordinary, sfDisplay, sfLatex, standardForm } from "../shared/standard-form.ts";

interface Params {
  op: "times" | "divide";
  /** First numbers in tenths: 3.2 is 32. For division, a = r × b and r is the answer's first number. */
  a: number;
  b: number;
  r: number;
  m: number;
  n: number;
  /** Depth 2: add or subtract a number with the next power down. */
  add: boolean;
}

const tenths = (t: number) => (t % 10 === 0 ? String(t / 10) : (t / 10).toFixed(1));
/** a, held in hundredths for division. */
const hundredths = (h: number) => ordinary(h, -2);
const sup = (n: number) =>
  [...String(n)].map((c) => (c === "-" ? "⁻" : "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)])).join("");

function sfValue(latex: string): number {
  const m = /^(\d(?:\.\d+)?)\\times10\^\{(-?\d+)\}$/.exec(latex);
  return m ? Number(m[1]) * 10 ** Number(m[2]) : Number.NaN;
}

function worked(p: Params) {
  if (p.op === "times") {
    const answer = standardForm(p.a * p.b, p.m + p.n - 2);
    const wrongPower = answer.power - (p.m + p.n) + p.m * p.n;
    return {
      left: tenths(p.a),
      right: tenths(p.b),
      answer,
      wrongPower,
      wrong: sfLatex(answer.mantissa, wrongPower),
      sign: "\\times",
      front: ordinary(p.a * p.b, -2),
      power: p.m + p.n,
      badPower: p.m * p.n,
    };
  }
  const answer = standardForm(p.r, p.m - p.n - 1);
  const wrongPower = answer.power + 2 * p.n;
  return {
    left: hundredths(p.r * p.b),
    right: tenths(p.b),
    answer,
    wrongPower,
    wrong: sfLatex(answer.mantissa, wrongPower),
    sign: "\\div",
    front: tenths(p.r),
    power: p.m - p.n,
    badPower: p.m + p.n,
  };
}

export default defineGenerator<Params>({
  id: "Y9-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.INDEX-LAWS"],

  params(rng, numbers) {
    const op = numbers === "friendly" ? "times" : rng.pick(["times", "divide"] as const);
    const range = numbers === "friendly" ? [2, 6] : numbers === "standard" ? [-6, 8] : [-12, 15];
    const [m, n] = [rng.int(range[0] ?? 2, range[1] ?? 6), rng.int(range[0] ?? 2, range[1] ?? 6)];
    if (m === 0 || n === 0 || m * n === m + n) reject("the index-law slip must change the power");
    const b = rng.int(11, numbers === "friendly" ? 50 : 90);
    const r = rng.int(11, 90);
    if (b % 10 === 0 || r % 10 === 0) reject("first numbers with one decimal place");
    const a = op === "times" ? rng.int(11, 90) : r;
    if (op === "divide" && (r * b < 100 || r * b >= 1000))
      reject("the number being divided must be between 1 and 10");
    if (op === "times" && a % 10 === 0) reject("first numbers with one decimal place");
    return { op, a, b, r, m, n, add: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const w = worked(p);
    const sum = `(${sfDisplay(w.left, p.m)}) ${w.sign} (${sfDisplay(w.right, p.n)})`;
    const rule =
      p.op === "times"
        ? `add the powers: ${p.m} + ${p.n} = ${w.power}`
        : `subtract the powers: ${p.m} − ${p.n} = ${w.power}`;
    const solution = [
      {
        say: `${p.op === "times" ? "Multiply" : "Divide"} the first numbers and ${rule}.`,
        math: `${w.front} \\times 10^{${w.power}}`,
      },
      ...(w.answer.mantissa === w.front && w.answer.power === w.power
        ? []
        : [{ say: "Adjust so the first number is between 1 and 10:", math: w.answer.display }]),
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Work out ", A.math(sum), "."],
          ask: "Give your answer in standard form.",
          answer: A.exact(w.answer.latex, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
              value: A.exact(w.wrong),
              feedback:
                p.op === "times"
                  ? `When you multiply powers of ten you add the powers: 10${sup(p.m)} × 10${sup(p.n)} = 10${sup(p.m + p.n)}.`
                  : `When you divide powers of ten you subtract the powers: 10${sup(p.m)} ÷ 10${sup(p.n)} = 10${sup(p.m - p.n)}.`,
            },
          ],
          solution,
        });
      case 2: {
        // a × 10^m ± b × 10^(m−1): line the numbers up before adding.
        const big = p.a * 10;
        const total = p.add ? big + p.b : big - p.b;
        const answer = standardForm(total, p.m - 2);
        const sign = p.add ? "+" : "-";
        const expr = `${sfDisplay(tenths(p.a), p.m)} ${sign} ${sfDisplay(tenths(p.b), p.m - 1)}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Work out ", A.math(expr), "."],
              ask: "Give your answer in standard form.",
            },
            {
              question: [
                p.add ? "Add " : "From ",
                A.math(sfDisplay(tenths(p.a), p.m)),
                p.add ? " and " : " take away ",
                A.math(sfDisplay(tenths(p.b), p.m - 1)),
                ".",
              ],
              ask: "Give your answer in standard form.",
            },
          ],
          answer: A.exact(answer.latex, "standard-form"),
          solution: [
            {
              say: "Write both with the same power of ten:",
              math: `${sfDisplay(tenths(p.a * 10), p.m - 1)} ${sign} ${sfDisplay(tenths(p.b), p.m - 1)} = ${sfDisplay(ordinary(total, -1), p.m - 1)}`,
            },
            { say: "Adjust so the first number is between 1 and 10:", math: answer.display },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Leo works out ", A.math(sum), "."],
          lines: [
            [
              A.math(
                `= (${w.left} ${w.sign} ${w.right}) \\times (10^{${p.m}} ${w.sign} 10^{${p.n}})`,
              ),
            ],
            [A.math(`= ${w.front} \\times 10^{${w.badPower}}`)],
            ["So the answer is ", A.math(sfDisplay(w.answer.mantissa, w.wrongPower)), "."],
          ],
          mistake: 1,
          code: "NPV.STANDARD-FORM.INDEX-LAWS",
          feedback: `Line 2 ${p.op === "times" ? "multiplies" : "adds"} the powers. To ${p.op === "times" ? "multiply" : "divide"} powers of ten, ${rule}, so the answer is ${w.answer.mantissa} × 10${sup(w.answer.power)}.`,
        });
    }
  },

  verify(p, question: Question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "spot-the-mistake";
    const got = sfValue(a.value);
    const expected =
      question.archetype === "varied-form"
        ? (p.a / 10) * 10 ** p.m + (p.add ? 1 : -1) * (p.b / 10) * 10 ** (p.m - 1)
        : p.op === "times"
          ? (p.a / 10) * 10 ** p.m * ((p.b / 10) * 10 ** p.n)
          : (((p.r * p.b) / 100) * 10 ** p.m) / ((p.b / 10) * 10 ** p.n);
    return Math.abs(got - expected) <= Math.abs(expected) * 1e-9;
  },
});
