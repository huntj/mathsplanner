/**
 * @statement Y1-AS-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-04.b: Solve missing number problems such as 7 = ? − 9
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";

export default defineGenerator(
  missingNumbers(
    "Y1-AS-04.b",
    { friendly: [2, 9], standard: [3, 10], stretch: [5, 10] },
    [0, 1, 2, 3, 4],
  ),
);
