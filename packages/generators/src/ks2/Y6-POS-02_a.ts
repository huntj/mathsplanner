/**
 * @statement Y6-POS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-POS-02.a: Translate shapes on the coordinate plane
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-POS-02.ts";
import translations from "./Y5-POS-01_b.ts";
import { withClaims } from "../shared/variety.ts";

const slide = { ...translations.definition, id: "Y6-POS-02.a" };

export default defineGenerator(
  withClaims(
    mixFamilies("Y6-POS-02.a", {
      1: slide,
      2: { ...parent.definition, id: "Y6-POS-02.a" },
      4: slide,
    }),
    [
      {
        statement:
          "The point (2, 3) is translated 4 right and 1 down. Ola says it moves to (6, 2).",
        truth: true,
        right: "True. Right adds to x: 2 + 4 = 6. Down takes from y: 3 − 1 = 2.",
        wrong: [
          ["False. It moves to (3, 7).", "ALG.COORD.ORDER"],
          ["False. It moves to (−2, 4).", "POS.TRANSLATE.DIRECTION"],
        ],
      },
      {
        claim: "A translated shape faces the same way as the original.",
        truth: "always",
        right: "Always. A translation slides a shape without turning or flipping it.",
        wrong: [
          ["Sometimes. It turns if it moves a long way.", "POS.TRANSFORM.CHANGES-SHAPE"],
          ["Never. It flips over.", "POS.REFLECT.WRONG-AXIS"],
        ],
      },
      {
        statement: "Sol translates (5, 1) 3 left and says it moves to (8, 1).",
        truth: false,
        right: "False. Left takes away from x: 5 − 3 = 2, so (2, 1).",
        wrong: [
          ["True. Add 3 to x.", "POS.TRANSLATE.DIRECTION"],
          ["True. Translations always add."],
        ],
      },
    ],
  ),
);
