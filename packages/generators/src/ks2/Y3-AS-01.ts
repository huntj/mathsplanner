/**
 * @statement Y3-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-AS-01: Add and subtract mentally: a 3-digit number and ones, tens, or hundreds
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y3-AS-01",
    { friendly: [101, 499], standard: [101, 899], stretch: [101, 899] },
    {
      friendly: [
        { kind: "place", place: 1 },
        { kind: "place", place: 10 },
        { kind: "place", place: 100 },
      ],
      standard: [
        { kind: "place", place: 1 },
        { kind: "place", place: 10 },
        { kind: "place", place: 100 },
      ],
      stretch: [
        { kind: "place", place: 10 },
        { kind: "place", place: 100 },
      ],
    },
    100,
  ),
);
