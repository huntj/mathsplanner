/**
 * @statement Y3-AS-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-AS-01.c: Add and subtract hundreds to a 3-digit number mentally
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y3-AS-01.c",
    { friendly: [101, 499], standard: [101, 899], stretch: [101, 899] },
    {
      friendly: [{ kind: "place", place: 100 }],
      standard: [{ kind: "place", place: 100 }],
      stretch: [{ kind: "place", place: 100 }],
    },
    100,
  ),
);
