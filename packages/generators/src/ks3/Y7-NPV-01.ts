/**
 * @statement Y7-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-01: Understand and use place value for decimals, measures and integers of any size
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  frac,
  reject,
  type QuestionDraft,
  type Rational,
} from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** Digits of a decimal d.dd(d), all different and non-zero. */
  digits: number[];
  /** The decimal place asked about: 1 is tenths. */
  k: number;
  power: 10 | 100 | 1000;
  op: "times" | "divide";
  claim: number;
}

const PLACE = ["ones", "tenths", "hundredths", "thousandths"];
const dec = (r: Rational) => r.toDecimalString();
const num = (r: Rational) => Number(r.toDecimalString());
/** The decimal with these digits: [3, 4, 7] is 3.47. */
const decimalOf = (ds: number[]) => frac(`${ds[0]}.${ds.slice(1).join("")}`);

export default defineGenerator<Params>({
  id: "Y7-NPV-01",
  version: "1.1.0",
  depths: [1, 2, 3, 4],
  misconceptions: [
    "NPV.PLACE.FACE-VALUE",
    "NPV.PLACE.COLUMN-SHIFT",
    "NPV.POWERS10.WRONG-WAY",
    "NPV.POWERS10.APPEND-ZEROS",
  ],

  params(rng, numbers) {
    const places = numbers === "friendly" ? 2 : 3;
    const digits = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], places + 1);
    return {
      digits,
      k: rng.int(1, places),
      power:
        numbers === "friendly" ? rng.pick([10, 100] as const) : rng.pick([10, 100, 1000] as const),
      op: rng.pick(["times", "divide"] as const),
      claim: rng.int(0, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const x = decimalOf(p.digits);
    switch (depth) {
      case 1: {
        const d = p.digits[p.k] ?? 0;
        const value = frac(d).div(10 ** p.k);
        return A.standard({
          question: ["Look at the number ", A.math(dec(x)), "."],
          ask: ["What is the value of the digit ", A.math(String(d)), "?"],
          answer: A.number(num(value)),
          wrong: wrongs(num(value), [
            {
              code: "NPV.PLACE.FACE-VALUE",
              value: A.number(d),
              feedback: `The ${d} is in the ${PLACE[p.k]} place, so it is worth ${dec(value)}.`,
            },
            {
              code: "NPV.PLACE.COLUMN-SHIFT",
              value: A.number(num(value.mul(10))),
              feedback: `Count the places after the decimal point: tenths, hundredths, thousandths. The ${d} is in the ${PLACE[p.k]}.`,
            },
          ]),
          solution: [
            {
              say: `The ${d} is ${p.k} place${p.k > 1 ? "s" : ""} after the decimal point, in the ${PLACE[p.k]}: it is worth ${d} ${PLACE[p.k]} = ${dec(value)}.`,
            },
          ],
        });
      }
      case 2: {
        const result = p.op === "times" ? x.mul(p.power) : x.div(p.power);
        const reverse = p.op === "times" ? x.div(p.power) : x.mul(p.power);
        const wrong = wrongs(num(result), [
          {
            code: "NPV.POWERS10.WRONG-WAY",
            value: A.number(num(reverse)),
            feedback:
              p.op === "times"
                ? "Multiplying by 10, 100 or 1000 makes the number bigger: the digits move left."
                : "Dividing makes it smaller: the digits move right.",
          },
          ...(p.op === "times"
            ? [
                {
                  code: "NPV.POWERS10.APPEND-ZEROS",
                  value: A.number(num(x)),
                  feedback: `Writing zeros after ${dec(x)} does not change it. Move every digit ${Math.log10(p.power)} place${p.power > 10 ? "s" : ""} left.`,
                },
              ]
            : []),
        ]);
        const sym = p.op === "times" ? "\\times" : "\\div";
        const metres = p.op === "times" && p.power === 1000;
        return A.variedForm({
          rng,
          forms: [
            { question: [A.math(`${dec(x)} ${sym} ${p.power}`)], ask: "Work it out." },
            metres
              ? { question: `A path is ${dec(x)} km long.`, ask: "How long is it in metres?" }
              : {
                  question: [
                    "Fill in the answer to ",
                    A.math(`${dec(x)} ${sym} ${p.power} = \\square`),
                    ".",
                  ],
                  ask: "What goes in the box?",
                },
          ],
          answer: A.number(num(result)),
          wrong,
          solution: [
            {
              say: `${p.op === "times" ? "Multiplying" : "Dividing"} by ${p.power} moves each digit ${Math.log10(p.power)} place${p.power > 10 ? "s" : ""} ${p.op === "times" ? "left" : "right"}:`,
              math: `${dec(x)} ${sym} ${p.power} = ${dec(result)}`,
            },
          ],
        });
      }
      case 3: {
        const [a = 1, b = 2, c = 3] = p.digits;
        const perms = [
          [a, b, c],
          [b, a, c],
          [c, b, a],
        ];
        const words = (ds: number[]) => `${ds[0]} ones, ${ds[1]} tenths and ${ds[2]} hundredths`;
        if (new Set(perms.map((q) => q.join())).size < 3) return reject("repeats");
        return A.matchRepresentations({
          rng,
          question: "Match each number to its place-value description.",
          pairs: perms.map(
            (ds) => [A.math(dec(decimalOf(ds))), words(ds)] as [A.RichInput, A.RichInput],
          ),
          solution: [{ say: "The first digit after the point is tenths, the next is hundredths." }],
        });
      }
      default: {
        const claims = [
          {
            claim: "Multiplying a number by 10 puts a 0 on the end of it.",
            truth: "sometimes" as const,
            reasons: [
              {
                text: `For whole numbers, yes; but ${dec(x)} × 10 = ${dec(x.mul(10))}, not ${dec(x)}0.`,
                correct: true,
              },
              { text: "Always: ×10 means adding a zero.", code: "NPV.POWERS10.APPEND-ZEROS" },
              { text: "Never: you add 10 instead." },
            ],
          },
          {
            claim: "Dividing a positive number by 100 makes it smaller.",
            truth: "always" as const,
            reasons: [
              {
                text: "Each digit moves two places right, so the value is a hundredth of what it was.",
                correct: true,
              },
              {
                text: "Only whole numbers get smaller; decimals get bigger.",
                code: "NPV.POWERS10.WRONG-WAY",
              },
              { text: "Only if the number ends in 00." },
            ],
          },
        ];
        const c = claims[p.claim] ?? claims[0];
        if (!c) return reject("no claim");
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: c.claim,
              truth: c.truth,
              reasons: c.reasons,
              solution: [{ say: c.reasons[0]?.text ?? "" }],
            }),
          [
            {
              statement: `Lia says $${p.digits[0]}.${p.digits[1]} \\times 100 = ${p.digits[0]}${p.digits[1]}0$.`,
              truth: true,
              right: `True. Each digit moves two places to the left: ${p.digits[0]} ones become ${p.digits[0]} hundreds and ${p.digits[1]} tenths become ${p.digits[1]} tens.`,
              wrong: [
                [
                  `False. Multiplying by 100 puts two zeros on the end: ${p.digits[0]}.${p.digits[1]}00.`,
                  "NPV.POWERS10.APPEND-ZEROS",
                ],
                [
                  `False. Multiplying by 100 moves the digits right: 0.0${p.digits[0]}${p.digits[1]}.`,
                  "NPV.POWERS10.WRONG-WAY",
                ],
              ],
            },
            {
              statement: `Tom says $${p.digits[0]}.${p.digits[1]} \\div 10 = ${p.digits[0]}.0${p.digits[1]}$.`,
              truth: false,
              right: `False. Dividing by 10 moves each digit one place to the right: ${p.digits[0]}.${p.digits[1]} ÷ 10 = 0.${p.digits[0]}${p.digits[1]}.`,
              wrong: [
                [
                  "True. To divide by 10, put a 0 after the decimal point.",
                  "NPV.POWERS10.APPEND-ZEROS",
                ],
                ["True. Only the digits after the point change.", "NPV.PLACE.COLUMN-SHIFT"],
              ],
            },
            {
              claim: "Multiplying a positive number by 10 makes it smaller.",
              truth: "never",
              right:
                "Never. Each digit moves one place to the left, so the number becomes ten times as big.",
              wrong: [
                [
                  "Sometimes. Decimals get smaller when you multiply them by 10.",
                  "NPV.POWERS10.WRONG-WAY",
                ],
                [
                  "Always. Moving the decimal point makes a number smaller.",
                  "NPV.POWERS10.WRONG-WAY",
                ],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    const x = Number(`${p.digits[0]}.${p.digits.slice(1).join("")}`);
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - (p.digits[p.k] ?? 0) / 10 ** p.k) < 1e-12;
    if (question.archetype === "varied-form")
      return (
        Math.abs(numberAnswer(question) - (p.op === "times" ? x * p.power : x / p.power)) < 1e-9
      );
    return true;
  },
});
