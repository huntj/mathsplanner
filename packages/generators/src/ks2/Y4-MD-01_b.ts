/**
 * @statement Y4-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.b: Recall the 7 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y4-MD-01.b",
    { friendly: [7], standard: [7], stretch: [7] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
