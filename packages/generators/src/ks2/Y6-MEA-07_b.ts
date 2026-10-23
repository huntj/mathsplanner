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
  mixFamilies("Y6-MEA-07.b", { 1: own, 4: { ...parent.definition, id: "Y6-MEA-07.b" } }),
);
