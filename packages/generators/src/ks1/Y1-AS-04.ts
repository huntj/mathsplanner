/**
 * @statement Y1-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-AS-04: Solve one-step problems involving addition and subtraction, including missing number
// problems like 7 = ? − 9
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers, problems } from "../shared/as.ts";
import { mixFamilies } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y1-AS-04", {
    1: problems(
      "Y1-AS-04",
      { friendly: [5, 10], standard: [6, 15], stretch: [10, 19] },
      { friendly: [1, 5], standard: [2, 8], stretch: [3, 9] },
      2,
    ),
    2: missingNumbers(
      "Y1-AS-04",
      { friendly: [2, 9], standard: [3, 10], stretch: [5, 10] },
      [0, 1, 2, 3, 4],
    ),
    4: missingNumbers(
      "Y1-AS-04",
      { friendly: [2, 9], standard: [3, 10], stretch: [5, 10] },
      [0, 1, 2, 3, 4],
    ),
  }),
);
