/**
 * @statement Y4-MD-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.c: Recall the 11 and 12 times tables
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y4-MD-01.c",
    { friendly: [11, 12], standard: [11, 12], stretch: [11, 12] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
