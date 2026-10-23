/**
 * @statement Y3-FR-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-FR-01.b: Recognise tenths from dividing by 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { fracTex, fractionBar } from "../shared/fr.ts";

interface Params {
  n: number;
}

export default defineGenerator<Params>({
  id: "Y3-FR-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "FR.NAME.SHADED-UNSHADED",
    "FR.UNIT.BIGGER-DENOMINATOR",
    "NPV.POWERS10.WRONG-WAY",
  ],

  params(rng) {
    return { n: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const tenths = A.math(fracTex(p.n, 10));
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["A strip is cut into 10 equal parts.", A.figure(fractionBar(p.n, 10))],
          ask: "What fraction is shaded?",
          correct: tenths,
          distractors: [
            {
              content: A.math(fracTex(p.n, 10 - p.n)),
              code: "FR.NAME.SHADED-UNSHADED",
              feedback: "The bottom number is how many equal parts there are altogether: 10.",
            },
            {
              content: A.math(fracTex(1, p.n)),
              feedback: `Count the shaded parts: ${p.n} out of 10.`,
            },
          ],
          solution: [{ say: `${p.n} of the 10 equal parts are shaded: ${p.n} tenths.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`${p.n} cakes are shared equally between 10 children.`],
          ask: "How much cake does each child get?",
          correct: A.math(fracTex(p.n, 10)),
          distractors: [
            {
              content: A.math(fracTex(10, p.n)),
              feedback: `There are ${p.n} cakes for 10 children, so each gets less than one cake.`,
            },
            {
              content: A.math(String(10 * p.n)),
              code: "NPV.POWERS10.WRONG-WAY",
              feedback: "Sharing between 10 makes each share smaller, not bigger.",
            },
          ],
          solution: [{ say: "", math: `${p.n} \\div 10 = ${fracTex(p.n, 10)}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ravi says ",
            A.math(fracTex(1, 10)),
            " is bigger than ",
            A.math(fracTex(1, 2)),
            " because 10 is bigger than 2.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Cutting a whole into 10 equal parts makes each part smaller than cutting it into 2.",
              correct: true,
            },
            {
              text: "True. The bigger the bottom number, the bigger the fraction.",
              code: "FR.UNIT.BIGGER-DENOMINATOR",
            },
            {
              text: "True. Tenths are always bigger than halves.",
              code: "FR.UNIT.BIGGER-DENOMINATOR",
            },
          ],
          solution: [
            {
              say: "One tenth is one of 10 small equal parts; one half is one of 2 big equal parts.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return chosenText(question).includes(fracTex(p.n, 10));
  },
});
