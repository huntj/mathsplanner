/**
 * @statement Y4-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-AS-01: Add and subtract numbers with up to 4 digits using formal written columnar methods
import { defineGenerator } from "@mathsplanner/core";
import { columnMethod } from "../shared/as.ts";

export default defineGenerator(
  columnMethod(
    "Y4-AS-01",
    { friendly: [4, 3], standard: [4, 4], stretch: [4, 4] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
