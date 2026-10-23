/**
 * @statement Y2-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.b: Recall and use the 5 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y2-MD-01.b",
    { friendly: [5], standard: [5], stretch: [5] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
