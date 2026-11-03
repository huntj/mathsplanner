/**
 * @statement Y4-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-STA-01.b: Interpret and present time graphs for continuous data
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-STA-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y4-STA-01.b" }, [
    {
      statement:
        "A time graph shows a puppy's weight going up every week. Mia says the puppy got heavier every week.",
      truth: true,
      right: "True. The line goes up each week, so the weight went up.",
      wrong: [
        ["False. Going up means lighter.", "STA.SCALE.READ"],
        ["False. Time graphs cannot show weight."],
      ],
    },
    {
      claim: "On a time graph, time goes along the bottom.",
      truth: "always",
      right: "Always. Time is on the horizontal axis and the thing measured goes up the side.",
      wrong: [
        ["Never. Time goes up the side.", "STA.SCALE.READ"],
        ["Sometimes. Only for temperatures."],
      ],
    },
    {
      statement:
        "The scale on a time graph goes up in 5s. Raj reads a point halfway between 10 and 15 as 11.",
      truth: false,
      right: "False. Halfway between 10 and 15 is 12.5.",
      wrong: [
        ["True. Each small step is 1.", "STA.SCALE.READ"],
        ["True. Round to the next whole number."],
      ],
    },
  ]),
);
