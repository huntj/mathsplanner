/**
 * @statement FM-FM2-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-03.a: Find centres of mass of solids
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-03.ts";

const own = concept(
  "FM-FM2-03.a",
  ["MECH.CENTRE-MASS"],
  [
    {
      question: "A uniform solid cone has height 12 cm.",
      ask: "How far above its base is its centre of mass?",
      correct: "3 cm",
      wrong: [
        [
          "6 cm",
          "Most of the mass is near the base: the centre of mass is h/4 above it.",
          "MECH.CENTRE-MASS",
        ],
        ["4 cm", "h/3 is for a triangular lamina; a solid cone uses h/4.", "MECH.CENTRE-MASS"],
      ],
      why: "For a solid cone the centre of mass is $\\frac{h}{4} = 3$ cm above the base.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FM2-03.a" };

export default defineGenerator(mixFamilies("FM-FM2-03.a", { 1: base, 2: own, 4: base }));
