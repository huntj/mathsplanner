/**
 * @statement Y5-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-AS-01: Add and subtract whole numbers with more than 4 digits, including formal written
// methods
import { defineGenerator } from "@mathsplanner/core";
import { columnMethod } from "../shared/as.ts";

export default defineGenerator(
  columnMethod(
    "Y5-AS-01",
    { friendly: [5, 4], standard: [5, 5], stretch: [6, 5] },
    { friendly: 1, standard: 2, stretch: 3 },
  ),
);
