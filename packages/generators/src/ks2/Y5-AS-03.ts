/**
 * @statement Y5-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-AS-03: Use rounding to check answers and determine levels of accuracy
import { defineGenerator } from "@mathsplanner/core";
import { checking } from "../shared/as.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    checking(
      "Y5-AS-03",
      { friendly: [10001, 49999], standard: [10001, 99999], stretch: [100001, 999999] },
      { friendly: [1000], standard: [1000, 10000], stretch: [10000, 100000] },
    ),
    [
      {
        statement:
          "Kit works out $3{,}980 + 2{,}105 = 6{,}085$. Sam estimates $4{,}000 + 2{,}000 = 6{,}000$ and says the answer looks right.",
        truth: true,
        right: "True. 6,085 is close to the estimate of 6,000.",
        wrong: [
          ["False. An estimate must match exactly.", "NPV.ROUND.ALWAYS-DOWN"],
          ["False. You check addition with addition.", "AS.INVERSE.SAME-OPERATION"],
        ],
      },
      {
        statement: "To check $512 - 278 = 234$, Ivy works out $512 + 278$.",
        truth: false,
        right: "False. Check with the inverse: 234 + 278 should give 512.",
        wrong: [
          ["True. Check by doing the same numbers again.", "AS.INVERSE.SAME-OPERATION"],
          ["True. Adding always checks subtracting."],
        ],
      },
      {
        claim: "Adding back what you took away gets you back to where you started.",
        truth: "always",
        right: "Always. Addition undoes subtraction.",
        wrong: [
          ["Never. You need to take it away again.", "AS.INVERSE.SAME-OPERATION"],
          ["Sometimes. Only for small numbers."],
        ],
      },
    ],
  ),
);
