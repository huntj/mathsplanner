/**
 * @statement Y3-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.a: Recall and use the 3 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y3-MD-01.a",
    { friendly: [3], standard: [3], stretch: [3] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
