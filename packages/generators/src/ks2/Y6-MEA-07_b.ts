/**
 * @statement Y6-MEA-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MEA-07.b: Use cm³, m³, km³ and mm³ to estimate and compare volumes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type GeneratorDefinition, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-MEA-07.ts";
import { withClaims } from "../shared/variety.ts";

const THINGS: [string, string][] = [
  ["a grain of rice", "mm³"],
  ["a sugar cube", "cm³"],
  ["a shoe box", "cm³"],
  ["a classroom", "m³"],
  ["a swimming pool", "m³"],
  ["a mountain", "km³"],
];
const UNITS = ["mm³", "cm³", "m³", "km³"];

interface Params {
  thing: number;
}

const own: GeneratorDefinition<Params> = {
  id: "Y6-MEA-07.b",
  version: "1.0.0",
  depths: [1],
  misconceptions: [],

  params(rng) {
    return { thing: rng.int(0, THINGS.length - 1) };
  },

  build(p, _depth, rng): QuestionDraft {
    const [what, unit] = THINGS[p.thing] ?? THINGS[0] ?? ["", "cm³"];
    return A.choice({
      rng,
      question: [`Which unit is best for measuring the volume of ${what}?`],
      correct: unit,
      distractors: UNITS.filter((u) => u !== unit).map((u) => ({
        content: u,
        feedback: `Think about the size: one ${u} is ${{ "mm³": "a tiny speck", "cm³": "about a sugar cube", "m³": "a box you could sit in", "km³": "enormous, like a mountain" }[u]}.`,
      })),
      solution: [{ say: `${what[0]?.toUpperCase()}${what.slice(1)} is best measured in ${unit}.` }],
    });
  },

  verify(p, question) {
    return chosenText(question) === THINGS[p.thing]?.[1];
  },
};

export default defineGenerator(
  withClaims(
    mixFamilies("Y6-MEA-07.b", { 1: own, 4: { ...parent.definition, id: "Y6-MEA-07.b" } }),
    [
      {
        statement: "Ali says 1 litre of water fills 1000 cm³.",
        truth: true,
        right: "True. 1 l = 1000 ml, and 1 ml fills 1 cm³.",
        wrong: [
          ["False. It fills 100 cm³.", "RAT.UNITS.AREA-FACTOR"],
          ["False. Litres cannot be written in cm³."],
        ],
      },
      {
        claim: "A 1 m cube holds 1 000 000 cm³.",
        truth: "always",
        right: "Always. It is 100 cm by 100 cm by 100 cm, and 100 × 100 × 100 = 1 000 000.",
        wrong: [
          ["Never. It holds 100 cm³, as 1 m = 100 cm.", "RAT.UNITS.AREA-FACTOR"],
          ["Sometimes. It depends on its shape."],
        ],
      },
      {
        statement: "Tom says a matchbox has a volume of about 20 m³.",
        truth: false,
        right: "False. A matchbox fits in your hand: about 20 cm³. 20 m³ is the size of a room.",
        wrong: [
          ["True. Small things are measured in m³.", "MEA.VOLUME.ADDS"],
          ["True. m³ and cm³ are about the same."],
        ],
      },
    ],
  ),
);
