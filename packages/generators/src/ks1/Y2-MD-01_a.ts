/**
 * @statement Y2-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.a: Recall and use the 2 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    timesTables(
      "Y2-MD-01.a",
      { friendly: [2], standard: [2], stretch: [2] },
      { friendly: 10, standard: 12, stretch: 12 },
    ),
    [
      {
        statement: "Leo says 2 × 7 = 14.",
        truth: true,
        right: "True. Double 7 is 14.",
        wrong: [
          ["False. It is 9.", "MD.MULTIPLY.ADDS"],
          ["False. It is 16.", "MD.TABLES.NEIGHBOUR"],
        ],
      },
      {
        statement: "Mia says 2 × 8 = 10.",
        truth: false,
        right: "False. 2 × 8 is double 8, which is 16.",
        wrong: [
          ["True. 2 and 8 make 10.", "MD.MULTIPLY.ADDS"],
          ["True. 10 is in the 2 times table."],
        ],
      },
      {
        claim: "Multiplying by 2 is the same as doubling.",
        truth: "always",
        right: "Always. 2 lots of a number is double it.",
        wrong: [
          ["Never. Doubling adds 2.", "MD.MULTIPLY.ADDS"],
          ["Sometimes. Only for small numbers."],
        ],
      },
    ],
  ),
);
