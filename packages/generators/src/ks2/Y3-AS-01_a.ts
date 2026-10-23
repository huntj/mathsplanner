/**
 * @statement Y3-AS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-01.a: Add and subtract ones to a 3-digit number mentally
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y3-AS-01.a",
    { friendly: [101, 499], standard: [101, 899], stretch: [101, 899] },
    {
      friendly: [{ kind: "place", place: 1 }],
      standard: [{ kind: "place", place: 1 }],
      stretch: [{ kind: "place", place: 1 }],
    },
    100,
  ),
);
