/**
 * @statement Y6-RAT-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-RAT-02.b: Use percentages to compare
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-RAT-02.ts";
import { withClaims } from "../shared/variety.ts";

interface Params {
  /** A bigger percentage of a smaller amount, against a smaller percentage of a bigger amount. */
  big: number;
  small: number;
  a: number;
  b: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y6-RAT-02.b",
  version: "1.0.0",
  depths: [4],
  misconceptions: ["RAT.PERCENT.CHANGE-BASE"],

  params(rng) {
    const p = {
      big: rng.pick([20, 25, 50]),
      small: rng.pick([10, 5]),
      a: rng.int(2, 8) * 20,
      b: rng.int(10, 30) * 20,
    };
    if ((p.big * p.a) / 100 >= (p.small * p.b) / 100) reject("the smaller percentage gives more");
    return p;
  },

  build(p, _depth, rng): QuestionDraft {
    const x = (p.big * p.a) / 100;
    const y = (p.small * p.b) / 100;
    return A.trueOrFalseWhy({
      rng,
      statement: `Shop A takes ${p.big}% off a £${p.a} coat. Shop B takes ${p.small}% off a £${p.b} coat. Ed says Shop A takes more money off, because ${p.big}% is more than ${p.small}%.`,
      truth: false,
      reasons: [
        {
          text: `False. ${p.big}% of £${p.a} is £${x}, but ${p.small}% of £${p.b} is £${y}, which is more.`,
          correct: true,
        },
        {
          text: "True. A bigger percentage always means a bigger amount.",
          code: "RAT.PERCENT.CHANGE-BASE",
        },
        {
          text: "True. You can compare percentages without the prices.",
          code: "RAT.PERCENT.CHANGE-BASE",
        },
      ],
      solution: [{ say: `Work out each amount: £${x} and £${y}.` }],
    });
  },
};

export default defineGenerator(
  withClaims(
    mixFamilies("Y6-RAT-02.b", { 2: { ...parent.definition, id: "Y6-RAT-02.b" }, 4: own }),
    [
      {
        statement:
          "Jo got 18 out of 20 in maths and 40 out of 50 in science. She says maths was her better score.",
        truth: true,
        right: "True. 18/20 = 90% and 40/50 = 80%.",
        wrong: [
          ["False. 40 is more than 18.", "RAT.PERCENT.CHANGE-BASE"],
          ["False. 50 − 40 = 10 marks lost, but 20 − 18 = 2, so they are the same."],
        ],
      },
      {
        statement:
          "Class A has 12 of its 30 pupils walking to school. Class B has 10 of its 20. Eli says class A has the bigger percentage walking.",
        truth: false,
        right: "False. 12/30 = 40% and 10/20 = 50%, so class B has the bigger percentage.",
        wrong: [
          ["True. 12 is more than 10.", "RAT.PERCENT.CHANGE-BASE"],
          ["True. Class A is bigger, so its percentage is bigger.", "AS.MULTISTEP.ONE-STEP"],
        ],
      },
      {
        claim: "A bigger number of people is a bigger percentage.",
        truth: "sometimes",
        right: "Sometimes. It depends on the totals: 10 of 20 is 50%, but 12 of 60 is only 20%.",
        wrong: [
          ["Always. More people means more per cent.", "RAT.PERCENT.CHANGE-BASE"],
          ["Never. Percentages do not depend on numbers.", "RAT.PERCENT.DIVIDE-BY-PERCENT"],
        ],
      },
    ],
  ),
);
