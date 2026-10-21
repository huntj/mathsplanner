/**
 * @statement Y2-MD-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MD-04: Solve multiplication and division problems using materials, arrays, repeated addition,
// mental methods and facts, including in context
import { defineGenerator } from "@mathsplanner/core";
import { mdProblems } from "../shared/md.ts";

export default defineGenerator(
  mdProblems(
    "Y2-MD-04",
    { friendly: [2, 5], standard: [2, 10], stretch: [3, 12] },
    { friendly: [2, 5], standard: [2, 10], stretch: [2, 10] },
    ["groups", "scale"],
  ),
);
