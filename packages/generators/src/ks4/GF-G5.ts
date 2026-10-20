/**
 * @statement GF-G5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Phase 4 slice
 * @reviewed 2026-10-20 @huntj (teacher): depth 4 checked in the gallery, all numbers settings
 */
// GF-G5: Use the congruence criteria SSS, SAS, ASA and RHS
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import {
  CRITERIA,
  CRITERION_WORDS,
  markingOf,
  pairSides,
  trianglePair,
  type Marking,
} from "../shared/triangles.ts";

interface Params {
  marking: Marking;
  /** The criterion asked for at depth 3. */
  target: Marking;
  rotation: number;
  mirror: boolean;
  /** Tenths used to size the triangles. */
  sizes: [number, number];
  claim: number;
}

const NOT_ENOUGH = "The marks do not prove the triangles are congruent";

export default defineGenerator<Params>({
  id: "GF-G5",
  version: "1.0.1",
  depths: [1, 3, 4],
  misconceptions: ["GEO.CONGRUENCE.AAA", "GEO.CONGRUENCE.SSA"],

  params(rng, numbers) {
    const markings: Marking[] = numbers === "friendly" ? CRITERIA : [...CRITERIA, "AAA", "SSA"];
    return {
      marking: rng.pick(markings),
      target: rng.pick(CRITERIA),
      rotation: numbers === "friendly" ? 0 : rng.int(20, 160),
      mirror: numbers === "stretch" && rng.bool(),
      sizes: [rng.int(0, 99), rng.int(0, 99)],
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const pair = (m: Marking): GeometrySpec => {
      let k = 0;
      const sides = pairSides(m, (min, max) => min + ((p.sizes[k++] ?? 0) % (max - min + 1)));
      return trianglePair(m, { sides, rotation: p.rotation, mirror: p.mirror });
    };
    switch (depth) {
      case 1: {
        const proves = CRITERIA.includes(p.marking);
        const coded: A.Distractor[] =
          p.marking === "AAA"
            ? [
                {
                  content: "AAA",
                  code: "GEO.CONGRUENCE.AAA",
                  feedback:
                    "Equal angles show the triangles are the same shape, but one could be bigger. AAA is not a congruence condition.",
                },
              ]
            : p.marking === "SSA"
              ? [
                  {
                    content: "SAS",
                    code: "GEO.CONGRUENCE.SSA",
                    feedback:
                      "For SAS the equal angle must be between the two pairs of equal sides. Here it is not.",
                  },
                ]
              : [];
        const others = [...CRITERIA, NOT_ENOUGH].filter(
          (c) => c !== p.marking && !coded.some((d) => d.content === c),
        );
        return A.choice({
          rng,
          question: ["The marks show which sides and angles are equal.", A.figure(pair(p.marking))],
          ask: "Which condition proves that triangles ABC and DEF are congruent?",
          correct: proves ? p.marking : NOT_ENOUGH,
          distractors: [
            ...coded,
            ...rng
              .sample(
                others.filter((c) => c !== (proves ? p.marking : NOT_ENOUGH)),
                3 - coded.length,
              )
              .map((c) => ({ content: c })),
          ],
          solution: [
            {
              say: proves
                ? `The marks show ${CRITERION_WORDS[p.marking]}: that is ${p.marking}.`
                : p.marking === "AAA"
                  ? "Three equal angles fix the shape but not the size, so the triangles need not be congruent."
                  : "The equal angle is not between the equal sides. Two different triangles can have these measurements, so they need not be congruent.",
            },
          ],
        });
      }
      case 3: {
        const decoys: Marking[] =
          p.target === "SAS"
            ? ["SSA", "SSS", "AAA"]
            : p.target === "ASA"
              ? ["AAA", "SAS", "RHS"]
              : CRITERIA.filter((c) => c !== p.target);
        return A.chooseTheDiagram({
          rng,
          question: `Which pair of triangles is marked to show they are congruent by ${p.target}?`,
          ask: "Choose the diagram.",
          correct: pair(p.target),
          distractors: decoys.map((m) => ({
            figure: pair(m),
            ...(m === "SSA"
              ? {
                  code: "GEO.CONGRUENCE.SSA",
                  feedback:
                    "The equal angle is not between the two pairs of equal sides, so this is not SAS.",
                }
              : m === "AAA"
                ? {
                    code: "GEO.CONGRUENCE.AAA",
                    feedback:
                      "Three equal angles do not prove congruence: one triangle could be an enlargement of the other.",
                  }
                : {}),
          })),
          solution: [{ say: `${p.target} means ${CRITERION_WORDS[p.target]}.` }],
        });
      }
      default: {
        const claims = [
          {
            statement:
              "If the three angles of one triangle equal the three angles of another, the triangles are congruent.",
            truth: false,
            reasons: [
              {
                text: "One triangle could be an enlargement of the other: same angles, different size.",
                correct: true,
              },
              {
                text: "Three equal angles fix everything about a triangle, so they must be congruent.",
                code: "GEO.CONGRUENCE.AAA",
              },
              { text: "It is only true for right-angled triangles." },
            ],
          },
          {
            statement:
              "Two sides and any one angle being equal is enough to prove two triangles congruent.",
            truth: false,
            reasons: [
              {
                text: "The angle must be between the two sides (SAS). With the angle elsewhere, two different triangles are possible.",
                correct: true,
              },
              {
                text: "Any two sides and an angle fix the triangle, wherever the angle is.",
                code: "GEO.CONGRUENCE.SSA",
              },
              { text: "You always need all three sides." },
            ],
          },
          {
            statement: "RHS can only be used for right-angled triangles.",
            truth: true,
            reasons: [
              {
                text: "The R stands for the right angle, and H for the hypotenuse, which only right-angled triangles have.",
                correct: true,
              },
              {
                text: "RHS works for any triangle with two pairs of equal sides and one equal angle.",
                code: "GEO.CONGRUENCE.SSA",
              },
              { text: "RHS is the same as SSS." },
            ],
          },
        ];
        const c = claims[p.claim];
        if (!c) return reject("no claim");
        return A.trueOrFalseWhy({
          rng,
          statement: c.statement,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    const answer = question.parts[0]?.answer;
    if (question.archetype === "true-or-false-why") return true;
    if (answer?.type !== "choice") return false;
    const chosen = answer.options.find((o) => o.id === answer.correct)?.content[0] as
      { v?: string; i?: number } | undefined;
    if (question.archetype === "choose-the-diagram") {
      const drawn = question.diagrams[chosen?.i ?? -1] as GeometrySpec | undefined;
      return drawn !== undefined && markingOf(drawn) === p.target;
    }
    // The marks drawn, read back, give the chosen condition (or none for AAA and SSA).
    const read = markingOf(question.diagrams[0] as GeometrySpec);
    return chosen?.v === (CRITERIA.includes(read as Marking) ? read : NOT_ENOUGH);
  },
});
