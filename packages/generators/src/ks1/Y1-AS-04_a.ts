/**
 * @statement Y1-AS-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-04.a: Solve one-step addition and subtraction problems
import { defineGenerator } from "@mathsplanner/core";
import { problems } from "../shared/as.ts";

export default defineGenerator(
  problems(
    "Y1-AS-04.a",
    { friendly: [5, 10], standard: [6, 15], stretch: [10, 19] },
    { friendly: [1, 5], standard: [2, 8], stretch: [3, 9] },
    2,
  ),
);
