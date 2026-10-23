/**
 * @statement Y3-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-NPV-01.c: Find 10 or 100 more or less than a number
import { defineGenerator } from "@mathsplanner/core";
import { moreOrLess } from "../shared/npv.ts";

export default defineGenerator(
  moreOrLess(
    "Y3-NPV-01.c",
    { friendly: [100, 899], standard: [100, 899], stretch: [100, 989] },
    { friendly: [10], standard: [10, 100], stretch: [10, 100] },
  ),
);
