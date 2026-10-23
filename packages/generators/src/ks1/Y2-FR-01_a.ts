/**
 * @statement Y2-FR-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.a: Find ½ and ¼ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y2-FR-01.a",
    {
      friendly: [
        [1, 2],
        [1, 4],
      ],
      standard: [
        [1, 2],
        [1, 4],
      ],
      stretch: [
        [1, 2],
        [1, 4],
      ],
    },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
