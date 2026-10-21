/**
 * @statement Y2-AS-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-04: Recognise and use the inverse relationship between addition and subtraction to check
// and solve missing number problems
import { defineGenerator } from "@mathsplanner/core";
import { missingNumbers } from "../shared/as.ts";

export default defineGenerator(
  missingNumbers("Y2-AS-04", { friendly: [5, 30], standard: [11, 49], stretch: [21, 79] }),
);
