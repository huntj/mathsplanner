/**
 * @statement Y1-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-FR-02: Recognise, find and name a quarter as one of four equal parts
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    namedFraction(
      "Y1-FR-02",
      {
        friendly: [[1, 4]],
        standard: [
          [1, 4],
          [1, 2],
        ],
        stretch: [
          [1, 4],
          [1, 2],
        ],
      },
      { friendly: 3, standard: 5, stretch: 10 },
    ),
    [
      {
        claim: "A quarter is one of 4 equal parts.",
        truth: "always",
        right: "Always. Quarters come from sharing into 4 equal parts.",
        wrong: [
          ["Never. A quarter is one of 2 parts.", "FR.NAME.SHADED-UNSHADED"],
          ["Sometimes. The parts can be different.", "FR.PARTS.UNEQUAL"],
        ],
      },
      {
        statement: "Sam says a quarter of 8 sweets is 2 sweets.",
        truth: true,
        right: "True. Share 8 into 4 equal groups: 2 in each.",
        wrong: [["False. It is 4.", "FR.OF-AMOUNT.UNIT-ONLY"], ["False. It is 8."]],
      },
      {
        statement: "Ana says a quarter is bigger than a half.",
        truth: false,
        right: "False. A quarter is half of a half, so it is smaller.",
        wrong: [
          ["True. 4 is bigger than 2.", "FR.NAME.SHADED-UNSHADED"],
          ["True. Quarters are the biggest."],
        ],
      },
    ],
  ),
);
