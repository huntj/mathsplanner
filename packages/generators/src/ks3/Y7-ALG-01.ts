/**
 * @statement Y7-ALG-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-01: Use and interpret algebraic notation: ab, 3y, a², a³, a²b, a/b, coefficients written as
// fractions, brackets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Form = "coefficient" | "product" | "square" | "square-coefficient";

interface Params {
  form: Form;
  k: number;
  a: number;
  b: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NOTATION.JUXTAPOSE", "MD.SQUARE.DOUBLES", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const form = rng.pick(
      numbers === "friendly"
        ? (["coefficient", "product"] as const)
        : (["coefficient", "product", "square", "square-coefficient"] as const),
    );
    const [a, b, k] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)];
    if (a === b || a === 2 || b === k) reject("values that show the slips");
    return { form, k, a, b, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const setups: Record<
      Form,
      { latex: string; value: number; slip: number; code: string; feedback: string; how: string }
    > = {
      coefficient: {
        latex: `${p.k}a`,
        value: p.k * p.a,
        slip: Number(`${p.k}${p.a}`),
        code: "ALG.NOTATION.JUXTAPOSE",
        feedback: `${p.k}a means ${p.k} × a.`,
        how: `${p.k}a = ${p.k} × ${p.a} = ${p.k * p.a}.`,
      },
      product: {
        latex: "ab",
        value: p.a * p.b,
        slip: p.a + p.b,
        code: "ALG.NOTATION.JUXTAPOSE",
        feedback: "ab means a × b.",
        how: `ab = ${p.a} × ${p.b} = ${p.a * p.b}.`,
      },
      square: {
        latex: "a^2",
        value: p.a * p.a,
        slip: 2 * p.a,
        code: "MD.SQUARE.DOUBLES",
        feedback: "a² means a × a, not 2 × a.",
        how: `a² = ${p.a} × ${p.a} = ${p.a * p.a}.`,
      },
      "square-coefficient": {
        latex: `${p.k}a^2`,
        value: p.k * p.a * p.a,
        slip: (p.k * p.a) ** 2,
        code: "NPV.ORDER.LEFT-TO-RIGHT",
        feedback: `Only a is squared: ${p.k}a² = ${p.k} × a².`,
        how: `${p.k}a² = ${p.k} × ${p.a}² = ${p.k} × ${p.a * p.a} = ${p.k * p.a * p.a}.`,
      },
    };
    const s = setups[p.form];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "When ",
            A.math(`a = ${p.a}`),
            " and ",
            A.math(`b = ${p.b}`),
            ", what is ",
            A.math(s.latex),
            "?",
          ],
          answer: A.number(s.value),
          wrong: wrongs(s.value, [{ code: s.code, value: A.number(s.slip), feedback: s.feedback }]),
          solution: [{ say: s.how }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Multiply n by ${p.k}, then add ${p.b}.`,
          ask: "Which expression shows this?",
          correct: A.math(`${p.k}n + ${p.b}`),
          distractors: [
            {
              content: A.math(`${p.k}(n + ${p.b})`),
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              feedback: `That adds ${p.b} first, then multiplies everything by ${p.k}.`,
            },
            {
              content: A.math(`n + ${p.k} + ${p.b}`),
              code: "ALG.NOTATION.JUXTAPOSE",
              feedback: `Multiplying by ${p.k} is written ${p.k}n.`,
            },
            {
              content: A.math(`${p.b}n + ${p.k}`),
              feedback: `n is multiplied by ${p.k}, not ${p.b}.`,
            },
          ],
          solution: [
            { say: `n multiplied by ${p.k} is ${p.k}n; then add ${p.b}: ${p.k}n + ${p.b}.` },
          ],
        });
      default: {
        const shown = p.claimTrue ? s.value : s.slip;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "When ",
            A.math(`a = ${p.a}`),
            " and ",
            A.math(`b = ${p.b}`),
            ", Sol says ",
            A.math(`${s.latex} = ${shown}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${s.how}`, correct: true },
                { text: `False. ${s.latex.replace("^2", "²")} = ${s.slip}.`, code: s.code },
                { text: "False. You cannot work out letters." },
              ]
            : [
                { text: `False. ${s.how}`, correct: true },
                { text: `True. ${s.latex.replace("^2", "²")} = ${s.slip}.`, code: s.code },
                { text: "True. Letters stand for any number, so any answer is right." },
              ],
          solution: [{ say: s.how }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const want = {
        coefficient: p.k * p.a,
        product: p.a * p.b,
        square: p.a * p.a,
        "square-coefficient": p.k * p.a * p.a,
      }[p.form];
      return numberAnswer(question) === want;
    }
    if (question.archetype === "varied-form") return chosenText(question) === `${p.k}n + ${p.b}`;
    return true;
  },
});
