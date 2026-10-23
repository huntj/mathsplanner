/**
 * @statement Y8-ALG-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-06.a: Plot graphs of linear functions from a table of values
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { coord, distinctFrom } from "../shared/pos.ts";

interface Params {
  m: number;
  c: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-06.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT", "ALG.COORD.ORDER", "ALG.LINE.M-C"],

  params(rng) {
    const p = { m: rng.int(2, 5) * rng.pick([1, -1]), c: rng.int(-6, 8), x: rng.int(-3, 4) };
    if (p.c === 0 || p.x === 0 || p.m * p.x + p.c === p.x) reject("a point that is not on y = x");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = lineLatex(p.m, p.c);
    switch (depth) {
      case 1: {
        const v = p.m * p.x + p.c;
        return A.standard({
          question: ["Complete the table of values for ", A.math(eq), "."],
          ask: ["Find y when ", A.math(`x = ${p.x}`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(p.m * (p.x + p.c)),
              feedback: `Multiply x by ${p.m} first, then ${p.c < 0 ? "subtract" : "add"} ${Math.abs(p.c)}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.m} \\times (${p.x}) ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const y = p.m * p.x + p.c;
        const right = coord([p.x, y]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which point lies on the line ", A.math(eq), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(coord([y, p.x])),
              code: "ALG.COORD.ORDER",
              feedback: "Coordinates are (x, y): across first, then up.",
            },
            { content: A.math(coord([p.x, y + 1])), feedback: `When x = ${p.x}, y = ${y}.` },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: `Substitute x = ${p.x}: y = ${y}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "In a table of values for ",
            A.math(eq),
            `, Raj says the y values change by ${Math.abs(p.c)} each time x goes up by 1.`,
          ],
          truth: Math.abs(p.c) === Math.abs(p.m),
          reasons:
            Math.abs(p.c) === Math.abs(p.m)
              ? [
                  {
                    text: `True here, but only because the gradient is ${p.m}: the y values always change by the number in front of x.`,
                    correct: true,
                  },
                  { text: "False. They change by 1 each time.", code: "ALG.LINE.M-C" },
                  { text: "False. They do not change by a fixed amount.", code: "ALG.LINE.M-C" },
                ]
              : [
                  {
                    text: `False. Each step of 1 in x changes y by ${p.m}, the number in front of x. ${p.c} is where the line crosses the y-axis.`,
                    correct: true,
                  },
                  { text: "True. The number on its own is the step.", code: "ALG.LINE.M-C" },
                  { text: "True. The y values go up by c each time.", code: "ALG.LINE.M-C" },
                ],
          solution: [
            { say: "", math: [-1, 0, 1, 2].map((x) => `(${x}, ${p.m * x + p.c})`).join(", ") },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m * p.x + p.c;
    if (question.key.depth === 2) return chosenText(question) === coord([p.x, p.m * p.x + p.c]);
    return true;
  },
});
