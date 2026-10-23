/**
 * @statement Y4-FR-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-02.b: Recognise hundredths from dividing by 100 and tenths by 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  n: number;
  by: 10 | 100;
}

export default defineGenerator<Params>({
  id: "Y4-FR-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWERS10.WRONG-WAY", "FR.UNIT.BIGGER-DENOMINATOR"],

  params(rng, numbers) {
    return { n: rng.int(2, 9), by: numbers === "friendly" ? 10 : rng.pick([10, 100] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const other = p.by === 10 ? 100 : 10;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [A.math(`${p.n} \\div ${p.by}`)],
          ask: "Which fraction is equal to this?",
          correct: A.math(fracTex(p.n, p.by)),
          distractors: [
            {
              content: A.math(fracTex(p.n, other)),
              feedback: `Dividing by ${p.by} makes ${p.by === 10 ? "tenths" : "hundredths"}.`,
            },
            {
              content: A.math(String(p.n * p.by)),
              code: "NPV.POWERS10.WRONG-WAY",
              feedback: `Dividing makes the number smaller: ${p.n} ÷ ${p.by} is less than 1.`,
            },
          ],
          solution: [{ say: "", math: `${p.n} \\div ${p.by} = ${fracTex(p.n, p.by)}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A metre is cut into ${p.by} equal pieces.`],
          ask: "What fraction of a metre is each piece?",
          correct: A.math(fracTex(1, p.by)),
          distractors: [
            {
              content: A.math(fracTex(1, other)),
              feedback: `There are ${p.by} pieces, so each is one ${p.by === 10 ? "tenth" : "hundredth"}.`,
            },
            {
              content: A.math(String(p.by)),
              code: "NPV.POWERS10.WRONG-WAY",
              feedback: "Each piece is part of a metre, so it is less than 1.",
            },
          ],
          solution: [{ say: "", math: `1 \\div ${p.by} = ${fracTex(1, p.by)}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says ",
            A.math(fracTex(1, 100)),
            " is bigger than ",
            A.math(fracTex(1, 10)),
            " because 100 is bigger than 10.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Splitting a whole into 100 equal parts makes each part smaller than splitting it into 10.",
              correct: true,
            },
            {
              text: "True. A bigger denominator means a bigger fraction.",
              code: "FR.UNIT.BIGGER-DENOMINATOR",
            },
            {
              text: "True. Hundredths are bigger than tenths, like hundreds and tens.",
              code: "FR.UNIT.BIGGER-DENOMINATOR",
            },
          ],
          solution: [{ say: "One tenth is ten hundredths, so one hundredth is smaller." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(fracTex(p.n, p.by));
    if (question.key.depth === 2) return chosenText(question).includes(fracTex(1, p.by));
    return true;
  },
});
