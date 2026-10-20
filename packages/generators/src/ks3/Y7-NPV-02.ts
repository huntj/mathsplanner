/**
 * @statement Y7-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-02: Order positive and negative integers, decimals and fractions; use the number line; use
// =, ≠, <, >, ≤, ≥
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  frac,
  reject,
  type QuestionDraft,
  type Rational,
} from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

type Kind = "decimals" | "negatives" | "mixed";

interface Params {
  kind: Kind;
  /** Two values to compare, as [numerator, denominator] and how to show each. */
  pair: [Value, Value];
  /** Four values to order. */
  list: Value[];
  /** Depth 3: a negative decimal to find on the number line, in tenths. */
  tenths: number;
  claim: number;
}

interface Value {
  n: number;
  d: number;
  show: "decimal" | "fraction";
}

const valueOf = (v: Value): Rational => frac(v.n, v.d);
const latexOf = (v: Value) =>
  v.show === "fraction"
    ? `${v.n < 0 ? "-" : ""}\\frac{${Math.abs(v.n)}}{${v.d}}`
    : valueOf(v).toDecimalString();
const sign = (a: Rational, b: Rational) => (a.lt(b) ? "<" : a.gt(b) ? ">" : "=");

function pairFor(
  kind: Kind,
  rng: { int(a: number, b: number): number; bool(): boolean },
): [Value, Value] {
  switch (kind) {
    case "decimals": {
      // 0.4 against 0.35: the shorter decimal is bigger.
      const t = rng.int(2, 8);
      const h = rng.int(10, t * 10 - 1);
      return [
        { n: t, d: 10, show: "decimal" },
        { n: h, d: 100, show: "decimal" },
      ];
    }
    case "negatives": {
      const a = rng.int(2, 9);
      const b = rng.int(1, a - 1);
      return [
        { n: -a, d: 1, show: "decimal" },
        { n: -b, d: 1, show: "decimal" },
      ];
    }
    default: {
      const d = rng.int(0, 1) ? 4 : 5;
      const n = rng.int(1, d - 1);
      const dec = Math.round((n / d) * 100) + (rng.bool() ? 5 : -5);
      return [
        { n, d, show: "fraction" },
        { n: dec, d: 100, show: "decimal" },
      ];
    }
  }
}

