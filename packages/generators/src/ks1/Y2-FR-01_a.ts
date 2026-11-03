/**
 * @statement Y2-FR-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.a: Find ½ and ¼ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    namedFraction(
      "Y2-FR-01.a",
      {
        friendly: [
          [1, 2],
          [1, 4],
        ],
        standard: [
          [1, 2],
          [1, 4],
        ],
        stretch: [
          [1, 2],
          [1, 4],
        ],
      },
      { friendly: 5, standard: 10, stretch: 12 },
    ),
    [
      {
        claim: "Halves of the same shape are equal in size.",
        truth: "always",
        right: "Always. A half is one of 2 equal parts.",
        wrong: [
          ["Sometimes. One half can be bigger.", "FR.PARTS.UNEQUAL"],
          ["Never. Halves are different sizes."],
        ],
      },
      {
        statement: "A pizza is cut into 2 equal pieces. Leo says each piece is a half.",
        truth: true,
        right: "True. 2 equal parts are halves.",
        wrong: [
          ["False. Each piece is a quarter.", "FR.NAME.SHADED-UNSHADED"],
          ["False. The pieces must be different.", "FR.PARTS.UNEQUAL"],
        ],
      },
      {
        statement:
          "A cake is cut into 2 pieces, one big and one small. Mia says each piece is a half.",
        truth: false,
        right: "False. Halves must be equal. These pieces are different sizes.",
        wrong: [
          ["True. 2 pieces means halves.", "FR.PARTS.UNEQUAL"],
          ["True. Any cut makes halves.", "FR.PARTS.UNEQUAL"],
        ],
      },
    ],
  ),
);
