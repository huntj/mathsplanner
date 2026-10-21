/**
 * @statement Y2-AS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-02: Add and subtract numbers using objects, pictures and mentally: a 2-digit number and
// ones; a 2-digit number and tens; two 2-digit numbers; three 1-digit numbers
import { defineGenerator } from "@mathsplanner/core";
import { mental } from "../shared/as.ts";

export default defineGenerator(
  mental(
    "Y2-AS-02",
    { friendly: [11, 49], standard: [21, 89], stretch: [21, 89] },
    {
      friendly: [{ kind: "place", place: 1 }, { kind: "place", place: 10 }, { kind: "three" }],
      standard: [
        { kind: "place", place: 1 },
        { kind: "place", place: 10 },
        { kind: "pair" },
        { kind: "three" },
      ],
      stretch: [{ kind: "place", place: 10 }, { kind: "pair" }, { kind: "three" }],
    },
    10,
  ),
);
