/**
 * @statement Y5-FR-09.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-09.b: Order and compare numbers with up to three decimal places
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-09.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y5-FR-09.b" }, [
    {
      statement: "Ivy says $0.7 > 0.65$.",
      truth: true,
      right: "True. 0.7 = 0.70, and 70 hundredths is more than 65 hundredths.",
      wrong: [
        ["False. 0.65 has more digits.", "NPV.DECIMAL.LONGER-BIGGER"],
        ["False. 65 is bigger than 7.", "NPV.DECIMAL.LONGER-BIGGER"],
      ],
    },
    {
      claim: "A decimal with more digits after the point is bigger.",
      truth: "sometimes",
      right: "Sometimes. 0.35 > 0.3, but 0.12 < 0.5. Compare tenths first.",
      wrong: [
        ["Always. More digits make a bigger number.", "NPV.DECIMAL.LONGER-BIGGER"],
        ["Never. Fewer digits are bigger."],
      ],
    },
    {
      statement: "Max puts 2.1, 2.09 and 2.15 in order, smallest first: 2.1, 2.09, 2.15.",
      truth: false,
      right: "False. 2.09 has 0 tenths, so it is smallest: 2.09, 2.1, 2.15.",
      wrong: [
        ["True. 2.1 has the fewest digits, so it is smallest.", "NPV.DECIMAL.LONGER-BIGGER"],
        ["True. Compare the ones first, and they are all 2.", "NPV.COMPARE.ONES-FIRST"],
      ],
    },
  ]),
);
