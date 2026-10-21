/**
 * @statement Y2-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MD-01: Recall and use multiplication and division facts for the 2, 5 and 10 times tables,
// including odd and even numbers
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y2-MD-01",
    { friendly: [2, 10], standard: [2, 5, 10], stretch: [2, 5, 10] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
