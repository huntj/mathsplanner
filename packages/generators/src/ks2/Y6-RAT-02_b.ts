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
  mixFamilies("Y6-RAT-02.b", { 2: { ...parent.definition, id: "Y6-RAT-02.b" }, 4: own }),
);
