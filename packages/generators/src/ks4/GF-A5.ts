/**
 * @statement GF-A5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A5: Understand and use standard mathematical formulae; rearrange formulae to change the subject
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  form: number;
  y: number;
  m: number;
  c: number;
}

// [formula, subject, right, wrong (undoing in the wrong order)]
const FORMS: [string, string, string, string][] = [
  ["y = mx + c", "x", "x = \\frac{y - c}{m}", "x = \\frac{y}{m} - c"],
  ["v = u + at", "t", "t = \\frac{v - u}{a}", "t = \\frac{v}{a} - u"],
  ["P = 2l + 2w", "l", "l = \\frac{P - 2w}{2}", "l = \\frac{P}{2} - 2w"],
  ["s = \\frac{d}{t}", "d", "d = st", "d = \\frac{s}{t}"],
];

export default defineGenerator<Params>({
  id: "GF-A5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.REARRANGE.ORDER", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    const m = rng.int(2, 9);
    const c = rng.int(1, 20);
    const x = rng.int(2, 12);
    return { form: rng.int(0, FORMS.length - 1), y: m * x + c, m, c };
  },

  build(p, depth, rng): QuestionDraft {
    const [formula, subject, right, wrong] = FORMS[p.form] as (typeof FORMS)[number];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Make ", A.math(subject), " the subject of ", A.math(formula), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(wrong),
              code: "ALG.REARRANGE.ORDER",
              feedback:
                "Undo the operations in reverse order: deal with the addition or subtraction before the multiplication.",
            },
            {
              content: A.math(right.replace(" - ", " + ")),
              code: "ALG.SOLVE.WRONG-INVERSE",
              feedback: "Use the inverse: subtract to undo adding.",
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(right))),
          solution: [{ say: "", math: right }],
        });
      case 2: {
        const x = (p.y - p.c) / p.m;
        return A.standard({
          question: [
            "Use ",
            A.math("y = mx + c"),
            ` to find x when y = ${p.y}, m = ${p.m} and c = ${p.c}.`,
          ],
          answer: A.number(x),
          wrong: [
            {
              code: "ALG.REARRANGE.ORDER",
              value: A.number(Math.round((p.y / p.m - p.c) * 100) / 100),
              feedback: "Subtract c first, then divide by m.",
            },
          ].filter((w) => w.value.kind === "number" && w.value.value !== x),
          solution: [
            { say: "", math: `x = \\frac{y - c}{m} = \\frac{${p.y} - ${p.c}}{${p.m}} = ${x}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Sasha rearranges ", A.math(formula), " and gets ", A.math(wrong), "."],
          truth: false,
          reasons: [
            {
              text: "False. The last operation done to the subject must be undone first. The correct rearrangement is shown in the solution.",
              correct: true,
            },
            {
              text: "True. You can undo the operations in any order.",
              code: "ALG.REARRANGE.ORDER",
            },
            {
              text: "True. Divide everything by the number in front, then deal with the rest.",
              code: "ALG.REARRANGE.ORDER",
            },
          ],
          solution: [{ say: "", math: right }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === (p.y - p.c) / p.m;
    if (question.archetype === "standard")
      return chosenText(question) === (FORMS[p.form] as (typeof FORMS)[number])[2];
    return true;
  },
});
