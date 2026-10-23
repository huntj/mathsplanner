/**
 * @statement Y2-AS-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-02.d: Add three 1-digit numbers
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y2-AS-02.d",
    { friendly: [11, 49], standard: [21, 89], stretch: [21, 89] },
    { friendly: [{ kind: "three" }], standard: [{ kind: "three" }], stretch: [{ kind: "three" }] },
    10,
  ),
);
