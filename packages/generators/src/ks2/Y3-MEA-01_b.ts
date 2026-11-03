/**
 * @statement Y3-MEA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MEA-01.b: Measure mass and capacity
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-MEA-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-MEA-01.b", depths: [1, 4] }, [
    {
      statement: "Kim says 1 kg is heavier than 500 g.",
      truth: true,
      right: "True. 1 kg = 1000 g, which is more than 500 g.",
      wrong: [["False. 500 is more than 1.", "MEA.UNITS.MIXED"], ["False. They weigh the same."]],
    },
    {
      claim: "To compare 2 litres and 1500 ml, you should write them in the same unit first.",
      truth: "always",
      right: "Always. 2 l = 2000 ml, which is more than 1500 ml.",
      wrong: [
        ["Never. Just compare 2 and 1500.", "MEA.UNITS.MIXED"],
        ["Sometimes. Only for water."],
      ],
    },
    {
      statement: "A bag of flour is 2 kg. Raj takes out 500 g and says 1 kg is left.",
      truth: false,
      right: "False. 2 kg = 2000 g, and 2000 − 500 = 1500 g, so 1.5 kg is left.",
      wrong: [
        ["True. Take 1 from the 2.", "AS.MULTISTEP.ONE-STEP"],
        ["True. 500 g is 1 kg.", "MEA.UNITS.MIXED"],
      ],
    },
  ]),
);
