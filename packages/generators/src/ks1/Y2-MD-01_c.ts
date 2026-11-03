/**
 * @statement Y2-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.c: Recall and use the 10 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y2-MD-01.c",
      { friendly: [10], standard: [10], stretch: [10] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Kim says 10 × 4 = 40.",
        truth: true,
        right: "True. 4 tens are 40.",
        wrong: [
          ["False. It is 14.", "MD.MULTIPLY.ADDS"],
          ["False. It is 50.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Raj says 10 × 7 = 17.",
        truth: false,
        right: "False. 10 × 7 means 7 tens, which is 70.",
        wrong: [["True. Put 1 in front of 7.", "MD.MULTIPLY.ADDS"], ["True. 10 and 7 make 17."]],
      },
      {
        claim: "Multiplying a number by 10 makes it end in 0.",
        truth: "always",
        right: "Always. 10 × 3 = 30, 10 × 8 = 80.",
        wrong: [["Sometimes. 10 × 5 = 15.", "MD.TABLES.NEIGHBOUR"], ["Never. It ends in 1."]],
      },
    ],
  ),
);
