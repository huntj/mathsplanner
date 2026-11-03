/**
 * @statement Y4-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-GEO-02.b: Compare and order angles up to two right angles
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-GEO-02.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y4-GEO-02.b", depths: [3, 4] }, [
    {
      claim: "An obtuse angle is bigger than a right angle.",
      truth: "always",
      right: "Always. An obtuse angle is between 90° and 180°.",
      wrong: [
        ["Never. Obtuse angles are smaller.", "GEO.ANGLES.TYPE-CONFUSED"],
        ["Sometimes. If its arms are long.", "GEO.ANGLES.SIZE-BY-ARMS"],
      ],
    },
    {
      claim: "An angle with longer arms is bigger.",
      truth: "never",
      right: "Never. The size of an angle is the turn between its arms, not their length.",
      wrong: [
        ["Always. Longer arms mean a bigger angle.", "GEO.ANGLES.SIZE-BY-ARMS"],
        ["Sometimes. For obtuse angles."],
      ],
    },
    {
      statement: "Mia says an acute angle is smaller than a right angle.",
      truth: true,
      right: "True. An acute angle is less than 90°.",
      wrong: [
        ["False. Acute angles are bigger.", "GEO.ANGLES.TYPE-CONFUSED"],
        ["False. Acute means exactly a right angle."],
      ],
    },
  ]),
);
