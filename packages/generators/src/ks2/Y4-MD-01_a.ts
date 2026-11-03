/**
 * @statement Y4-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.a: Recall the 6 and 9 times tables
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y4-MD-01.a",
      { friendly: [6, 9], standard: [6, 9], stretch: [6, 9] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Raj says $6 \\times 9 = 54$.",
        truth: true,
        right: "True. 6 × 9 = 54.",
        wrong: [
          ["False. It is 15.", "MD.MULTIPLY.ADDS"],
          ["False. It is 63.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Kim says $9 \\times 7 = 72$.",
        truth: false,
        right: "False. 9 × 7 = 63. 72 is 9 × 8.",
        wrong: [
          ["True. 72 is in the 9 times table.", "MD.TABLES.NEIGHBOUR"],
          ["True. 9 + 7 is close to 72."],
        ],
      },
      {
        claim: "A number in the 6 times table is even.",
        truth: "always",
        right: "Always. 6 is even, so every multiple of 6 is even.",
        wrong: [["Sometimes. 6 × 3 = 18 is odd."], ["Never. Times tables are odd."]],
      },
    ],
  ),
);
