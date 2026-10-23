/**
 * @statement Y3-GEO-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-04.a: Identify horizontal and vertical lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y3-GEO-04.ts";

const THINGS: [string, "Horizontal" | "Vertical"][] = [
  ["a flagpole standing straight up", "Vertical"],
  ["the surface of still water in a bath", "Horizontal"],
  ["a lamp post", "Vertical"],
  ["the top edge of a table", "Horizontal"],
  ["a rope hanging straight down with a weight on the end", "Vertical"],
  ["the line where the sea meets the sky", "Horizontal"],
];

interface Params {
  thing: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y3-GEO-04.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.LINES.PARALLEL-PERPENDICULAR"],

  params(rng) {
    return { thing: rng.int(0, THINGS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const [what, right] = THINGS[p.thing] ?? THINGS[0] ?? ["", "Vertical"];
    if (depth === 1) {
      return A.choice({
        rng,
        question: [`Think about ${what}.`],
        ask: "Is it horizontal or vertical?",
        correct: right,
        distractors: [
          {
            content: right === "Vertical" ? "Horizontal" : "Vertical",
            feedback:
              "Horizontal lines go across, like the horizon. Vertical lines go straight up and down.",
          },
          { content: "Neither", feedback: "It is level or upright, so it is one of the two." },
        ],
        solution: [
          {
            say: `It goes ${right === "Vertical" ? "straight up and down" : "straight across"}, so it is ${right.toLowerCase()}.`,
          },
        ],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement: "Ben says a horizontal line and a vertical line that meet are perpendicular.",
      truth: true,
      reasons: [
        {
          text: "True. They meet at a right angle, which is what perpendicular means.",
          correct: true,
        },
        {
          text: "False. They are parallel, because one is across and one is up.",
          code: "GEO.LINES.PARALLEL-PERPENDICULAR",
        },
        { text: "False. Only two vertical lines can be perpendicular." },
      ],
      solution: [{ say: "Horizontal and vertical lines always meet at right angles." }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || chosenText(question) === THINGS[p.thing]?.[1];
  },
};

export default defineGenerator(
  mixFamilies("Y3-GEO-04.a", { 1: own, 2: { ...parent.definition, id: "Y3-GEO-04.a" }, 4: own }),
);
