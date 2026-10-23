/**
 * @statement Y8-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-GEO-02.b: Use the criteria for congruent triangles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const CASES: [string, string][] = [
  ["all three pairs of sides are equal", "SSS"],
  ["two pairs of sides and the angle between them are equal", "SAS"],
  ["two pairs of angles and the side between them are equal", "ASA"],
  ["both have a right angle, and their hypotenuses and one other pair of sides are equal", "RHS"],
];
const NOT_PROOF: [string, string, string][] = [
  [
    "All three pairs of angles are equal",
    "GEO.CONGRUENCE.AAA",
    "Equal angles give the same shape, but one triangle can be an enlargement of the other.",
  ],
  [
    "Two pairs of sides and an angle not between them are equal",
    "GEO.CONGRUENCE.SSA",
    "With the angle not between the sides, two different triangles can often be drawn.",
  ],
];

interface Params {
  c: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "Y8-GEO-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.CONGRUENCE.AAA", "GEO.CONGRUENCE.SSA"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1), n: rng.int(0, NOT_PROOF.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, right] = CASES[p.c] ?? CASES[0] ?? ["", "SSS"];
        return A.choice({
          rng,
          question: [`Two triangles are congruent because ${what}. Which condition is this?`],
          correct: right,
          distractors: [
            ...CASES.filter((_, i) => i !== p.c)
              .slice(0, 1)
              .map(([, o]) => ({
                content: o,
                feedback:
                  "Check whether the angle is between the sides, or the side between the angles.",
              })),
            {
              content: "AAA",
              code: "GEO.CONGRUENCE.AAA",
              feedback: "AAA is not a congruence condition.",
            },
          ],
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const [right, code, why] = NOT_PROOF[p.n] ?? NOT_PROOF[0] ?? ["", "GEO.CONGRUENCE.AAA", ""];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these facts does NOT prove that two triangles are congruent?"],
          correct: right,
          distractors: CASES.slice(0, 2).map(([w, c]) => ({
            content: `${w[0]?.toUpperCase()}${w.slice(1)}`,
            code,
            feedback: `That is ${c}, which does prove congruence.`,
          })),
          solution: [{ say: why }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Mia says two triangles with the same three angles must be congruent."],
          truth: false,
          reasons: [
            {
              text: "False. They are similar (same shape), but one can be bigger than the other, so not congruent.",
              correct: true,
            },
            { text: "True. AAA is a congruence condition.", code: "GEO.CONGRUENCE.AAA" },
            { text: "True. Equal angles mean equal sides.", code: "GEO.CONGRUENCE.AAA" },
          ],
          solution: [{ say: "Congruence needs at least one pair of equal sides as well." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === CASES[p.c]?.[1];
    if (question.key.depth === 2) return chosenText(question) === NOT_PROOF[p.n]?.[0];
    return true;
  },
});
