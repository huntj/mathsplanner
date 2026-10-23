/**
 * @statement Y3-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-01.c: Recall and use the 8 times table
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y3-MD-01.c",
    { friendly: [8], standard: [8], stretch: [8] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
