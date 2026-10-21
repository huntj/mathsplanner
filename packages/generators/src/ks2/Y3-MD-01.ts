/**
 * @statement Y3-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MD-01: Recall and use multiplication and division facts for the 3, 4 and 8 times tables
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y3-MD-01",
    { friendly: [3, 4], standard: [3, 4, 8], stretch: [3, 4, 8] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
