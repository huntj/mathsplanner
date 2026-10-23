/**
 * @statement Y5-GEO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-GEO-02.a: Know angles are measured in degrees and estimate them
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y5-GEO-02.ts";

const TURNS: [string, number][] = [
  ["a quarter turn", 90],
  ["a half turn", 180],
  ["a three-quarter turn", 270],
  ["a whole turn", 360],
];

interface Params {
  turn: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y5-GEO-02.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.TURNS.FRACTION"],

  params(rng) {
    return { turn: rng.int(0, TURNS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [name, deg] = TURNS[p.turn] ?? ["a quarter turn", 90];
    if (depth === 1) {
      return A.standard({
        question: `A whole turn is 360°.`,
        ask: `How many degrees is ${name}?`,
        answer: A.number(deg, { units: "°" }),
        wrong: wrongs(deg, [
          {
            code: "GEO.TURNS.FRACTION",
            value: A.number(deg === 180 ? 90 : 180, { units: "°" }),
            feedback: "A right angle, a quarter turn, is 90°. Count the quarter turns.",
          },
        ]),
        solution: [
          {
            say: `${name[0]?.toUpperCase()}${name.slice(1)} is ${deg / 90} quarter turn${deg > 90 ? "s" : ""}: ${deg / 90} × 90° = ${deg}°.`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: "Leah says a right angle is 100°, because a whole turn is 400°.",
      truth: false,
      reasons: [
        {
          text: "False. A whole turn is 360°, so a right angle, a quarter of it, is 90°.",
          correct: true,
        },
        {
          text: "True. Angles are measured in hundreds, like percentages.",
          code: "GEO.TURNS.FRACTION",
        },
        { text: "True. A right angle is half a turn.", code: "GEO.TURNS.FRACTION" },
      ],
      solution: [{ say: "360° in a whole turn, 180° in a half turn, 90° in a right angle." }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || numberAnswer(question) === TURNS[p.turn]?.[1];
  },
};

export default defineGenerator(
  mixFamilies("Y5-GEO-02.a", { 1: own, 2: { ...parent.definition, id: "Y5-GEO-02.a" }, 4: own }),
);
