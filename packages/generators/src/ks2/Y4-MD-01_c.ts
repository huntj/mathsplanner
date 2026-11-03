/**
 * @statement Y4-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.c: Recall the 11 and 12 times tables
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y4-MD-01.c",
      { friendly: [11, 12], standard: [11, 12], stretch: [11, 12] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Ivy says $11 \\times 12 = 132$.",
        truth: true,
        right: "True. 11 × 12 = 120 + 12 = 132.",
        wrong: [
          ["False. It is 23.", "MD.MULTIPLY.ADDS"],
          ["False. It is 121.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Max says $12 \\times 8 = 86$.",
        truth: false,
        right: "False. 12 × 8 = 96.",
        wrong: [["True. 12 × 8 is 80 and 6 more.", "MD.TABLES.NEIGHBOUR"], ["True. 8 × 10 + 6."]],
      },
      {
        claim: "A number in the 11 times table up to $11 \\times 9$ has two digits the same.",
        truth: "always",
        right: "Always. 11, 22, 33, … 99.",
        wrong: [
          ["Sometimes. 11 × 5 is 56.", "MD.TABLES.NEIGHBOUR"],
          ["Never. Each answer has different digits."],
        ],
      },
    ],
  ),
);
