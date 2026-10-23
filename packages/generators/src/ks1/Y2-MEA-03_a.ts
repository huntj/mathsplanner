/**
 * @statement Y2-MEA-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-03.a: Recognise and use £ and p
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y2-MEA-03.ts";

interface Params {
  pounds: number;
  pence: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y2-MEA-03.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["MEA.MONEY.POUNDS-PENCE"],

  params(rng, numbers) {
    return { pounds: rng.int(1, numbers === "friendly" ? 5 : 9), pence: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      return A.standard({
        question: `Zoe has £${p.pounds}.`,
        ask: "How much is that in pence?",
        answer: A.number(100 * p.pounds, { units: "p" }),
        wrong: wrongs(100 * p.pounds, [
          {
            code: "MEA.MONEY.POUNDS-PENCE",
            value: A.number(10 * p.pounds, { units: "p" }),
            feedback: "There are 100 pence in every pound.",
          },
        ]),
        solution: [{ say: `£1 = 100p, so £${p.pounds} = ${100 * p.pounds}p.` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: `Ali writes ${p.pounds} pounds and ${p.pence} pence as £${p.pounds}.${p.pence}.`,
      truth: false,
      reasons: [
        {
          text: `False. There are two digits for the pence, so it is £${p.pounds}.0${p.pence}.`,
          correct: true,
        },
        { text: "True. The pence go straight after the point.", code: "MEA.MONEY.POUNDS-PENCE" },
        {
          text: `True. £${p.pounds}.${p.pence} and £${p.pounds}.0${p.pence} are the same.`,
          code: "MEA.MONEY.POUNDS-PENCE",
        },
      ],
      solution: [
        {
          say: `£${p.pounds}.${p.pence} means ${p.pounds} pounds and ${10 * p.pence} pence. ${p.pounds} pounds and ${p.pence} pence is £${p.pounds}.0${p.pence}.`,
        },
      ],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || numberAnswer(question) === 100 * p.pounds;
  },
};

export default defineGenerator(
  mixFamilies("Y2-MEA-03.a", { 1: own, 2: { ...parent.definition, id: "Y2-MEA-03.a" }, 4: own }),
);
