/**
 * @statement Y3-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-AS-04: Solve problems, including missing number problems, using number facts, place value and
// more complex addition and subtraction
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";

export default defineGenerator(
  missingNumbers("Y3-AS-04", { friendly: [50, 300], standard: [101, 500], stretch: [101, 999] }),
);
