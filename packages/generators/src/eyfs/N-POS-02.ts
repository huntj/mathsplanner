/**
 * @statement N-POS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-POS-02: Understand position through words alone, e.g. 'the bag is under the table'
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

type Where = "on" | "under" | "next to";

interface Params {
  where: Where;
  claim: Where;
}

const PHRASE: Record<Where, string> = {
  on: "on the table",
  under: "under the table",
  "next to": "next to the table",
};
const BALL: Record<Where, [number, number]> = {
  on: [3, 3.6],
  under: [3, 0.6],
  "next to": [7.2, 0.6],
};

/** A table drawn as a top and two legs, with a ball in one of three places. */
const scene = (where: Where): GeometrySpec => ({
  type: "geometry",
  points: {
    L: [0, 3],
    R: [6, 3],
    A: [0.5, 3],
    B: [0.5, 0],
    C: [5.5, 3],
    D: [5.5, 0],
    O: BALL[where],
    G0: [-0.5, 0],
    G1: [8.5, 0],
  },
  segments: [
    { from: "L", to: "R" },
    { from: "A", to: "B" },
    { from: "C", to: "D" },
    { from: "G0", to: "G1", dashed: true },
  ],
  circles: [{ centre: "O", radius: 0.6 }],
  description: "A table and a ball.",
});

export default defineGenerator<Params>({
  id: "N-POS-02",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["POS.WORDS.OPPOSITE"],

  params(rng) {
    return {
      where: rng.pick(["on", "under", "next to"] as const),
      claim: rng.pick(["on", "under", "next to"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const all: Where[] = ["on", "under", "next to"];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [A.figure(scene(p.where))],
          ask: "Where is the ball?",
          correct: PHRASE[p.where],
          distractors: all
            .filter((w) => w !== p.where)
            .map((w) => ({
              content: PHRASE[w],
              ...((w === "on" && p.where === "under") || (w === "under" && p.where === "on")
                ? { code: "POS.WORDS.OPPOSITE" }
                : {}),
              feedback: `Look again: is the ball on top, underneath, or beside the table?`,
            })),
          solution: [{ say: `The ball is ${PHRASE[p.where]}.` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows the ball ${PHRASE[p.where]}?`],
          correct: scene(p.where),
          distractors: all
            .filter((w) => w !== p.where)
            .map((w) => ({
              figure: scene(w),
              ...((w === "on" && p.where === "under") || (w === "under" && p.where === "on")
                ? { code: "POS.WORDS.OPPOSITE" }
                : {}),
              feedback: `In that picture the ball is ${PHRASE[w]}.`,
            })),
          solution: [{ say: `Find the picture with the ball ${PHRASE[p.where]}.` }],
        });
      default: {
        const truth = p.claim === p.where;
        return A.trueOrFalseWhy({
          rng,
          statement: [A.figure(scene(p.where)), `Sam says the ball is ${PHRASE[p.claim]}.`],
          truth,
          reasons: [
            { text: `${truth ? "True" : "False"}. The ball is ${PHRASE[p.where]}.`, correct: true },
            {
              text: `${truth ? "False" : "True"}. "On" and "under" mean the same thing.`,
              code: "POS.WORDS.OPPOSITE",
            },
            { text: `${truth ? "False" : "True"}. You cannot tell where the ball is.` },
          ],
          solution: [{ say: "On means on top; under means underneath; next to means beside." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === PHRASE[p.where];
    if (question.archetype === "choose-the-diagram") {
      const at = (chosenFigure(question) as GeometrySpec | undefined)?.points.O;
      return at !== undefined && at[0] === BALL[p.where][0] && at[1] === BALL[p.where][1];
    }
    return true;
  },
});
