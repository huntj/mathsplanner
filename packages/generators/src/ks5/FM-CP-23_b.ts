/**
 * @statement FM-CP-23.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-23.b: Find angles between lines and planes
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-23.ts";

const own = concept(
  "FM-CP-23.b",
  ["GEO.VECTOR.ANGLE"],
  [
    {
      question: "The angle between a line's direction and a plane's normal is 70°.",
      ask: "What is the angle between the line and the plane?",
      correct: "20°",
      wrong: [
        [
          "70°",
          "That is the angle with the normal. The plane is at 90° to the normal.",
          "GEO.VECTOR.ANGLE",
        ],
        ["110°", "Take the angle with the normal away from 90°.", "GEO.VECTOR.ANGLE"],
      ],
      why: "The angle with the plane is 90° − 70° = 20°.",
    },
  ],
  [
    {
      statement: "Gus finds the angle between two lines as 128° and gives that as the answer.",
      truth: false,
      right: "False. The angle between two lines is given as the acute angle: 180° − 128° = 52°.",
      wrong: [
        ["True. The angle from the scalar product is always the answer.", "GEO.VECTOR.ANGLE"],
        ["True. Obtuse angles are the angles between lines.", "GEO.VECTOR.ANGLE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-23.b" };

export default defineGenerator(mixFamilies("FM-CP-23.b", { 1: own, 2: base, 4: own }));
