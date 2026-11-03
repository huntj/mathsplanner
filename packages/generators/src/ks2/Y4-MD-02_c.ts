/**
 * @statement Y4-MD-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-02.c: Multiply and divide mentally using derived facts, e.g. 60 × 3
import { defineGenerator } from "@mathsplanner/core";
import { mentalMD } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    mentalMD(
      "Y4-MD-02.c",
      {
        friendly: ["times-tens"],
        standard: ["times-tens", "divide-tens"],
        stretch: ["times-tens", "divide-tens"],
      },
      { friendly: 1, standard: 1, stretch: 2 },
    ),
    [
      {
        claim: "If you know $3 \\times 4 = 12$, you also know $30 \\times 4 = 120$.",
        truth: "always",
        right: "Always. 30 is ten times 3, so the answer is ten times 12.",
        wrong: [
          ["Never. You must work it out again.", "MD.PLACE.ZEROS"],
          ["Sometimes. Only with even numbers."],
        ],
      },
      {
        statement: "Ella says $600 \\div 3 = 200$.",
        truth: true,
        right: "True. 6 ÷ 3 = 2, and 600 is 100 times 6, so 200.",
        wrong: [
          ["False. It is 20.", "MD.PLACE.ZEROS"],
          ["False. It is 2,000.", "MD.PLACE.ZEROS"],
        ],
      },
      {
        statement: "Leo says $50 \\times 6 = 3{,}000$.",
        truth: false,
        right: "False. 5 × 6 = 30, and 50 is ten times 5, so 300.",
        wrong: [
          ["True. 5 × 6 = 30, then add two zeros.", "MD.PLACE.ZEROS"],
          ["True. 50 and 6 make a big answer."],
        ],
      },
    ],
  ),
);
