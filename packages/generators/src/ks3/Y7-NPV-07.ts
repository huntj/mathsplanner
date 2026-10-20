/**
 * @statement Y7-NPV-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-07: Use integer powers and associated real roots (square, cube and higher); recognise powers
// of 2, 3, 4, 5; distinguish exact representations of roots from their decimal approximations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

type Kind = "power" | "square-root" | "cube-root";

interface Params {
  kind: Kind;
  base: number;
  exp: number;
  /** Three different powers for matching, as [base, exponent]. */
  set: [number, number][];
  claim: number;
}

const value = (k: Kind, base: number, exp: number) => (k === "power" ? base ** exp : base);
const latexOf = (k: Kind, base: number, exp: number) =>
  k === "power"
    ? `${base}^{${exp}}`
    : k === "square-root"
      ? `\\sqrt{${base * base}}`
      : `\\sqrt[3]{${base ** 3}}`;

export default defineGenerator<Params>({
  id: "Y7-NPV-07",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.POWER.TIMES-INDEX", "NPV.POWER.ROOT-HALF", "NPV.ROOT.EXACT-DECIMAL"],

  params(rng, numbers) {
    const kind = rng.pick(
      numbers === "friendly"
        ? (["power", "square-root"] as const)
        : (["power", "square-root", "cube-root"] as const),
    );
    const base =
      kind === "power"
        ? rng.int(2, 5)
        : rng.int(numbers === "stretch" ? 6 : 2, kind === "cube-root" ? 6 : 15);
    const exp =
      kind === "power"
        ? rng.int(numbers === "friendly" ? 2 : 3, numbers === "stretch" ? 6 : 4)
        : kind === "square-root"
          ? 2
          : 3;
    const set: [number, number][] = [
      [2, rng.int(3, 6)],
      [3, rng.int(2, 4)],
      [rng.pick([4, 5]), 2],
    ];
    if (new Set(set.map(([b, e]) => b ** e)).size < 3) reject("repeated values");
    if (kind === "power" && base ** exp === base * exp)
      reject("2² = 2 × 2 hides the misconception");
    return { kind, base, exp, set, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const answer = value(p.kind, p.base, p.exp);
        const radicand = p.kind === "square-root" ? p.base * p.base : p.base ** 3;
        const wrong =
          p.kind === "power"
            ? [
                {
                  code: "NPV.POWER.TIMES-INDEX",
                  value: A.number(p.base * p.exp),
                  feedback: `${p.base} to the power ${p.exp} means ${p.exp} lots of ${p.base} multiplied together, not ${p.base} × ${p.exp}.`,
                },
              ]
            : Number.isInteger(radicand / (p.kind === "square-root" ? 2 : 3))
              ? [
                  {
                    code: "NPV.POWER.ROOT-HALF",
                    value: A.number(radicand / (p.kind === "square-root" ? 2 : 3)),
                    feedback: `A ${p.kind === "square-root" ? "square" : "cube"} root is the number that multiplies by itself to make ${radicand}, not ${radicand} ÷ ${p.kind === "square-root" ? 2 : 3}.`,
                  },
                ]
              : [];
        return A.standard({
          question: [A.math(latexOf(p.kind, p.base, p.exp))],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, wrong),
          solution: [
            p.kind === "power"
              ? { say: `${Array.from({ length: p.exp }, () => p.base).join(" × ")} = ${answer}.` }
              : {
                  say: `${answer} × ${answer}${p.kind === "cube-root" ? ` × ${answer}` : ""} = ${radicand}, so the ${p.kind === "square-root" ? "square" : "cube"} root is ${answer}.`,
                },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each power to its value.",
          pairs: p.set.map(
            ([b, e]) =>
              [A.math(`${b}^{${e}}`), A.math(String(b ** e))] as [A.RichInput, A.RichInput],
          ),
          solution: p.set.map(([b, e]) => ({
            say: `${b}^${e} = ${Array.from({ length: e }, () => b).join(" × ")} = ${b ** e}.`,
          })),
        });
      default: {
        const claims = [
          {
            statement: [A.math("\\sqrt{2} = 1.414"), "."],
            truth: false,
            reasons: [
              {
                text: "1.414 is only an approximation: 1.414² = 1.999396. √2 has no exact decimal, so we leave it as √2.",
                correct: true,
              },
              { text: "Yes, 1.414 is the exact value of √2.", code: "NPV.ROOT.EXACT-DECIMAL" },
              { text: "√2 = 1, because the square root makes numbers smaller." },
            ],
          },
          {
            statement: [A.math(`\\sqrt{${p.base * p.base * 4}} = ${p.base * p.base * 2}`), "."],
            truth: false,
            reasons: [
              {
                text: `${p.base * 2} × ${p.base * 2} = ${p.base * p.base * 4}, so the square root is ${p.base * 2}.`,
                correct: true,
              },
              { text: "The square root is half the number.", code: "NPV.POWER.ROOT-HALF" },
              { text: "Square roots cannot be whole numbers." },
            ],
          },
          {
            statement: [A.math("2^{5} = 10"), "."],
            truth: false,
            reasons: [
              { text: "2⁵ = 2 × 2 × 2 × 2 × 2 = 32.", correct: true },
              { text: "2⁵ means 2 × 5 = 10.", code: "NPV.POWER.TIMES-INDEX" },
              { text: "2⁵ = 25, the digits side by side." },
            ],
          },
        ];
        const c = claims[p.claim] ?? claims[0];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const v = numberAnswer(question);
      return p.kind === "power"
        ? v === p.base ** p.exp
        : p.kind === "square-root"
          ? v * v === p.base * p.base
          : v ** 3 === p.base ** 3;
    }
    return true;
  },
});
