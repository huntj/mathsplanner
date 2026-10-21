/**
 * @statement Y1-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-FR-02: Recognise, find and name a quarter as one of four equal parts
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y1-FR-02",
    {
      friendly: [[1, 4]],
      standard: [
        [1, 4],
        [1, 2],
      ],
      stretch: [
        [1, 4],
        [1, 2],
      ],
    },
    { friendly: 3, standard: 5, stretch: 10 },
  ),
);
