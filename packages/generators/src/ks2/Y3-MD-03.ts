/**
 * @statement Y3-MD-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MD-03: Solve problems, including missing number, integer scaling and correspondence problems
// (n objects connected to m objects)
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y3-MD-03",
    { friendly: [2, 4], standard: [2, 8], stretch: [3, 9] },
    { friendly: [2, 5], standard: [3, 12], stretch: [6, 15] },
    ["scale", "correspond"],
  ),
);
