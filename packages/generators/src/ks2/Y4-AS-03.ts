/**
 * @statement Y4-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-AS-03: Solve addition and subtraction two-step problems, deciding which operations and methods
// to use and why
import { defineGenerator } from "@mathsplanner/core";
import { problems } from "../shared/as.ts";

export default defineGenerator(
  problems(
    "Y4-AS-03",
    { friendly: [200, 999], standard: [1000, 4999], stretch: [2000, 9999] },
    { friendly: [20, 199], standard: [100, 999], stretch: [300, 2999] },
    2,
  ),
);
