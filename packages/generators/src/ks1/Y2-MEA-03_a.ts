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
import { withClaims } from "../shared/variety.ts";

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
  withClaims(
    mixFamilies("Y2-MEA-03.a", { 1: own, 2: { ...parent.definition, id: "Y2-MEA-03.a" }, 4: own }),
    [
      {
        claim: "100 pence make £1.",
        truth: "always",
        right: "Always. There are 100p in a pound.",
        wrong: [
          ["Never. 10p make £1.", "MEA.MONEY.POUNDS-PENCE"],
          ["Sometimes. Only with 1p coins."],
        ],
      },
      {
        statement: "Sam has a 20p coin and a 5p coin. He says he has 25p.",
        truth: true,
        right: "True. 20p + 5p = 25p.",
        wrong: [
          ["False. He has 2p, one for each coin.", "MEA.MONEY.COIN-COUNT"],
          ["False. He has 205p."],
        ],
      },
      {
        statement: "Kim has three 10p coins. She says she has 3p.",
        truth: false,
        right: "False. Three 10p coins are 10p + 10p + 10p = 30p.",
        wrong: [["True. 3 coins is 3p.", "MEA.MONEY.COIN-COUNT"], ["True. Count the coins."]],
      },
    ],
  ),
);
