/**
 * @statement Y7-NPV-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-09: Use approximation through rounding to estimate answers and calculate possible resulting
// errors expressed using inequality notation a < x ≤ b
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: estimate a calculation, or give one bound of a rounded measurement. */
  task: "estimate" | "lower" | "upper";
  /** The estimate: a (one decimal place) times or divided by b (two decimal places). */
  a: number;
  b: number;
  op: "times" | "divide";
  /** The measurement is n × 10^e, rounded (or truncated) to the nearest 10^e. */
  n: number;
  e: number;
  truncated: boolean;
  context: number;
  claimTrue: boolean;
}

const CONTEXTS = [
  { says: "The length of a rope is", letter: "l", units: "m" },
  { says: "The mass of a load is", letter: "m", units: "kg" },
  { says: "The distance of a journey is", letter: "d", units: "km" },
  { says: "The time for a task is", letter: "t", units: "min" },
] as const;

/** k × 10^e, written with just enough decimal places. */
const scaled = (k: number, e: number) => (k * 10 ** e).toFixed(Math.max(0, -e));
const accuracy = (e: number) =>
  e > 0
    ? `the nearest ${10 ** e}`
    : e === 0
      ? "the nearest whole number"
      : `${-e} decimal place${e === -1 ? "" : "s"}`;
const oneSf = (x: number) => Number(x.toPrecision(1));

function bounds(p: Params) {
  // Half-units are 5 × 10^(e−1), so work in those to stay exact.
  const lower = p.truncated ? scaled(p.n, p.e) : scaled(10 * p.n - 5, p.e - 1);
  const upper = p.truncated ? scaled(p.n + 1, p.e) : scaled(10 * p.n + 5, p.e - 1);
  return { value: scaled(p.n, p.e), lower, upper };
}

function estimate(p: Params) {
  const [ra, rb] = [oneSf(p.a), oneSf(p.b)];
  const value = p.op === "times" ? ra * rb : ra / rb;
  // Rounding a to the nearest whole number instead of 1 significant figure.
  const whole = p.op === "times" ? Math.round(p.a) * rb : Math.round(p.a) / rb;
  return { ra, rb, value, whole };
}

