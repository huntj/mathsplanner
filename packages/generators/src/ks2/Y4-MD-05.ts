/**
 * @statement Y4-MD-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MD-05: Solve problems involving multiplying and adding, including the distributive law and
// harder correspondence problems
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y4-MD-05",
    { friendly: [3, 6], standard: [3, 9], stretch: [4, 12] },
    { friendly: [11, 25], standard: [12, 60], stretch: [25, 150] },
    ["correspond", "groups"],
  ),
);
