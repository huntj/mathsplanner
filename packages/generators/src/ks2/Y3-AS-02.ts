/**
 * @statement Y3-AS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-AS-02: Add and subtract numbers with up to three digits using formal written columnar methods
import { defineGenerator } from "@mathsplanner/core";
import { columnMethod } from "../shared/as.ts";

export default defineGenerator(
  columnMethod(
    "Y3-AS-02",
    { friendly: [3, 2], standard: [3, 3], stretch: [3, 3] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
