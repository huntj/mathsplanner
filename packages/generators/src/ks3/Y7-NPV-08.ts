/**
 * @statement Y7-NPV-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-08: Round numbers and measures to an appropriate degree of accuracy, e.g. to a number of
// decimal places or significant figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Kind = "dp" | "sf-big" | "sf-small";

interface Params {
  kind: Kind;
  /** The number is m × 10⁻ᵈ. Its digits avoid 0 and 5, so no rounding sits exactly halfway. */
  m: number;
  d: number;
  /** Decimal places or significant figures to round to. */
  to: number;
  claimTrue: boolean;
}

/** m × 10⁻ᵈ rounded to k decimal places; a negative k rounds to tens, hundreds, … */
function roundDp(m: number, d: number, k: number, round = Math.round): number {
  const shift = d - k;
  if (shift <= 0) return m / 10 ** d;
  const r = round(m / 10 ** shift);
  return k >= 0 ? Number((r / 10 ** k).toFixed(k)) : r * 10 ** -k;
}

/** The power of ten of the first significant digit. */
const lead = (m: number, d: number) => String(m).length - 1 - d;
const places = (p: Params) => (p.kind === "dp" ? p.to : p.to - 1 - lead(p.m, p.d));
const show = (m: number, d: number) => (m / 10 ** d).toFixed(d);
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const accuracy = (p: Params) =>
  plural(p.to, p.kind === "dp" ? "decimal place" : "significant figure");

function digits(rng: { pick<T>(xs: readonly T[]): T }, n: number): number {
  const pool = [1, 2, 3, 4, 6, 7, 8, 9];
  return Number(Array.from({ length: n }, () => rng.pick(pool)).join(""));
}

function rounded(p: Params) {
  const k = places(p);
  const answer = roundDp(p.m, p.d, k);
  const down = roundDp(p.m, p.d, k, Math.floor);
  // dp ↔ sf mix-up, or counting zeros after the point as significant.
  const mixed =
    p.kind === "dp" ? roundDp(p.m, p.d, p.to - 1 - lead(p.m, p.d)) : roundDp(p.m, p.d, p.to);
  const code = p.kind === "sf-small" ? "NPV.ROUND.SF-LEADING-ZERO" : "NPV.ROUND.DP-SF";
  const next = Math.floor(p.m / 10 ** (p.d - k - 1)) % 10;
  return { k, answer, down, mixed, code, next };
}

