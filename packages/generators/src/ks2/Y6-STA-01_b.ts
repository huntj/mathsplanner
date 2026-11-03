/**
 * @statement Y6-STA-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-STA-01.b: Interpret and construct line graphs
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-STA-01_b.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-STA-01.b" }, [
    {
      statement:
        "On a line graph of a plant's height, the line goes up steeply between week 2 and week 3. Amy says the plant grew fastest then.",
      truth: true,
      right: "True. The steeper the line, the faster the height changed.",
      wrong: [
        ["False. The highest point shows the fastest growth.", "STA.SCALE.READ"],
        ["False. Line graphs cannot show speed."],
      ],
    },
    {
      statement:
        "The y-axis of a line graph goes up in steps of 5. Gus reads a point halfway between 20 and 25 as 21.",
      truth: false,
      right: "False. Halfway between 20 and 25 is 22.5.",
      wrong: [
        ["True. Each small step is 1.", "STA.SCALE.READ"],
        ["True. Always read the next whole number."],
      ],
    },
    {
      claim: "A line graph is a good way to show how something changes over time.",
      truth: "always",
      right: "Always. Time goes along the bottom, and the line shows the rise and fall.",
      wrong: [
        ["Never. Use a pie chart for time.", "STA.SCALE.READ"],
        ["Sometimes. Only for temperatures."],
      ],
    },
  ]),
);
