/**
 * @statement Y6-STA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-STA-01.a: Interpret and construct pie charts
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-STA-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y6-STA-01.a" }, [
    {
      statement: "A pie chart shows 60 people. Zoe says a sector of 90° stands for 15 people.",
      truth: true,
      right: "True. 90° is a quarter of 360°, and a quarter of 60 is 15.",
      wrong: [
        ["False. It stands for 90 people.", "STA.PIE.ANGLE-AS-COUNT"],
        ["False. It stands for 25 people."],
      ],
    },
    {
      claim: "The angles of a pie chart add up to 360°.",
      truth: "always",
      right: "Always. The sectors make a whole circle.",
      wrong: [
        ["Sometimes. Only if 360 people were asked.", "STA.PIE.ANGLE-AS-COUNT"],
        ["Never. They add to 100°."],
      ],
    },
    {
      statement:
        "In a pie chart of 36 pupils, each pupil is 10°. Max says a sector of 50° stands for 50 pupils.",
      truth: false,
      right: "False. Each pupil is 10°, so 50° stands for 5 pupils.",
      wrong: [
        ["True. The angle is the number of pupils.", "STA.PIE.ANGLE-AS-COUNT"],
        ["True. 50° is about half."],
      ],
    },
  ]),
);
