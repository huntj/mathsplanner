/**
 * @statement Y3-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.c: Recall and use the 8 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y3-MD-01.c",
      { friendly: [8], standard: [8], stretch: [8] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Sol says 8 × 6 = 48.",
        truth: true,
        right: "True. 8 × 6 = 48.",
        wrong: [
          ["False. It is 14.", "MD.MULTIPLY.ADDS"],
          ["False. It is 56.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Ella says 8 × 7 = 54.",
        truth: false,
        right: "False. 8 × 7 = 56.",
        wrong: [["True. 54 is close to 56.", "MD.TABLES.NEIGHBOUR"], ["True. 8 + 7 is about 54."]],
      },
      {
        claim: "A number in the 8 times table is also in the 4 times table.",
        truth: "always",
        right: "Always. 8 = 2 × 4, so 8 lots of a number is 4 lots of double it.",
        wrong: [
          ["Never. They are different tables.", "MD.TABLES.NEIGHBOUR"],
          ["Sometimes. Only up to 40."],
        ],
      },
    ],
  ),
);
