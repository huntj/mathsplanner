/**
 * @statement Y2-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-FR-01: Recognise, find, name and write ⅓, ¼, 2/4 and ¾ of a length, shape, set of objects or
// quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y2-FR-01",
    {
      friendly: [
        [1, 3],
        [1, 4],
      ],
      standard: [
        [1, 3],
        [1, 4],
        [3, 4],
      ],
      stretch: [
        [1, 3],
        [2, 4],
        [3, 4],
        [2, 3],
      ],
    },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
