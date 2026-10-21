/**
 * @statement Y5-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-AS-04: Solve multi-step addition and subtraction problems, deciding which operations and
// methods to use
import { defineGenerator } from "@mathsplanner/core";
import { problems } from "../shared/as.ts";

export default defineGenerator(
  problems(
    "Y5-AS-04",
    { friendly: [1000, 9999], standard: [10000, 99999], stretch: [50000, 999999] },
    { friendly: [100, 999], standard: [1000, 9999], stretch: [5000, 99999] },
    3,
  ),
);
