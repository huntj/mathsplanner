/**
 * @statement Y4-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MD-01: Recall multiplication and division facts for multiplication tables up to 12 × 12
// (assessed by the MTC)
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y4-MD-01",
    { friendly: [6, 7, 9], standard: [6, 7, 8, 9, 11, 12], stretch: [7, 8, 9, 11, 12] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
