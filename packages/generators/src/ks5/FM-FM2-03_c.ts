/**
 * @statement FM-FM2-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM2-03.c: Analyse equilibrium and toppling
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM2-03.ts";

const own = concept(
  "FM-FM2-03.c",
  ["MECH.CENTRE-MASS"],
  [
    {
      question:
        "A solid is placed on a rough slope that is slowly made steeper. It does not slide.",
      ask: "When does it topple?",
      correct: "When the vertical through its centre of mass passes outside its base",
      wrong: [
        [
          "When the slope reaches 45°",
          "The angle depends on the shape: where the centre of mass is over the base.",
          "MECH.CENTRE-MASS",
        ],
        [
          "When its weight is greater than the friction",
          "Without sliding, toppling depends on where the weight acts.",
          "MECH.FRICTION",
        ],
      ],
      why: "The solid topples once the weight's line of action passes beyond the lowest edge of the base.",
    },
  ],
  [
    {
      statement:
        "Vic says a tall thin cylinder topples on a slope at a smaller angle than a short wide one.",
      truth: true,
      right:
        "True. A higher centre of mass and narrower base mean the vertical through it leaves the base sooner.",
      wrong: [
        ["False. All cylinders topple at the same angle.", "MECH.CENTRE-MASS"],
        ["False. Taller shapes are more stable.", "MECH.CENTRE-MASS"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FM2-03.c" };

export default defineGenerator(mixFamilies("FM-FM2-03.c", { 1: own, 2: base, 4: own }));
