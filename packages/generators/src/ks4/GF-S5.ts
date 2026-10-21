/**
 * @statement GF-S5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S5: Apply statistics to describe a population
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A random sample of n pupils, k of whom walk to school. */
  n: number;
  k: number;
  /** The school has n × scale pupils. */
  scale: number;
  /** Depth 4: the sample mean number of children per family, and the town's families. */
  meanKids: number;
  families: number;
  claimTotal: boolean;
}

export default defineGenerator<Params>({
  id: "GF-S5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const n = rng.pick([20, 25, 40, 50]);
    const k = rng.int(4, n - 4);
    const scale = rng.int(12, 40);
    if (k * scale === n * scale - k) reject("a clear estimate");
    return {
      n,
      k,
      scale,
      meanKids: rng.pick([1.6, 1.7, 1.8, 1.9, 2.1, 2.2]),
      families: rng.pick([2000, 4000, 5000, 8000]),
      claimTotal: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const school = p.n * p.scale;
    const estimate = p.k * p.scale;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A random sample of ${p.n} pupils is taken from a school of ${school} pupils. ${p.k} of the sample walk to school.`,
          ask: "Estimate how many pupils in the whole school walk to school.",
          answer: A.number(estimate),
          wrong: wrongs(estimate, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(school - p.k),
              feedback: `${p.k} out of ${p.n} walk; scale that fraction up to ${school} pupils.`,
            },
          ]),
          solution: [
            {
              say: `${p.k}/${p.n} of the sample walk, and ${p.k}/${p.n} × ${school} = ${estimate}.`,
            },
          ],
        });
      case 2:
        return A.reverse({
          question: `In a random sample of ${p.n} pupils from a school, ${p.k} walk to school. From this, it is estimated that ${estimate} pupils in the school walk.`,
          ask: "How many pupils are in the school?",
          answer: A.number(school),
          wrong: wrongs(school, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(estimate + p.n),
              feedback: `${p.k}/${p.n} of the school is ${estimate}, so the school is ${estimate} ÷ ${p.k} × ${p.n}.`,
            },
          ]),
          solution: [
            { say: `${estimate} ÷ ${p.k} = ${p.scale}, and ${p.scale} × ${p.n} = ${school}.` },
          ],
        });
      default: {
        const total = Math.round(p.meanKids * p.families);
        const statement = `A random sample of families in a town has a mean of ${p.meanKids} children per family. There are ${p.families} families in the town.`;
        return p.claimTotal
          ? A.trueOrFalseWhy({
              rng,
              statement: `${statement} Zoe estimates there are about ${total} children in the town's families.`,
              truth: true,
              reasons: [
                {
                  text: `True. ${p.meanKids} × ${p.families} = ${total}: the sample mean scales up to an estimate for the population.`,
                  correct: true,
                },
                { text: "False. You cannot multiply a mean by a number of families." },
                {
                  text: `False. Every family has about ${Math.round(p.meanKids)} children, so it is ${Math.round(p.meanKids) * p.families}.`,
                },
              ],
              solution: [
                {
                  say: "Mean × number of families estimates the total, as long as the sample is random.",
                },
              ],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: `${statement} Zoe says this means every family in the town has about ${Math.round(p.meanKids)} children.`,
              truth: false,
              reasons: [
                {
                  text: "False. The mean describes the population as a whole; individual families vary a lot.",
                  correct: true,
                },
                { text: "True. The mean is the number of children in each family." },
                { text: "True. A random sample tells you about every individual." },
              ],
              solution: [
                {
                  say: "A sample statistic estimates a population average, not each member of it.",
                },
              ],
            });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.scale;
    if (question.key.depth === 2) return numberAnswer(question) === p.n * p.scale;
    return true;
  },
});
