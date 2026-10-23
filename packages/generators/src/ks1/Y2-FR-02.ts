/**
 * @statement Y2-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-FR-02: Write simple fractions, e.g. ½ of 6 = 3, and recognise that 2/4 and ½ are equivalent
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { fracTex, fractionBar, readBar, slash, type Pair } from "../shared/fr.ts";

export interface Params {
  f: Pair;
  amount: number;
}

const POOL: Pair[] = [
  [1, 2],
  [1, 4],
  [1, 3],
  [3, 4],
  [2, 4],
];

export default defineGenerator<Params>({
  id: "Y2-FR-02",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["FR.OF-AMOUNT.UNIT-ONLY", "FR.COMPARE.NUMERATOR-ONLY", "FR.EQUIV.ADD-SAME"],

  params(rng, numbers) {
    const f = rng.pick(
      numbers === "friendly" ? POOL.slice(0, 2) : numbers === "standard" ? POOL.slice(0, 4) : POOL,
    );
    return { f, amount: f[1] * rng.int(2, numbers === "stretch" ? 10 : 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const [n, d] = p.f;
    const answer = (p.amount / d) * n;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find the missing number: ",
            A.math(`${fracTex(n, d)} \\text{ of } ${p.amount} = \\square`),
          ],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            n > 1
              ? {
                  code: "FR.OF-AMOUNT.UNIT-ONLY",
                  value: A.number(p.amount / d),
                  feedback: `That is ${slash(1, d)} of ${p.amount}. You need ${n} of those parts.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: `Share ${p.amount} into ${d} equal groups of ${p.amount / d}${n > 1 ? ` and take ${n} groups: ${answer}` : ""}.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [
            "This bar shows ",
            A.math(fracTex(1, 2)),
            ". Which bar shows the same amount?",
            A.figure(fractionBar(1, 2)),
          ],
          correct: fractionBar(2, 4),
          distractors: [
            {
              figure: fractionBar(1, 4),
              feedback: "That shows one quarter, which is less than a half.",
            },
            {
              figure: fractionBar(3, 4),
              code: "FR.EQUIV.ADD-SAME",
              feedback: "That shows three quarters, which is more than a half.",
            },
          ],
          solution: [{ say: "Two quarters cover the same amount as one half: 2/4 = 1/2." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tia says ",
            A.math(fracTex(2, 4)),
            " is more than ",
            A.math(fracTex(1, 2)),
            ", because 2 is more than 1.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A half is the same as two quarters: the bars show the same amount shaded.",
              correct: true,
            },
            {
              text: "True. The bigger numerator means the bigger fraction.",
              code: "FR.COMPARE.NUMERATOR-ONLY",
            },
            { text: "True. Quarters are bigger than halves." },
          ],
          solution: [{ say: "Split each half into two quarters: 1/2 = 2/4." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) * p.f[1] === p.amount * p.f[0];
    if (question.archetype === "choose-the-diagram") {
      const b = readBar(chosenFigure(question));
      return b.shaded * 2 === b.parts && b.equal;
    }
    return true;
  },
});
