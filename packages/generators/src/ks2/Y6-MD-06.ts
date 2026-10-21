/**
 * @statement Y6-MD-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-06: Use knowledge of the order of operations to carry out calculations involving the four
// operations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Shape = "add-times" | "subtract-divide" | "times-subtract";

interface Params {
  shape: Shape;
  a: number;
  b: number;
  c: number;
}

interface Expression {
  latex: string;
  value: number;
  leftToRight: number;
  steps: string;
  bracketed: string;
  harmless: string;
  wrongFirst: string;
  wrongThen: string;
}

function expression({ shape, a, b, c }: Params): Expression {
  switch (shape) {
    case "add-times":
      return {
        latex: `${a} + ${b} \\times ${c}`,
        value: a + b * c,
        leftToRight: (a + b) * c,
        steps: `${b} × ${c} = ${b * c} first, then ${a} + ${b * c} = ${a + b * c}`,
        bracketed: `(${a} + ${b}) \\times ${c}`,
        harmless: `${a} + (${b} \\times ${c})`,
        wrongFirst: `${a} + ${b} = ${a + b}`,
        wrongThen: `${a + b} \\times ${c} = ${(a + b) * c}`,
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
    case "times-subtract": {
      const big = a * b + c * c;
      return {
        latex: `${big} - ${a} \\times ${b}`,
        value: big - a * b,
        leftToRight: (big - a) * b,
        steps: `${a} × ${b} = ${a * b} first, then ${big} − ${a * b} = ${big - a * b}`,
        bracketed: `(${big} - ${a}) \\times ${b}`,
        harmless: `${big} - (${a} \\times ${b})`,
        wrongFirst: `${big} - ${a} = ${big - a}`,
        wrongThen: `${big - a} \\times ${b} = ${(big - a) * b}`,
      };
    }
  }
}

const plain = (latex: string) =>
  latex
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/ - /g, " − ");

export default defineGenerator<Params>({
  id: "Y6-MD-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const shapes: Shape[] =
      numbers === "friendly" ? ["add-times"] : ["add-times", "subtract-divide", "times-subtract"];
    const p = {
      shape: rng.pick(shapes),
      a: rng.int(2, 9),
      b: rng.int(2, 9),
      c: rng.int(2, numbers === "stretch" ? 9 : 6),
    };
    const e = expression(p);
    if (!Number.isInteger(e.leftToRight) || e.leftToRight === e.value || e.leftToRight <= 0)
      reject("left to right must give a different positive whole number");
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
              feedback: "Multiply and divide before you add and subtract.",
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
            { say: `Brackets are worked out first: ${plain(e.bracketed)} = ${e.leftToRight}.` },
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
          feedback: `Line 1 starts from the left, but the ${p.shape === "subtract-divide" ? "division" : "multiplication"} must come first: ${e.steps}.`,
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
