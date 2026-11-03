/**
 * @statement Y3-FR-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-FR-01.a: Count up and down in tenths
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-FR-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-FR-01.a" }, [
    {
      statement: "Kit counts in tenths: 0.7, 0.8, 0.9, 1.",
      truth: true,
      right: "True. 9 tenths and 1 more tenth make 10 tenths, which is 1 whole.",
      wrong: [
        ["False. After 0.9 comes 0.10.", "FR.COUNT.POINT-TEN"],
        ["False. After 0.9 comes 0.91."],
      ],
    },
    {
      claim: "Ten tenths make one whole.",
      truth: "always",
      right: "Always. Cut a whole into 10 equal parts, and 10 of them is the whole thing.",
      wrong: [
        ["Never. Ten tenths make ten.", "FR.COUNT.POINT-TEN"],
        ["Sometimes. Only for pizzas."],
      ],
    },
    {
      statement: "Leo counts back in tenths from 2. He says the next number is 1.10.",
      truth: false,
      right: "False. One tenth less than 2 is 1.9.",
      wrong: [
        ["True. Count back from 2 to 1.10.", "FR.COUNT.POINT-TEN"],
        ["True. Each tick on the line is 0.01.", "NPV.NUMBERLINE.COUNT-TICKS"],
      ],
    },
  ]),
);
