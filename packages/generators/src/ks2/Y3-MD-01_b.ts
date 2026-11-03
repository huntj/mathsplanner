/**
 * @statement Y3-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.b: Recall and use the 4 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y3-MD-01.b",
      { friendly: [4], standard: [4], stretch: [4] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Ana says 4 × 9 = 36.",
        truth: true,
        right: "True. Double 9 is 18, and double 18 is 36.",
        wrong: [
          ["False. It is 13.", "MD.MULTIPLY.ADDS"],
          ["False. It is 32.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Kit says 28 ÷ 4 = 8.",
        truth: false,
        right: "False. 4 × 7 = 28, so 28 ÷ 4 = 7.",
        wrong: [
          ["True. 4 × 8 = 28.", "MD.TABLES.NEIGHBOUR"],
          ["True. 28 ends in 8, so the answer is 8."],
        ],
      },
      {
        claim: "Multiplying by 4 is the same as doubling and doubling again.",
        truth: "always",
        right: "Always. 4 = 2 × 2, so 4 × 6 = double 12 = 24.",
        wrong: [
          ["Never. You must add 4.", "MD.MULTIPLY.ADDS"],
          ["Sometimes. Only for even numbers."],
        ],
      },
    ],
  ),
);