export default defineGenerator<Params>({
  id: "Y7-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "NPV.DECIMAL.LONGER-BIGGER",
    "NPV.NEGATIVE.ORDER",
    "NPV.COMPARE.SIGN-DIRECTION",
    "NPV.NEGATIVE.MIRROR",
  ],

  params(rng, numbers) {
    const kind =
      numbers === "friendly"
        ? rng.pick(["decimals", "negatives"] as const)
        : rng.pick(["decimals", "negatives", "mixed"] as const);
    const pair = pairFor(kind, rng);
    const list: Value[] = [
      { n: rng.int(1, 9), d: 10, show: "decimal" },
      { n: rng.int(11, 99), d: 100, show: "decimal" },
      { n: -rng.int(1, 30), d: 10, show: "decimal" },
      numbers === "friendly"
        ? { n: -rng.int(1, 9), d: 1, show: "decimal" }
        : { n: rng.int(1, 3), d: 4, show: "fraction" },
    ];
    const values = list.map((v) => valueOf(v).toDecimalString());
    if (new Set(values).size < 4) reject("repeated values");
    return { kind, pair, list, tenths: -rng.int(2, 28), claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [a, b] = p.pair;
        const right = sign(valueOf(a), valueOf(b));
        const flipped = right === "<" ? ">" : "<";
        const code =
          p.kind === "decimals"
            ? "NPV.DECIMAL.LONGER-BIGGER"
            : p.kind === "negatives"
              ? "NPV.NEGATIVE.ORDER"
              : "NPV.COMPARE.SIGN-DIRECTION";
        const feedback = {
          decimals:
            "Compare the tenths first: a decimal with more digits is not necessarily bigger.",
          negatives: "The further below zero, the smaller the number.",
          mixed:
            "Write both as decimals to compare them; the open side of the sign faces the bigger number.",
        }[p.kind];
        return A.choice({
          rng,
          question: [A.math(`${latexOf(a)} \\; \\square \\; ${latexOf(b)}`)],
          ask: "Which sign goes in the box?",
          correct: A.math(right),
          distractors: [{ content: A.math(flipped), code, feedback }, { content: A.math("=") }],
          solution: [
            {
              say: `As decimals: ${valueOf(a).toDecimalString()} and ${valueOf(b).toDecimalString()}, so ${latexOf(a).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} ${right} ${latexOf(b)}.`,
            },
          ],
        });
      }
      case 2: {
        const up = [...p.list].sort((x, y) => valueOf(x).cmp(valueOf(y)));
        const byAbs = [...p.list].sort((x, y) => valueOf(x).abs().cmp(valueOf(y).abs()));
        const down = [...up].reverse();
        const show = (vs: Value[]) => vs.map(latexOf).join(",\\ ");
        const options = [
          {
            list: byAbs,
            code: "NPV.NEGATIVE.ORDER",
            feedback: "Negative numbers are below zero, so they come first.",
          },
          { list: down, feedback: "That is largest first." },
        ].filter((o) => show(o.list) !== show(up));
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Here are four numbers: ", A.math(p.list.map(latexOf).join(",\\ ")), "."],
          ask: "Which list puts them in order, smallest first?",
          correct: A.math(show(up)),
          distractors: options
            .filter((o, i) => options.findIndex((x) => show(x.list) === show(o.list)) === i)
            .map((o) => ({
              content: A.math(show(o.list)),
              ...(o.code ? { code: o.code } : {}),
              feedback: o.feedback,
            })),
          solution: [
            { say: `As decimals: ${up.map((v) => valueOf(v).toDecimalString()).join(", ")}.` },
          ],
        });
      }
      case 3: {
        const x = p.tenths / 10;
        const line = (v: number): NumberLineSpec => ({
          type: "number-line",
          min: -3,
          max: 3,
          step: 1,
          minor: 10,
          points: [{ value: v, style: "arrow" }],
          description: "A number line from −3 to 3 marked in tenths, with an arrow at a number.",
        });
        return A.chooseTheDiagram({
          rng,
          question: ["Which number line shows ", A.math(String(x)), "?"],
          ask: "Choose the number line.",
          correct: line(x),
          distractors: [
            {
              figure: line(-x),
              code: "NPV.NEGATIVE.MIRROR",
              feedback: `That shows ${-x}: negative numbers are to the left of zero.`,
            },
            {
              figure: line(Math.round((x + (x > -2.5 ? -0.5 : 0.5)) * 10) / 10),
              feedback: "Count the tenths from the nearest whole number.",
            },
          ],
          solution: [
            {
              say: `${x} is ${Math.abs(x)} to the left of zero: find ${Math.ceil(x) === 0 ? "0" : Math.ceil(x)} and count ${Math.round((Math.ceil(x) - x) * 10)} tenths further left.`,
            },
          ],
        });
      }
      default: {
        const [a, b] = p.pair;
        const claims = [
          {
            statement: [A.math("x \\le 5"), " includes the number 5."],
            truth: true,
            reasons: [
              { text: "≤ means less than or equal to, so 5 itself is included.", correct: true },
              { text: "≤ means only less than, so 5 is not included." },
              {
                text: "It includes 5 and numbers greater than 5.",
                code: "NPV.COMPARE.SIGN-DIRECTION",
              },
            ],
          },
          {
            statement: [
              A.math(
                `${latexOf(a)} ${sign(valueOf(a), valueOf(b)) === "<" ? ">" : "<"} ${latexOf(b)}`,
              ),
            ],
            truth: false,
            reasons: [
              {
                text: `Compare them as decimals: ${valueOf(a).toDecimalString()} and ${valueOf(b).toDecimalString()}. The sign is the wrong way round.`,
                correct: true,
              },
              p.kind === "negatives"
                ? {
                    text: "The negative number with the bigger digit is bigger.",
                    code: "NPV.NEGATIVE.ORDER",
                  }
                : {
                    text: "The decimal with more digits is bigger.",
                    code: "NPV.DECIMAL.LONGER-BIGGER",
                  },
              { text: "You cannot compare these two numbers." },
            ],
          },
          {
            statement: [A.math("-3 \\ne 3"), " because they are on opposite sides of zero."],
            truth: true,
            reasons: [
              {
                text: "They are the same distance from zero, but −3 is less than 3, so they are not equal.",
                correct: true,
              },
              {
                text: "They are equal because both are 3 away from zero.",
                code: "NPV.NEGATIVE.MIRROR",
              },
              { text: "≠ means 'is about equal to'." },
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
    if (question.archetype === "standard")
      return chosenText(question) === sign(valueOf(p.pair[0]), valueOf(p.pair[1]));
    if (question.archetype === "choose-the-diagram") {
      const value = (chosenFigure(question) as NumberLineSpec | undefined)?.points?.[0]?.value;
      return value === p.tenths / 10;
    }
    if (question.archetype === "varied-form") {
      const up = [...p.list].sort((x, y) => valueOf(x).cmp(valueOf(y)));
      return chosenText(question) === up.map(latexOf).join(",\\ ");
    }
    return true;
  },
});
