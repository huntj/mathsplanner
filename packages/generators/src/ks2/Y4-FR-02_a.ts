/**
 * @statement Y4-FR-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-02.a: Count up and down in hundredths
import { defineGenerator } from "@mathsplanner/core";
import { countParts } from "../shared/fr.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(countParts("Y4-FR-02.a", 100, { friendly: false, standard: false, stretch: false }), [
    {
      statement: "Leo counts on in hundredths: 0.07, 0.08, 0.09, 0.10.",
      truth: true,
      right: "True. 9 hundredths and 1 more hundredth make 10 hundredths, which is 0.10 or 0.1.",
      wrong: [
        ["False. After 0.09 comes 0.010.", "FR.COUNT.POINT-TEN"],
        ["False. After 0.09 comes 1.0."],
      ],
    },
    {
      claim: "Ten hundredths make one tenth.",
      truth: "always",
      right: "Always. 10 × 0.01 = 0.1.",
      wrong: [
        ["Never. Ten hundredths make one whole.", "FR.COUNT.POINT-TEN"],
        ["Sometimes. Only with money."],
      ],
    },
    {
      statement: "Ivy counts back in hundredths from 0.3. She says the next number is 0.2.",
      truth: false,
      right: "False. One hundredth less than 0.3 (0.30) is 0.29.",
      wrong: [
        ["True. Take 1 from the 3.", "FR.COUNT.POINT-TEN"],
        ["True. Each step is one tick on the number line.", "NPV.NUMBERLINE.COUNT-TICKS"],
      ],
    },
  ]),
);
