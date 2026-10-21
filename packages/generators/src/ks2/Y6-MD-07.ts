/**
 * @statement Y6-MD-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-07: Solve problems involving addition, subtraction, multiplication and division
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y6-MD-07",
    { friendly: [4, 12], standard: [12, 40], stretch: [15, 60] },
    { friendly: [25, 150], standard: [100, 999], stretch: [150, 2500] },
    ["groups", "scale", "correspond", "rate"],
  ),
);
