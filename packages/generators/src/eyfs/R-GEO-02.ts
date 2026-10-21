/**
 * @statement R-GEO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-GEO-02: Compose and decompose shapes so that children recognise a shape can have other shapes
// within it, just as numbers can
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { COMPOSITES, type Composite } from "../shared/compose.ts";

interface Params {
  c: number;
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "You can make a square from 2 triangles.",
    truth: true,
    why: "Cut a square along a diagonal and you get 2 triangles; put them back to make the square.",
  },
  {
    text: "A rectangle can be made from 2 squares.",
    truth: true,
    why: "Put 2 squares side by side and they make a rectangle.",
  },
  {
    text: "You can make a circle from squares.",
    truth: false,
    why: "Squares have straight sides and corners, so they cannot make a round shape.",
  },
];

export default defineGenerator<Params>({
  id: "R-GEO-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.COMPOSE.COUNT"],

  params(rng) {
    return { c: rng.int(0, COMPOSITES.length - 1), claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const c = COMPOSITES[p.c] as Composite;
    switch (depth) {
      case 1:
        return A.standard({
          question: [`This ${c.whole} is made of smaller ${c.parts}.`, A.figure(c.spec)],
          ask: `How many ${c.parts} make the ${c.whole}?`,
          answer: A.number(c.count),
          wrong: wrongs(c.count, [
            {
              code: "GEO.COMPOSE.COUNT",
              value: A.number(1),
              feedback: `Look inside the ${c.whole}: the lines cut it into smaller shapes.`,
            },
            {
              code: "GEO.COMPOSE.COUNT",
              value: A.number(c.count - 1),
              feedback: "Touch each small shape once as you count.",
            },
          ]),
          solution: [{ say: `There are ${c.count} ${c.parts} inside the ${c.whole}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`This ${c.whole} has been cut into smaller shapes.`, A.figure(c.spec)],
          ask: "What are the smaller shapes?",
          correct: c.parts,
          distractors: ["triangles", "squares", "circles"]
            .filter((s) => s !== c.parts)
            .map((s) => ({
              content: s,
              code: "GEO.COMPOSE.COUNT",
              feedback: "Look at one small piece: count its sides and corners.",
            })),
          solution: [{ say: `The pieces are ${c.parts}.` }],
        });
      default: {
        const cl = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Rae says: "${cl.text}"`,
          truth: cl.truth,
          reasons: [
            { text: `${cl.truth ? "True" : "False"}. ${cl.why}`, correct: true },
            {
              text: `${cl.truth ? "False" : "True"}. A shape cannot have other shapes inside it.`,
              code: "GEO.COMPOSE.COUNT",
            },
            { text: `${cl.truth ? "False" : "True"}. Any shapes can make any other shape.` },
          ],
          solution: [
            { say: "Shapes can be put together to make new shapes, just as numbers can." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const c = COMPOSITES[p.c] as Composite;
    if (question.archetype === "standard") return numberAnswer(question) === c.count;
    if (question.archetype === "varied-form") return chosenText(question) === c.parts;
    return true;
  },
});
