/**
 * @statement Y3-GEO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-GEO-01.b: Recognise and describe 3D shapes in different orientations
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-GEO-01.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims({ ...parent.definition, id: "Y3-GEO-01.b" }, [
    {
      statement: "Ana says a cube has 6 faces.",
      truth: true,
      right: "True. Top, bottom and four sides: 6 square faces.",
      wrong: [
        ["False. It has 3 faces, the ones you can see.", "GEO.SOLIDS.VISIBLE-ONLY"],
        ["False. It has 4 faces."],
      ],
    },
    {
      claim: "A sphere has flat faces.",
      truth: "never",
      right: "Never. A sphere is round all over, like a ball.",
      wrong: [
        ["Always. Every 3D shape has flat faces.", "GEO.SOLIDS.FACES-EDGES"],
        ["Sometimes. When it is big."],
      ],
    },
    {
      statement: "Raj counts the faces of a cuboid in a picture and says it has 3.",
      truth: false,
      right: "False. You can only see 3, but a cuboid has 6 faces: 3 are hidden.",
      wrong: [
        ["True. Count the faces you can see.", "GEO.SOLIDS.VISIBLE-ONLY"],
        ["True. A cuboid has 3 faces."],
      ],
    },
  ]),
);
