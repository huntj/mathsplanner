/**
 * @statement Y1-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MD-01.c: Solve division problems by grouping
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, objects } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  groups: number;
  each: number;
}

export default defineGenerator<Params>({
  id: "Y1-MD-01.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SHARE.GROUPS"],

  params(rng, numbers) {
    const each = numbers === "friendly" ? rng.pick([2, 5, 10]) : rng.int(2, 5);
    const groups = rng.int(2, numbers === "stretch" ? 6 : 5);
    if (groups === each || groups * each > 30) reject("different numbers, up to 30");
    return { groups, each };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.groups * p.each;
    const counting = Array.from({ length: p.groups }, (_, i) => (i + 1) * p.each).join(", ");
    const solution = [
      { say: `Count out groups of ${p.each}: ${counting}. That is ${p.groups} groups.` },
    ];
    const eachWrong = {
      code: "MD.SHARE.GROUPS",
      value: A.number(p.each),
      feedback: `${p.each} is how many go in each group. Count how many groups of ${p.each} you can make.`,
    };
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `${n} eggs are put into boxes of ${p.each}.`,
            A.figure(objects(n, { shape: "circle" })),
          ],
          ask: "How many boxes are filled?",
          answer: A.number(p.groups),
          wrong: wrongs(p.groups, [eachWrong]),
          solution,
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `${n} children stand in groups of ${p.each}.`,
              ask: "How many groups are there?",
            },
            {
              question: `${n} socks are put into bundles of ${p.each}.`,
              ask: "How many bundles are there?",
            },
          ],
          answer: A.number(p.groups),
          wrong: wrongs(p.groups, [eachWrong]),
          solution,
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: `${n} cubes are put into towers of ${p.each}. Ana says there are ${p.each} towers.`,
              truth: false,
              reasons: [
                {
                  text: `False. Each tower has ${p.each} cubes. Counting in ${p.each}s to ${n} takes ${p.groups} towers.`,
                  correct: true,
                },
                {
                  text: `True. There are ${p.each} in each tower, so there are ${p.each} towers.`,
                  code: "MD.SHARE.GROUPS",
                },
                { text: "True. You can only make that many towers." },
              ],
              solution,
            }),
          [
            {
              statement: "6 cubes are put into towers of 2. Sam says there are 3 towers.",
              truth: true,
              right: "True. 2, 4, 6: that is 3 towers of 2.",
              wrong: [
                ["False. There are 2 towers.", "MD.SHARE.GROUPS"],
                ["False. There are 6 towers."],
              ],
            },
            {
              claim: "Grouping 10 counters into 5s makes 2 groups.",
              truth: "always",
              right: "Always. 5 and 5 make 10.",
              wrong: [
                ["Never. It makes 5 groups.", "MD.SHARE.GROUPS"],
                ["Sometimes. It depends on the counters."],
              ],
            },
            {
              statement: "12 pencils go into packs of 4. Ana says there are 4 packs.",
              truth: false,
              right: "False. 4, 8, 12: there are 3 packs of 4.",
              wrong: [
                ["True. Each pack has 4, so 4 packs.", "MD.SHARE.GROUPS"],
                ["True. 12 − 4 = 8."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return numberAnswer(question) === p.groups;
  },
});
