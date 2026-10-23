/**
 * @statement Y4-MD-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-01.a: Recall the 6 and 9 times tables
import { defineGenerator } from "@mathsplanner/core";
import { timesTables } from "../shared/md.ts";

export default defineGenerator(
  timesTables(
    "Y4-MD-01.a",
    { friendly: [6, 9], standard: [6, 9], stretch: [6, 9] },
    { friendly: 10, standard: 12, stretch: 12 },
  ),
);
