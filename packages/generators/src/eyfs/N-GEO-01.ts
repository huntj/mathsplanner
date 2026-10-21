/**
 * @statement N-GEO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-GEO-01: Select shapes appropriately: flat surfaces for a building, a triangular prism for a roof
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { GeometrySpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { sketch, type Solid } from "../shared/solids.ts";

interface Params {
  task: number;
  roller: number;
  claim: number;
}

// [the job, the best block, poorer choices]
const TASKS: [string, Solid, Solid[]][] = [
  ["the roof of a model house", "triangular prism", ["sphere", "cylinder"]],
  ["the bottom of a tall tower", "cube", ["sphere", "cone"]],
  ["a wheel that rolls along", "cylinder", ["cube", "square-based pyramid"]],
];
const ROLLERS: Solid[] = ["sphere", "cylinder"];
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "You can build a tall tower out of balls.",
    truth: false,
    why: "Balls are round all over, so they roll off each other.",
  },
  {
    text: "Cubes are good for building a wall.",
    truth: true,
    why: "Cubes have flat faces, so they stack without rolling.",
  },
  {
    text: "A cone can be the top of a tower.",
    truth: true,
    why: "Its flat circle sits on the tower and its point goes up.",
  },
];

export default defineGenerator<Params>({
  id: "N-GEO-01",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["GEO.SOLIDS.ROLL-STACK"],

  params(rng) {
    return {
      task: rng.int(0, TASKS.length - 1),
      roller: rng.int(0, ROLLERS.length - 1),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [job, best, others] = TASKS[p.task] as (typeof TASKS)[number];
        return A.choice({
          rng,
          question: `Which block would be best for ${job}?`,
          correct: best,
          distractors: others.map((s) => ({
            content: s,
            code: "GEO.SOLIDS.ROLL-STACK",
            feedback: `Think about whether a ${s} has flat faces to sit on, or curves that roll.`,
          })),
          solution: [{ say: `A ${best} is best for ${job}.` }],
        });
      }
      case 3: {
        const roller = ROLLERS[p.roller] as Solid;
        return A.chooseTheDiagram({
          rng,
          question: ["Which block would roll down a slope?"],
          correct: sketch(roller),
          distractors: (["cube", "cuboid"] as Solid[]).map((s) => ({
            figure: sketch(s),
            code: "GEO.SOLIDS.ROLL-STACK",
            feedback: `A ${s} has only flat faces, so it slides or stays still.`,
          })),
          solution: [{ say: `A ${roller} has a curved surface, so it rolls.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Finn says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Round shapes stack best.`,
              code: "GEO.SOLIDS.ROLL-STACK",
            },
            { text: `${c.truth ? "False" : "True"}. Every block can be used for every job.` },
          ],
          solution: [{ say: "Flat faces stack; curved surfaces roll." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === (TASKS[p.task] as (typeof TASKS)[number])[1];
    if (question.archetype === "choose-the-diagram")
      return (
        JSON.stringify(chosenFigure(question) as GeometrySpec | undefined) ===
        JSON.stringify(sketch(ROLLERS[p.roller] as Solid))
      );
    return true;
  },
});
