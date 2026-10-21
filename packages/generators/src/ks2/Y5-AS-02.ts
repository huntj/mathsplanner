/**
 * @statement Y5-AS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-AS-02: Add and subtract numbers mentally with increasingly large numbers
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y5-AS-02",
    { friendly: [1001, 9999], standard: [10001, 99999], stretch: [100001, 999999] },
    {
      friendly: [
        { kind: "place", place: 100 },
        { kind: "place", place: 1000 },
      ],
      standard: [
        { kind: "place", place: 100 },
        { kind: "place", place: 1000 },
        { kind: "place", place: 10000 },
      ],
      stretch: [
        { kind: "place", place: 1000 },
        { kind: "place", place: 10000 },
        { kind: "place", place: 100000 },
      ],
    },
    1000,
  ),
);
