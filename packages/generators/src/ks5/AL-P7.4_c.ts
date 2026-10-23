/**
 * @statement AL-P7.4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.4.c: Use the quotient rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** y = (x + a)/(x + b). */
  a: number;
  b: number;
  x: number;
}

const sg = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);

export default defineGenerator<Params>({
  id: "AL-P7.4.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.PRODUCT-RULE"],

  params(rng) {
    const p = { a: rng.int(-6, 6), b: rng.int(-6, 6), x: rng.int(-3, 3) };
    if (p.a === p.b || p.a === 0 || p.b === 0 || p.x + p.b === 0 || Math.abs(p.b - p.a) === 1)
      reject("a quotient that is not constant, defined at x");
    if ((p.b - p.a) % (p.x + p.b) ** 2 !== 0) reject("a whole-number gradient");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const y = `y = \\frac{x ${sg(p.a)}}{x ${sg(p.b)}}`;
    const num = p.b - p.a;
    const right = `\\frac{${num}}{(x ${sg(p.b)})^2}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Differentiate ", A.math(y), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\frac{${-num}}{(x ${sg(p.b)})^2}`),
              code: "CALC.PRODUCT-RULE",
              feedback: "The quotient rule is (v du/dx − u dv/dx)/v²: v du/dx comes first.",
            },
            {
              content: A.math("1"),
              code: "CALC.PRODUCT-RULE",
              feedback: "You cannot differentiate the top and bottom separately.",
            },
            {
              content: A.math(`\\frac{${num}}{x ${sg(p.b)}}`),
              feedback: "Divide by v², the square of the denominator.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{dy}{dx} = \\frac{(x ${sg(p.b)}) \\times 1 - (x ${sg(p.a)}) \\times 1}{(x ${sg(p.b)})^2} = ${right}`,
            },
          ],
        });
      case 2: {
        const g = num / (p.x + p.b) ** 2;
        return A.standard({
          question: ["Find the gradient of ", A.math(y), ` at the point where x = ${p.x}.`],
          answer: A.number(g),
          wrong: signedWrongs(g, [
            {
              code: "CALC.PRODUCT-RULE",
              value: A.number(-g),
              feedback: "Check the order in the numerator: v du/dx − u dv/dx.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{dy}{dx} = ${right} = \\frac{${num}}{${(p.x + p.b) ** 2}} = ${g}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lena differentiates ",
            A.math(y),
            " by differentiating the top and the bottom separately, and gets 1/1 = 1.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. A quotient needs the quotient rule: dy/dx = (v u' − u v')/v² = ${num}/(x ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)})².`,
              correct: true,
            },
            {
              text: "True. The derivative of a fraction is the derivative of the top over the derivative of the bottom.",
              code: "CALC.PRODUCT-RULE",
            },
            { text: "True. Both have derivative 1, so they cancel.", code: "CALC.PRODUCT-RULE" },
          ],
          solution: [{ say: "", math: `\\frac{dy}{dx} = ${right}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `\\frac{${p.b - p.a}}{(x ${sg(p.b)})^2}`;
    if (question.key.depth === 2) return numberAnswer(question) === (p.b - p.a) / (p.x + p.b) ** 2;
    return true;
  },
});
