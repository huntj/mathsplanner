/**
 * @statement Y1-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MD-01.b: Solve division problems by sharing
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, objects } from "../shared/counting.ts";
import { array } from "../shared/md.ts";

interface Params {
  groups: number;
  each: number;
}

export default defineGenerator<Params>({
  id: "Y1-MD-01.b",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["MD.SHARE.GROUPS"],

  params(rng, numbers) {
    const groups = rng.int(2, numbers === "friendly" ? 3 : 5);
    const each = rng.int(2, numbers === "stretch" ? 6 : 5);
    if (groups === each) reject("different numbers");
    return { groups, each };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.groups * p.each;
    const solution = [
      {
        say: `Give one at a time to each of the ${p.groups} until all ${n} are gone: each gets ${p.each}.`,
      },
    ];
    const groupsWrong = {
      code: "MD.SHARE.GROUPS",
      value: A.number(p.groups),
      feedback: `${p.groups} is how many there are to share between. Deal them out one at a time and count how many each gets.`,
    };
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `${n} sweets are shared equally between ${p.groups} children.`,
            A.figure(objects(n, { shape: "circle" })),
          ],
          ask: "How many sweets does each child get?",
          answer: A.number(p.each),
          wrong: wrongs(p.each, [groupsWrong]),
          solution,
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `Share ${n} apples equally into ${p.groups} bowls.`,
              ask: "How many apples go in each bowl?",
            },
            {
              question: `${p.groups} friends share ${n} cards equally.`,
              ask: "How many cards does each friend get?",
            },
          ],
          answer: A.number(p.each),
          wrong: wrongs(p.each, [groupsWrong]),
          solution,
        });
      default:
        return A.chooseTheDiagram({
          rng,
          question: `${n} counters are shared equally between ${p.groups} plates. Each row is one plate. Which picture shows this?`,
          correct: array(p.groups, p.each, true),
          distractors: [
            {
              figure: array(p.each, p.groups, true),
              code: "MD.SHARE.GROUPS",
              feedback: `That picture has ${p.each} plates with ${p.groups} on each.`,
            },
            {
              figure: array(p.groups, p.each + 1, true),
              feedback: `That picture has ${p.groups * (p.each + 1)} counters.`,
            },
          ],
          solution,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 3) {
      const f = chosenFigure(question) as CountersSpec | undefined;
      return f?.layout === "array" && f.rows === p.groups && f.columns === p.each;
    }
    return numberAnswer(question) === p.each;
  },
});
