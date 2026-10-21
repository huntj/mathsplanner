/**
 * @statement GF-N4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N4: Use the concepts and vocabulary of prime numbers, factors, multiples, common factors,
// common multiples, HCF, LCM and prime factorisation, including product notation and the unique
// factorisation theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, gcd, lcm, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Exponents of 2, 3, 5 and 7. */
  x: [number, number, number, number];
  y: [number, number, number, number];
  a: number;
  b: number;
  start: number;
}

const PRIMES = [2, 3, 5, 7];
const value = (e: readonly number[]) => e.reduce((n, k, i) => n * (PRIMES[i] ?? 1) ** k, 1);
const index = (e: readonly number[]) =>
  e
    .map((k, i) => (k === 0 ? "" : k === 1 ? String(PRIMES[i]) : `${PRIMES[i]}^{${k}}`))
    .filter(Boolean)
    .join(" \\times ");
const g = (a: number, b: number) => Number(gcd(BigInt(a), BigInt(b)));
const l = (a: number, b: number) => Number(lcm(BigInt(a), BigInt(b)));

export default defineGenerator<Params>({
  id: "GF-N4",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["NPV.FACTOR.NOT-PRIME", "NPV.FACTOR.HCF-LCM", "NPV.FACTOR.LCM-PRODUCT"],

  params(rng, numbers) {
    const e = () =>
      [rng.int(0, 3), rng.int(0, 2), rng.int(0, 1), numbers === "stretch" ? rng.int(0, 1) : 0] as [
        number,
        number,
        number,
        number,
      ];
    const x = e();
    const y = e();
    if (value(x) < 12 || value(y) < 12 || value(x) === value(y) || value(x) > 600 || value(y) > 600)
      reject("two different numbers of a sensible size");
    if (x.filter((k) => k > 0).length < 2) reject("a number with at least two prime factors");
    if (g(value(x), value(y)) === 1 || g(value(x), value(y)) === Math.min(value(x), value(y)))
      reject("numbers that share some factors");
    const a = rng.pick([6, 8, 10, 12, 15]);
    const b = rng.pick([9, 12, 14, 18, 20]);
    if (a === b || g(a, b) === 1 || l(a, b) > 120) reject("bus gaps with a useful common multiple");
    return { x, y, a, b, start: rng.int(7, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const X = value(p.x);
    const Y = value(p.y);
    switch (depth) {
      case 1: {
        const right = index(p.x);
        // A factorisation using a factor that is not prime, e.g. 4 × 3² instead of 2² × 3².
        const rest = index([p.x[0] - 2, p.x[1], p.x[2], p.x[3]]);
        const notPrime = p.x[0] >= 2 ? (rest ? `4 \\times ${rest}` : "4") : `1 \\times ${right}`;
        return A.choice({
          rng,
          question: [
            "Write ",
            A.math(String(X)),
            " as a product of its prime factors, in index form.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(notPrime),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "Every factor must be prime: break down any that are not.",
            },
            {
              content: A.math(index([p.x[1], p.x[0], p.x[2], p.x[3]])),
              feedback: `Check by multiplying out: that gives ${value([p.x[1], p.x[0], p.x[2], p.x[3]])}.`,
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(right))),
          solution: [{ say: "Divide by primes until you reach 1: ", math: `${X} = ${right}` }],
        });
      }
      case 2: {
        const ask = rng.bool() ? "HCF" : "LCM";
        const right = ask === "HCF" ? g(X, Y) : l(X, Y);
        const other = ask === "HCF" ? l(X, Y) : g(X, Y);
        return A.standard({
          question: [
            "Given that ",
            A.math(`${X} = ${index(p.x)}`),
            " and ",
            A.math(`${Y} = ${index(p.y)}`),
            ",",
          ],
          ask: `find the ${ask === "HCF" ? "highest common factor" : "lowest common multiple"} of ${X} and ${Y}.`,
          answer: A.number(right),
          wrong: wrongs(right, [
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(other),
              feedback:
                ask === "HCF"
                  ? "That is the LCM. For the HCF take the lower power of each shared prime."
                  : "That is the HCF. For the LCM take the higher power of every prime.",
            },
            ...(ask === "LCM"
              ? [
                  {
                    code: "NPV.FACTOR.LCM-PRODUCT",
                    value: A.number(X * Y),
                    feedback: "Multiplying the numbers counts the shared factors twice.",
                  },
                ]
              : []),
          ]),
          solution: [
            {
              say:
                ask === "HCF"
                  ? "Lowest power of each shared prime: "
                  : "Highest power of each prime: ",
              math: `${right}`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `Leah says the LCM of ${X} and ${Y} is ${X} × ${Y} = ${X * Y}.`,
          truth: false,
          reasons: [
            {
              text: `False. ${X} and ${Y} share a factor of ${g(X, Y)}, so their LCM is ${X * Y} ÷ ${g(X, Y)} = ${l(X, Y)}.`,
              correct: true,
            },
            {
              text: "True. The LCM is always the product of the two numbers.",
              code: "NPV.FACTOR.LCM-PRODUCT",
            },
            { text: "True. Every common multiple is the product.", code: "NPV.FACTOR.LCM-PRODUCT" },
          ],
          solution: [
            { say: `The product equals the LCM only when the HCF is 1. Here HCF = ${g(X, Y)}.` },
          ],
        });
      default: {
        const m = l(p.a, p.b);
        const h = p.start + Math.floor(m / 60);
        const min = m % 60;
        const time = `${h}:${String(min).padStart(2, "0")} am`;
        return A.multiStepContext({
          context: `Bus A leaves the station every ${p.a} minutes and bus B every ${p.b} minutes. Both leave together at ${p.start}:00 am.`,
          parts: [
            {
              ask: "After how many minutes do they next leave together?",
              answer: A.number(m, { units: "minutes" }),
              wrong: wrongs(m, [
                {
                  code: "NPV.FACTOR.LCM-PRODUCT",
                  value: A.number(p.a * p.b),
                  feedback: `${p.a} × ${p.b} is a common multiple, but not the lowest.`,
                },
                {
                  code: "NPV.FACTOR.HCF-LCM",
                  value: A.number(g(p.a, p.b)),
                  feedback: "That is the HCF. You need the lowest common multiple.",
                },
              ]),
            },
            {
              ask: "At what time is that? Give the number of minutes past the hour.",
              answer: A.number(min),
            },
          ],
          solution: [
            { say: `LCM(${p.a}, ${p.b}) = ${m} minutes.` },
            { say: `${p.start}:00 + ${m} minutes = ${time}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === index(p.x);
    if (question.archetype === "multi-step-context") return numberAnswer(question) === l(p.a, p.b);
    return true;
  },
});
