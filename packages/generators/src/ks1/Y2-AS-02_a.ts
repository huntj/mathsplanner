/**
 * @statement Y2-AS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-02.a: Add and subtract a 2-digit number and ones
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y2-AS-02.a",
    { friendly: [11, 49], standard: [21, 89], stretch: [21, 89] },
    {
      friendly: [{ kind: "place", place: 1 }],
      standard: [{ kind: "place", place: 1 }],
      stretch: [{ kind: "place", place: 1 }],
    },
    10,
  ),
);
