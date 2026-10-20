/**
 * @statement Y3-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-01: Count from 0 in multiples of 4, 8, 50 and 100; find 10 or 100 more or less than a
// number
import { defineGenerator } from "@mathsplanner/core";
import { countInSteps, mixFamilies, moreOrLess } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y3-NPV-01", {
    1: countInSteps("Y3-NPV-01", {
      friendly: [50, 100],
      standard: [4, 8, 50, 100],
      stretch: [4, 8],
    }),
    2: moreOrLess(
      "Y3-NPV-01",
      { friendly: [100, 899], standard: [100, 899], stretch: [100, 989] },
      { friendly: [10], standard: [10, 100], stretch: [10, 100] },
    ),
    4: countInSteps("Y3-NPV-01", {
      friendly: [50, 100],
      standard: [4, 8, 50, 100],
      stretch: [4, 8],
    }),
  }),
);
