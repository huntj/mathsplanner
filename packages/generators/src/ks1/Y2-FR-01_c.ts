/**
 * @statement Y2-FR-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.c: Find 2/4 and ¾ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    namedFraction(
      "Y2-FR-01.c",
      {
        friendly: [[3, 4]],
        standard: [
          [2, 4],
          [3, 4],
        ],
        stretch: [
          [2, 4],
          [3, 4],
        ],
      },
      { friendly: 5, standard: 10, stretch: 12 },
    ),
    [
      {
        claim: "4 quarters make a whole.",
        truth: "always",
        right: "Always. A quarter is one of 4 equal parts.",
        wrong: [
          ["Never. 2 quarters make a whole.", "FR.NAME.SHADED-UNSHADED"],
          ["Sometimes. Only for pizza."],
        ],
      },
      {
        statement: "Ana says 1/4 of 8 is 2.",
        truth: true,
        right: "True. Share 8 into 4 equal groups: 2 in each.",
        wrong: [["False. It is 4.", "FR.OF-AMOUNT.UNIT-ONLY"], ["False. It is 1."]],
      },
      {
        statement: "Raj says 3/4 of a shape is shaded when 1 of its 4 equal parts is shaded.",
        truth: false,
        right: "False. 1 part of 4 is 1/4. 3/4 is the part not shaded.",
        wrong: [
          ["True. 3 parts are left.", "FR.NAME.SHADED-UNSHADED"],
          ["True. Count the white parts.", "FR.NAME.SHADED-UNSHADED"],
        ],
      },
    ],
  ),
);
