/**
 * @statement FM-CP-11.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-11.a: Calculate determinants and interpret them as scale factors
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-11.ts";

const own = concept(
  "FM-CP-11.a",
  ["MAT.DETERMINANT"],
  [],
  [
    {
      statement:
        "A shape of area 5 is transformed by a matrix with determinant $-3$. Yan says the image has area $-15$.",
      truth: false,
      right:
        "False. The area scale factor is |det| = 3, so the area is 15. The negative sign shows the shape has been reflected.",
      wrong: [
        ["True. Multiply the area by the determinant.", "MAT.DETERMINANT"],
        ["True. A negative area means the shape is upside down.", "MAT.DETERMINANT"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-11.a" };

export default defineGenerator(mixFamilies("FM-CP-11.a", { 1: base, 2: base, 4: own }));
