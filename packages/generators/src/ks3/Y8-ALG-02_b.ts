/**
 * @statement Y8-ALG-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-02.b: Rearrange formulae to change the subject
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const FORMULAE: [string, string, string, string, string][] = [
  ["y = mx + c", "x", "x = \\frac{y - c}{m}", "x = \\frac{y}{m} - c", "x = \\frac{y + c}{m}"],
  ["v = u + at", "t", "t = \\frac{v - u}{a}", "t = \\frac{v}{a} - u", "t = \\frac{v + u}{a}"],
  ["P = 2l + 2w", "l", "l = \\frac{P - 2w}{2}", "l = \\frac{P}{2} - 2w", "l = \\frac{P + 2w}{2}"],
  ["F = ma + k", "a", "a = \\frac{F - k}{m}", "a = \\frac{F}{m} - k", "a = \\frac{F + k}{m}"],
];

interface Params {
  f: number;
  g: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-02.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.REARRANGE.ORDER", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    return { f: rng.int(0, 1), g: rng.int(2, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const make = (i: number, archetype?: "varied-form") => {
      const [f, sub, right, order, sign] = FORMULAE[i] ?? FORMULAE[0] ?? ["", "", "", "", ""];
      return A.choice({
        rng,
        ...(archetype ? { archetype } : {}),
        question: ["Make ", A.math(sub), " the subject of ", A.math(f), "."],
        correct: A.math(right),
        distractors: [
          {
            content: A.math(order),
            code: "ALG.REARRANGE.ORDER",
            feedback:
              "Undo the operations in reverse order: subtract first, then divide the whole of what is left.",
          },
          {
            content: A.math(sign),
            code: "ALG.SOLVE.WRONG-INVERSE",
            feedback: "To undo an addition, subtract from both sides.",
          },
        ],
        solution: [{ say: "", math: right }],
      });
    };
    switch (depth) {
      case 1:
        return make(p.f);
      case 2:
        return make(p.g, "varied-form");
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mo rearranges ",
                A.math("P = 2(l + w)"),
                " to get ",
                A.math("l = \\frac{P}{2} - w"),
                ".",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. Divide both sides by 2 to get P/2 = l + w, then subtract w.",
                  correct: true,
                },
                {
                  text: "False. You must subtract w before dividing by 2.",
                  code: "ALG.REARRANGE.ORDER",
                },
                { text: "False. It should be l = P − 2 − w.", code: "ALG.SOLVE.WRONG-INVERSE" },
              ],
              solution: [{ say: "Check with l = 3, w = 2: P = 10, and 10 ÷ 2 − 2 = 3." }],
            }),
          [
            {
              statement: "Lia rearranges $y = 3x + 2$ to get $x = \\frac{y}{3} - 2$.",
              truth: false,
              right: "False. Undo the + 2 first, then the × 3: x = (y − 2) ÷ 3.",
              wrong: [
                ["True. Undo the × 3 first, then the + 2.", "ALG.REARRANGE.ORDER"],
                ["True. Doing the same to both sides works in any order."],
              ],
            },
            {
              statement:
                "Rearranging $v = u + at$ to make a the subject gives $a = \\frac{v - u}{t}$.",
              truth: true,
              right: "True. Subtract u from both sides, then divide both sides by t.",
              wrong: [
                ["False. It is a = v − u − t.", "ALG.SOLVE.WRONG-INVERSE"],
                ["False. It is a = v ÷ t − u.", "ALG.REARRANGE.ORDER"],
              ],
            },
            {
              claim:
                "To change the subject of a formula, you undo its operations in the reverse of the order they were done.",
              truth: "always",
              right: "Always. The last thing done to the letter is the first thing to undo.",
              wrong: [
                ["Sometimes. Only when there are brackets.", "ALG.REARRANGE.ORDER"],
                ["Never. You undo them in the same order they were done.", "ALG.REARRANGE.ORDER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === FORMULAE[p.f]?.[2];
    if (question.key.depth === 2) return chosenText(question) === FORMULAE[p.g]?.[2];
    return true;
  },
});
