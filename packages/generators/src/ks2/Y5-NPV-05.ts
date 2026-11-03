/**
 * @statement Y5-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-05: Read Roman numerals to 1000 (M) and recognise years written in Roman numerals
import { defineGenerator } from "@mathsplanner/core";
import { romanNumerals } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    romanNumerals("Y5-NPV-05", {
      friendly: [50, 200],
      standard: [100, 1000],
      stretch: [1066, 2030],
    }),
    [
      {
        statement: "Leo says XIV is 14.",
        truth: true,
        right: "True. X is 10, and IV is 5 − 1 = 4.",
        wrong: [["False. It is 16: 10 + 1 + 5.", "NPV.ROMAN.SUBTRACTIVE"], ["False. It is 6."]],
      },
      {
        statement: "Ana says the year MMXX is 2200.",
        truth: false,
        right: "False. M is 1000 and X is 10, so MMXX = 1000 + 1000 + 10 + 10 = 2020.",
        wrong: [
          ["True. X stands for 100.", "NPV.ROMAN.SUBTRACTIVE"],
          ["True. Every letter is worth 1000 or 100."],
        ],
      },
      {
        claim: "A smaller numeral written before a bigger one is taken away.",
        truth: "always",
        right: "Always. That is the rule: IV = 4, IX = 9, XL = 40, CM = 900.",
        wrong: [
          ["Never. The numerals are always added.", "NPV.ROMAN.SUBTRACTIVE"],
          ["Sometimes. Only with I."],
        ],
      },
    ],
  ),
);
