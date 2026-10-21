/**
 * @statement Y5-MD-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-09: Solve problems involving all four operations, including factors, multiples, squares,
// cubes, scaling by simple fractions and simple rates
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y5-MD-09",
    { friendly: [3, 9], standard: [4, 12], stretch: [6, 15] },
    { friendly: [12, 50], standard: [25, 150], stretch: [100, 999] },
    ["rate", "scale"],
  ),
);
