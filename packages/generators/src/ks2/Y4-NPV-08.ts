/**
 * @statement Y4-NPV-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-NPV-08: Read Roman numerals to 100 (I to C) and know that the numeral system changed over time
// to include zero and place value
import { defineGenerator } from "@mathsplanner/core";
import { romanNumerals } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    romanNumerals("Y4-NPV-08", { friendly: [1, 20], standard: [1, 50], stretch: [20, 100] }),
    [
      {
        statement: "Leo says XIX is 19.",
        truth: true,
        right: "True. X is 10 and IX is 9: 10 + 9 = 19.",
        wrong: [["False. It is 21: 10 + 1 + 10.", "NPV.ROMAN.SUBTRACTIVE"], ["False. It is 9."]],
      },
      {
        statement: "Mia writes 40 as XXXX.",
        truth: false,
        right: "False. 40 is written XL: 50 take away 10.",
        wrong: [
          ["True. Four tens make 40.", "NPV.ROMAN.SUBTRACTIVE"],
          ["True. You can repeat a numeral as often as you like."],
        ],
      },
      {
        claim: "Roman numerals use letters to stand for numbers.",
        truth: "always",
        right: "Always. I is 1, V is 5, X is 10, L is 50 and C is 100.",
        wrong: [["Sometimes. They also use our digits."], ["Never. They are pictures."]],
      },
    ],
  ),
);
