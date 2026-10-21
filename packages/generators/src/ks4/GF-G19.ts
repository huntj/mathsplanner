/**
 * @statement GF-G19
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G19: Apply the concepts of congruence and similarity, including the relationships between
// lengths in similar figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  given: number;
  claim: number;
}

// [what is known, criterion]
const GIVEN: [string, string][] = [
  ["all three pairs of sides are equal", "SSS"],
  ["two pairs of sides and the angle between them are equal", "SAS"],
  ["two pairs of angles and the side between them are equal", "ASA"],
  ["both have a right angle, and the hypotenuses and one other pair of sides are equal", "RHS"],
];

export default defineGenerator<Params>({
  id: "GF-G19",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "GEO.CONGRUENCE.AAA", "GEO.CONGRUENCE.SSA"],

  params(rng) {
    const a = rng.int(4, 12) * 2;
    const b = rng.int(3, 15) * 2;
    if (a === b) reject("different sides");
    return {
      a,
      b,
      k: rng.pick([1.5, 2.5, 0.5]),
      given: rng.int(0, GIVEN.length - 1),
      claim: rng.int(0, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = p.b * p.k;
        return A.standard({
          question: `Triangle ABC is similar to triangle DEF. AB = ${p.a} cm and DE = ${p.a * p.k} cm. BC = ${p.b} cm.`,
          ask: "Work out the length of EF.",
          answer: A.number(x, { units: "cm" }),
          wrong: wrongs(x, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.b + p.a * p.k - p.a),
              feedback: `Find the scale factor: ${p.a * p.k} ÷ ${p.a} = ${p.k}. Multiply, do not add.`,
            },
          ]),
          solution: [
            {
              say: `Scale factor = ${p.a * p.k} ÷ ${p.a} = ${p.k}. EF = ${p.b} × ${p.k} = ${x} cm.`,
            },
          ],
        });
      }
      case 2: {
        const [text, crit] = GIVEN[p.given] as (typeof GIVEN)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `In two triangles, ${text}.`,
          ask: "Which condition shows that they are congruent?",
          correct: crit,
          distractors: [...GIVEN.map((g) => g[1]).filter((c) => c !== crit), "AAA"]
            .slice(0, 3)
            .map((c) => ({
              content: c,
              ...(c === "AAA" ? { code: "GEO.CONGRUENCE.AAA" } : {}),
              feedback:
                "Match the condition to what is equal: S for a side, A for an angle, R for a right angle, H for the hypotenuse.",
            })),
          solution: [{ say: `${text[0]?.toUpperCase()}${text.slice(1)}: ${crit}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            p.claim === 0
              ? "Ben says two triangles with all three angles equal must be congruent."
              : "Ben says two triangles with all three angles equal must be similar.",
          truth: p.claim === 1,
          reasons: [
            {
              text:
                p.claim === 1
                  ? "True. Equal angles mean the same shape, so the triangles are similar; they may be different sizes."
                  : "False. Equal angles only show they are similar: one could be an enlargement of the other.",
              correct: true,
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. AAA proves congruence.`,
              code: "GEO.CONGRUENCE.AAA",
            },
            {
              text: `${p.claim === 1 ? "False" : "True"}. Any three equal measurements prove congruence.`,
              code: "GEO.CONGRUENCE.SSA",
            },
          ],
          solution: [
            { say: "Congruence needs SSS, SAS, ASA or RHS. Equal angles alone give similarity." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.b * p.k;
    if (question.archetype === "varied-form")
      return chosenText(question) === (GIVEN[p.given] as (typeof GIVEN)[number])[1];
    return true;
  },
});
