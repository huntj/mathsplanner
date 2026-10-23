/**
 * @statement Y2-FR-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.c: Find 2/4 and ¾ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y2-FR-01.c",
    {
      friendly: [[3, 4]],
      standard: [
        [2, 4],
        [3, 4],
      ],
      stretch: [
        [2, 4],
        [3, 4],
      ],
    },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
