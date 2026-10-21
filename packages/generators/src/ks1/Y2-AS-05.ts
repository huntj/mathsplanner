/**
 * @statement Y2-AS-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-05: Solve problems with addition and subtraction using concrete objects, pictures,
// quantities and measures
import { defineGenerator } from "@mathsplanner/core";
import { problems } from "../shared/as.ts";

export default defineGenerator(
  problems(
    "Y2-AS-05",
    { friendly: [10, 30], standard: [20, 60], stretch: [30, 99] },
    { friendly: [2, 9], standard: [3, 19], stretch: [11, 39] },
    2,
  ),
);
