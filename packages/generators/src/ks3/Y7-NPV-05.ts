/**
 * @statement Y7-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-05: Use conventional notation for priority of operations, including brackets, powers, roots
// and reciprocals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Shape = "add-times" | "subtract-divide" | "power" | "root";

interface Params {
  shape: Shape;
  a: number;
  b: number;
  c: number;
}

interface Expression {
  latex: string;
  value: number;
  /** The value worked strictly from left to right. */
  leftToRight: number;
  steps: string;
  /** Brackets that make it work out left to right, and brackets that change nothing. */
  bracketed: string;
  harmless: string;
  /** Left-to-right working, for spot the mistake. */
  wrongFirst: string;
  wrongThen: string;
}

function expression({ shape, a, b, c }: Params): Expression {
  const times = "\\times";
  switch (shape) {
    case "add-times":
      return {
        latex: `${a} + ${b} ${times} ${c}`,
        value: a + b * c,
        leftToRight: (a + b) * c,
        steps: `${b} × ${c} = ${b * c} first, then ${a} + ${b * c} = ${a + b * c}`,
        bracketed: `(${a} + ${b}) ${times} ${c}`,
        harmless: `${a} + (${b} ${times} ${c})`,
        wrongFirst: `${a} + ${b} = ${a + b}`,
        wrongThen: `${a + b} ${times} ${c} = ${(a + b) * c}`,
      };
    case "subtract-divide": {
      const top = a * c + b;
      return {
        latex: `${top} - ${b * c} \\div ${c}`,
        value: top - b,
        leftToRight: (top - b * c) / c,
        steps: `${b * c} ÷ ${c} = ${b} first, then ${top} − ${b} = ${top - b}`,
        bracketed: `(${top} - ${b * c}) \\div ${c}`,
        harmless: `${top} - (${b * c} \\div ${c})`,
        wrongFirst: `${top} - ${b * c} = ${top - b * c}`,
        wrongThen: `${top - b * c} \\div ${c} = ${(top - b * c) / c}`,
      };
    }
    case "power":
      return {
        latex: `${a} ${times} ${b}^{2}`,
        value: a * b * b,
        leftToRight: (a * b) ** 2,
        steps: `${b}² = ${b * b} first, then ${a} × ${b * b} = ${a * b * b}`,
        bracketed: `(${a} ${times} ${b})^{2}`,
        harmless: `${a} ${times} (${b}^{2})`,
        wrongFirst: `${a} ${times} ${b} = ${a * b}`,
        wrongThen: `${a * b}^{2} = ${(a * b) ** 2}`,
      };
    case "root":
      return {
        latex: `${a} + \\sqrt{${b * b}} ${times} ${c}`,
        value: a + b * c,
        leftToRight: (a + b) * c,
        steps: `√${b * b} = ${b}, then ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${a + b * c}`,
        bracketed: `(${a} + \\sqrt{${b * b}}) ${times} ${c}`,
        harmless: `${a} + (\\sqrt{${b * b}} ${times} ${c})`,
        wrongFirst: `${a} + \\sqrt{${b * b}} = ${a + b}`,
        wrongThen: `${a + b} ${times} ${c} = ${(a + b) * c}`,
      };
  }
}

export default defineGenerator<Params>({
  id: "Y7-NPV-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const shapes: Shape[] =
      numbers === "friendly"
        ? ["add-times", "subtract-divide"]
        : ["add-times", "subtract-divide", "power", "root"];
    const p = { shape: rng.pick(shapes), a: rng.int(2, 9), b: rng.int(2, 9), c: rng.int(2, 6) };
    const e = expression(p);
    if (!Number.isInteger(e.leftToRight) || e.leftToRight === e.value || e.leftToRight < 0)
      reject("left to right must give a different whole number");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const e = expression(p);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(e.latex)],
          ask: "Work it out.",
          answer: A.number(e.value),
          wrong: wrongs(e.value, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(e.leftToRight),
              feedback:
                "Do powers and roots, then multiplication and division, before addition and subtraction.",
            },
          ]),
          solution: [{ say: `Follow the order of operations: ${e.steps}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "reverse",
          question: ["Without brackets, ", A.math(e.latex), ` = ${e.value}.`],
          ask: ["Where should brackets go to make it equal ", A.math(String(e.leftToRight)), "?"],
          correct: A.math(e.bracketed),
          distractors: [
            {
              content: A.math(e.harmless),
              feedback: "Those brackets change nothing: that part is done first anyway.",
            },
            {
              content: A.math(e.latex),
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              feedback: `Without brackets the answer is ${e.value}, not ${e.leftToRight}.`,
            },
          ],
          solution: [
            {
              say: `Brackets make their operation happen first: ${e.bracketed
                .replace(/\\times/g, "×")
                .replace(/\\div/g, "÷")
                .replace(/\\sqrt\{(\d+)\}/g, "√$1")
                .replace(/\^\{2\}/g, "²")} = ${e.leftToRight}.`,
            },
          ],
        });
      default:
        return A.spotTheMistake({
          question: ["Leo works out ", A.math(e.latex), "."],
          lines: [
            [A.math(e.wrongFirst)],
            [A.math(e.wrongThen)],
            [`So the answer is ${e.leftToRight}.`],
          ],
          mistake: 0,
          code: "NPV.ORDER.LEFT-TO-RIGHT",
          feedback: `Line 1 starts from the left, but ${p.shape === "power" ? "the power" : p.shape === "root" ? "the root and the multiplication" : p.shape === "add-times" ? "the multiplication" : "the division"} must come first: ${e.steps}.`,
        });
    }
  },

  verify(p, question) {
    const e = expression(p);
    if (question.archetype === "standard") return numberAnswer(question) === e.value;
    if (question.archetype === "reverse") return chosenText(question) === e.bracketed;
    return e.value !== e.leftToRight;
  },
});
