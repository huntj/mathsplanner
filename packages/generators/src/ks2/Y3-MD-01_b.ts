/**
 * @statement Y3-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.b: Recall and use the 4 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y3-MD-01.b",
    { friendly: [4], standard: [4], stretch: [4] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
