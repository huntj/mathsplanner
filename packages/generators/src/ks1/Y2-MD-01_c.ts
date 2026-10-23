/**
 * @statement Y2-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MD-01.c: Recall and use the 10 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y2-MD-01.c",
    { friendly: [10], standard: [10], stretch: [10] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
