/**
 * @statement Y2-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.b: Recall and use the 5 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y2-MD-01.b",
      { friendly: [5], standard: [5], stretch: [5] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Sam says 5 × 6 = 30.",
        truth: true,
        right: "True. 5, 10, 15, 20, 25, 30.",
        wrong: [
          ["False. It is 11.", "MD.MULTIPLY.ADDS"],
          ["False. It is 35.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Pia says 5 × 3 = 8.",
        truth: false,
        right: "False. 5 × 3 means 3 fives: 5, 10, 15.",
        wrong: [
          ["True. 5 and 3 make 8.", "MD.MULTIPLY.ADDS"],
          ["True. 8 is in the 5 times table."],
        ],
      },
      {
        claim: "Numbers in the 5 times table end in 0 or 5.",
        truth: "always",
        right: "Always. 5, 10, 15, 20 … they end in 5 or 0.",
        wrong: [["Sometimes. 5 × 3 = 13.", "MD.TABLES.NEIGHBOUR"], ["Never. They end in 3."]],
      },
    ],
  ),
);
