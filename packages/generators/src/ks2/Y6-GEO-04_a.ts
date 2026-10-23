/**
 * @statement Y6-GEO-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-GEO-04.a: Name the parts of a circle
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-GEO-04.ts";

const PARTS: [string, string][] = [
  ["the point in the middle of the circle", "Centre"],
  ["a straight line from the centre to the edge", "Radius"],
  ["a straight line from edge to edge through the centre", "Diameter"],
  ["the distance all the way round the edge", "Circumference"],
];

interface Params {
  part: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y6-GEO-04.a",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["GEO.CIRCLE.RADIUS-DIAMETER"],

  params(rng) {
    return { part: rng.int(0, PARTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      const [what, name] = PARTS[p.part] ?? PARTS[0] ?? ["", "Centre"];
      return A.choice({
        rng,
        question: [`What is the name for ${what}?`],
        correct: name,
        distractors: PARTS.filter(([, n]) => n !== name).map(([w, n]) => ({
          content: n,
          ...((n === "Radius" && name === "Diameter") || (n === "Diameter" && name === "Radius")
            ? { code: "GEO.CIRCLE.RADIUS-DIAMETER" }
            : {}),
          feedback: `The ${n.toLowerCase()} is ${w}.`,
        })),
        solution: [{ say: `${name} is ${what}.` }],
      });
    }
    return A.trueOrFalseWhy({
      rng,
      statement:
        "Kim draws a straight line from one side of a circle to the other, through the centre. She says it is a radius.",
      truth: false,
      reasons: [
        {
          text: "False. A line through the centre from edge to edge is a diameter. A radius goes from the centre to the edge.",
          correct: true,
        },
        {
          text: "True. Any straight line inside a circle is a radius.",
          code: "GEO.CIRCLE.RADIUS-DIAMETER",
        },
        {
          text: "True. Radius and diameter mean the same thing.",
          code: "GEO.CIRCLE.RADIUS-DIAMETER",
        },
      ],
      solution: [{ say: "A diameter is two radii joined through the centre." }],
    });
  },

  verify(p, question) {
    return question.key.depth !== 1 || chosenText(question) === PARTS[p.part]?.[1];
  },
};

export default defineGenerator(
  mixFamilies("Y6-GEO-04.a", { 1: own, 3: { ...parent.definition, id: "Y6-GEO-04.a" }, 4: own }),
);
