/**
 * @statement Y4-MD-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-05.b: Solve harder correspondence problems
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y4-MD-05.b",
    { friendly: [3, 6], standard: [3, 9], stretch: [4, 12] },
    { friendly: [11, 25], standard: [12, 60], stretch: [25, 150] },
    ["correspond"],
  ),
);