export default defineGenerator<Params>({
  id: "Y7-NPV-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.SF-LEADING-ZERO", "NPV.ROUND.DP-SF", "NPV.ROUND.ALWAYS-DOWN"],

  params(rng, numbers) {
    const kinds: Kind[] = numbers === "friendly" ? ["dp", "sf-big"] : ["dp", "sf-big", "sf-small"];
    const kind = rng.pick(kinds);
    let p: Params;
    if (kind === "dp") {
      const whole = numbers === "friendly" ? 1 : rng.int(1, 2);
      const d = numbers === "stretch" ? 4 : 3;
      p = { kind, m: digits(rng, whole + d), d, to: rng.int(1, 2), claimTrue: rng.bool() };
    } else if (kind === "sf-big") {
      const whole = rng.int(2, 3);
      const d = rng.int(2, 3);
      p = {
        kind,
        m: digits(rng, whole + d),
        d,
        to: rng.int(numbers === "friendly" ? 1 : 2, whole),
        claimTrue: rng.bool(),
      };
    } else {
      const zeros = rng.int(1, numbers === "stretch" ? 3 : 2);
      p = { kind, m: digits(rng, 4), d: zeros + 4, to: rng.int(2, 3), claimTrue: rng.bool() };
    }
    const r = rounded(p);
    if (r.mixed === r.answer || r.mixed <= 0)
      reject("the mix-up must give a different, positive answer");
    if (r.mixed === p.m / 10 ** p.d) reject("the mix-up must still round");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const r = rounded(p);
    const n = show(p.m, p.d);
    const wrongList = [
      {
        code: r.code,
        value: A.number(r.mixed),
        feedback:
          p.kind === "sf-small"
            ? "Zeros before the first non-zero digit are not significant: they only hold the place."
            : p.kind === "dp"
              ? "That is to significant figures. Decimal places are counted after the decimal point."
              : "That is to decimal places. Significant figures start at the first non-zero digit.",
      },
      ...(r.down !== r.answer
        ? [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(r.down),
              feedback: `The next digit is ${r.next}, which is 5 or more, so round up.`,
            },
          ]
        : []),
    ];
    const why =
      (p.kind === "dp"
        ? `Keep ${accuracy(p)} after the point.`
        : `The first significant figure is the first non-zero digit. Keep ${accuracy(p)}.`) +
      ` The next digit is ${r.next}, so round ${r.next >= 5 ? "up" : "down"}: ${n} ≈ ${r.answer}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Round ", A.math(n), ` to ${accuracy(p)}.`],
          answer: A.number(r.answer),
          wrong: wrongs(r.answer, wrongList),
          solution: [{ say: why }],
        });
      case 2: {
        const finer = roundDp(p.m, p.d, r.k + 1);
        const seen = new Set([r.answer]);
        const distractors = [
          ...wrongList.map((w) => ({
            value: w.value.kind === "number" ? w.value.value : 0,
            code: w.code,
            feedback: w.feedback,
          })),
          ...(r.k + 1 < p.d
            ? [{ value: finer, code: undefined, feedback: "That keeps one figure too many." }]
            : []),
          {
            value: p.m / 10 ** p.d,
            code: undefined,
            feedback: "That is the number before rounding.",
          },
        ]
          .filter((x) => x.value > 0 && !seen.has(x.value) && seen.add(x.value))
          .slice(0, 3);
        if (distractors.length < 2) return reject("too few different options");
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which is ", A.math(n), ` rounded to ${accuracy(p)}?`],
          correct: A.math(String(r.answer)),
          distractors: distractors.map((x) => ({
            content: A.math(String(x.value)),
            feedback: x.feedback,
            ...(x.code ? { code: x.code } : {}),
          })),
          solution: [{ say: why }],
        });
      }
      default: {
        const shown = p.claimTrue ? r.answer : r.mixed;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says ",
            A.math(n),
            ` rounded to ${accuracy(p)} is `,
            A.math(String(shown)),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: why, correct: true },
                {
                  text:
                    p.kind === "sf-small"
                      ? "False: the zeros after the point count as significant figures."
                      : p.kind === "dp"
                        ? "False: it should be counted from the first non-zero digit."
                        : "False: count the figures after the decimal point.",
                  code: r.code,
                },
                { text: "False: you always round down." },
              ]
            : [
                { text: `False. ${why}`, correct: true },
                {
                  text:
                    p.kind === "sf-small"
                      ? "True: the zeros after the point count as significant figures."
                      : p.kind === "dp"
                        ? "True: count from the first non-zero digit."
                        : "True: count the figures after the decimal point.",
                  code: r.code,
                },
                { text: "True: rounding never changes the first digit." },
              ],
          solution: [{ say: why }],
        });
      }
    }
  },

  verify(p, question) {
    const k = p.kind === "dp" ? p.to : p.to - 1 - lead(p.m, p.d);
    const exact = p.m / 10 ** p.d;
    const got =
      question.archetype === "varied-form"
        ? Number(chosenText(question))
        : question.archetype === "standard"
          ? numberAnswer(question)
          : undefined;
    // Within half a unit of the last place kept, and on that place.
    if (got === undefined) return true;
    const unit = 10 ** -k;
    return Math.abs(got - exact) < unit / 2 && Math.abs(got / unit - Math.round(got / unit)) < 1e-9;
  },
});
