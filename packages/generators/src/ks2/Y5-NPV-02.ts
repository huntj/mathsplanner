/**
 * @statement Y5-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-NPV-02: Count forwards or backwards in steps of powers of 10 for any number up to 1 000 000
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    moreOrLess(
      "Y5-NPV-02",
      { friendly: [1000, 99999], standard: [10000, 899999], stretch: [10000, 899999] },
      { friendly: [10, 100, 1000], standard: [1000, 10000], stretch: [10000, 100000] },
    ),
    [
      {
        statement: "Kai says $1000$ more than $45{,}600$ is $46{,}600$.",
        truth: true,
        right: "True. Only the thousands digit changes: 5 becomes 6.",
        wrong: [["False. It is 45,700.", "NPV.PLACE.TENS-ONES-MIXUP"], ["False. It is 55,600."]],
      },
      {
        statement: "Mia says $100{,}000$ less than $350{,}000$ is $340{,}000$.",
        truth: false,
        right: "False. The hundred thousands digit goes down by 1: 250,000.",
        wrong: [
          ["True. Take 1 from the ten thousands.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["True. Counting back always changes the second digit."],
        ],
      },
      {
        claim: "Adding 10 to a number changes its ones digit.",
        truth: "never",
        right:
          "Never. Adding 10 changes the tens digit (and sometimes more), but the ones digit stays the same.",
        wrong: [
          ["Always. Adding changes the last digit.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["Sometimes. When the ones digit is 9."],
        ],
      },
    ],
  ),
);
