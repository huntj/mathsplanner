/**
 * @statement FM-CP-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-04.a: Represent complex numbers on an Argand diagram
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-04.ts";

const own = concept(
  "FM-CP-04.a",
  ["CPLX.ARGUMENT"],
  [
    {
      question: "On an Argand diagram, where is the point for $z = -2 + 3i$?",
      correct: "2 to the left of the origin and 3 up",
      wrong: [
        [
          "2 to the right of the origin and 3 up",
          "The real part is −2, so it is to the left.",
          "CPLX.ARGUMENT",
        ],
        [
          "3 to the left of the origin and 2 up",
          "The real part goes across and the imaginary part goes up.",
          "GEO.VECTOR.COMPONENTS",
        ],
      ],
      why: "The real part, −2, is the horizontal coordinate and the imaginary part, 3, is the vertical one.",
    },
  ],
  [
    {
      statement:
        "Dev says $z$ and its conjugate $z^*$ are reflections of each other in the imaginary axis on an Argand diagram.",
      truth: false,
      right: "False. Changing the sign of the imaginary part reflects in the real axis.",
      wrong: [
        ["True. The conjugate changes the sign of the real part.", "CPLX.CONJUGATE"],
        ["True. Conjugates are always on the imaginary axis.", "CPLX.CONJUGATE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-04.a" };

export default defineGenerator(mixFamilies("FM-CP-04.a", { 1: base, 2: own, 4: own }));
