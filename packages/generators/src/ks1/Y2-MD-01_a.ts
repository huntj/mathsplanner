/**
 * @statement Y2-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.a: Recall and use the 2 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y2-MD-01.a",
    { friendly: [2], standard: [2], stretch: [2] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
