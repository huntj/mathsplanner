/**
 * @statement Y3-MD-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-03.b: Solve integer scaling problems
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y3-MD-03.b",
    { friendly: [2, 4], standard: [2, 8], stretch: [3, 9] },
    { friendly: [2, 5], standard: [3, 12], stretch: [6, 15] },
    ["scale"],
  ),
);