export default defineGenerator<Params>({
  id: "Y7-NPV-09",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.BOUNDS.ENDS", "NPV.ROUND.WRONG-PLACE"],

  params(rng, numbers) {
    const op = numbers === "friendly" ? "times" : rng.pick(["times", "divide"] as const);
    const a = rng.int(110, 940) / 10;
    const b = rng.int(110, 940) / 100;
    if (Math.round(a * 10) % 50 === 0 || Math.round(b * 100) % 50 === 0)
      reject("no halfway values");
    if (Math.round(a * 10) % 10 === 5 || Math.round(a * 10) % 100 < 10)
      reject("a must round clearly");
    if (op === "divide" && oneSf(a) % oneSf(b) !== 0) reject("the estimate should divide exactly");
    const e = rng.pick(
      numbers === "friendly" ? [0, -1] : numbers === "standard" ? [1, 0, -1] : [1, -1, -2],
    );
    const n = rng.int(e === 1 ? 12 : e === -2 ? 120 : 3, e === 1 ? 98 : e === -2 ? 980 : 98);
    if (n % 10 === 0) reject("a value that is not a whole number of the next unit up");
    const truncated = (e === 0 || e === -1) && rng.bool(0.3);
    const p: Params = {
      task: rng.pick(["estimate", "lower", "upper"] as const),
      a,
      b,
      op,
      n,
      e,
      truncated,
      context: rng.int(0, CONTEXTS.length - 1),
      claimTrue: rng.bool(),
    };
    const est = estimate(p);
    if (est.whole === est.value || est.value <= 0)
      reject("rounding to the wrong place must change the estimate");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const c = CONTEXTS[p.context] ?? CONTEXTS[0];
    const b = bounds(p);
    const how = p.truncated
      ? `truncated to ${p.e === 0 ? "a whole number" : accuracy(p.e)}`
      : `correct to ${accuracy(p.e)}`;
    const stem = [`${c.says} `, A.math(`${b.value}\\text{ ${c.units}}`), `, ${how}.`];
    const interval = `${b.lower} \\le ${c.letter} < ${b.upper}`;
    const why = p.truncated
      ? `Truncating chops off digits, so ${c.letter} could be anything from ${b.lower} up to, but not including, ${b.upper}.`
      : `Half of ${scaled(1, p.e)} is ${scaled(5, p.e - 1)}. Anything from ${b.lower} up to, but not including, ${b.upper} rounds to ${b.value}.`;
    switch (depth) {
      case 1: {
        if (p.task === "estimate") {
          const est = estimate(p);
          const sign = p.op === "times" ? "\\times" : "\\div";
          return A.standard({
            question: [
              "Estimate ",
              A.math(`${p.a} ${sign} ${p.b.toFixed(2)}`),
              " by rounding each number to 1 significant figure.",
            ],
            answer: A.number(est.value),
            wrong: wrongs(est.value, [
              {
                code: "NPV.ROUND.WRONG-PLACE",
                value: A.number(est.whole),
                feedback: `Round to 1 significant figure, not to the nearest whole number: ${p.a} ≈ ${est.ra}.`,
              },
            ]),
            solution: [
              {
                say: `${p.a} ≈ ${est.ra} and ${p.b.toFixed(2)} ≈ ${est.rb}.`,
                math: `${est.ra} ${sign} ${est.rb} = ${est.value}`,
              },
            ],
          });
        }
        const lower = p.task === "lower";
        const answer = Number(lower ? b.lower : b.upper);
        const fullUnit = Number(scaled(lower ? p.n - 1 : p.n + 1, p.e));
        return A.standard({
          question: stem,
          ask: [`Write down the ${lower ? "lower" : "upper"} bound of `, A.math(c.letter), "."],
          answer: A.number(answer, { units: c.units }),
          wrong: wrongs(
            answer,
            p.truncated
              ? []
              : [
                  {
                    code: "NPV.BOUNDS.ENDS",
                    value: A.number(fullUnit, { units: c.units }),
                    feedback: `The bounds are half a unit either side of ${b.value}, not a whole unit.`,
                  },
                ],
          ),
          solution: [{ say: why }],
        });
      }
      case 2: {
        const swapped = `${b.lower} < ${c.letter} \\le ${b.upper}`;
        const other = p.truncated
          ? `${scaled(10 * p.n - 5, p.e - 1)} \\le ${c.letter} < ${scaled(10 * p.n + 5, p.e - 1)}`
          : `${scaled(p.n, p.e)} \\le ${c.letter} < ${scaled(p.n + 1, p.e)}`;
        const wide = `${scaled(p.n - 1, p.e)} \\le ${c.letter} < ${scaled(p.n + 1, p.e)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: stem,
          ask: ["Which is the error interval for ", A.math(c.letter), "?"],
          correct: A.math(interval),
          distractors: [
            {
              content: A.math(swapped),
              code: "NPV.BOUNDS.ENDS",
              feedback: `${b.lower} itself ${p.truncated ? "truncates" : "rounds"} to ${b.value}, so it is included; ${b.upper} is not.`,
            },
            {
              content: A.math(other),
              feedback: p.truncated
                ? "That is the interval for rounding. Truncating never goes up."
                : "That is the interval for truncating. Rounding can go up as well as down.",
            },
            {
              content: A.math(wide),
              code: "NPV.BOUNDS.ENDS",
              feedback:
                "That is a whole unit either side; the interval is only one unit wide altogether.",
            },
          ],
          solution: [{ say: why }, { say: "So", math: interval }],
        });
      }
      default: {
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...stem,
            " Ali says ",
            A.math(c.letter),
            " could be ",
            A.math(`${p.claimTrue ? b.lower : b.upper}\\text{ ${c.units}}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${b.lower} is the lower bound, and it ${p.truncated ? "truncates" : "rounds"} to ${b.value}, so it is included.`,
                  correct: true,
                },
                {
                  text: "False: the bounds themselves are never included.",
                  code: "NPV.BOUNDS.ENDS",
                },
                { text: `False: it must be exactly ${b.value}.` },
              ]
            : [
                {
                  text: `False. ${b.upper} ${p.truncated ? "truncates" : "rounds"} to ${scaled(p.n + 1, p.e)}, so ${c.letter} < ${b.upper}.`,
                  correct: true,
                },
                {
                  text: `True: ${b.upper} is the upper bound, so it is the biggest value ${c.letter} can be.`,
                  code: "NPV.BOUNDS.ENDS",
                },
                { text: "True: any number with the same first digit is possible." },
              ],
          solution: [{ say: why }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form") {
      const c = CONTEXTS[p.context] ?? CONTEXTS[0];
      const b = bounds(p);
      return chosenText(question) === `${b.lower} \\le ${c.letter} < ${b.upper}`;
    }
    if (question.archetype !== "standard") return true;
    const v = numberAnswer(question);
    if (p.task === "estimate")
      return (
        Math.abs(v - (p.op === "times" ? oneSf(p.a) * oneSf(p.b) : oneSf(p.a) / oneSf(p.b))) < 1e-9
      );
    const unit = 10 ** p.e;
    const value = p.n * unit;
    const expected = p.truncated
      ? p.task === "lower"
        ? value
        : value + unit
      : value + (p.task === "lower" ? -unit / 2 : unit / 2);
    return Math.abs(v - expected) < 1e-9;
  },
});
