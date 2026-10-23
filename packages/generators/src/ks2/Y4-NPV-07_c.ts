/**
 * @statement Y4-NPV-07.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-NPV-07.c: Round to the nearest 1000
import { defineGenerator } from "@mathsplanner/core";
import { rounding } from "../shared/npv.ts";

export default defineGenerator(
  rounding(
    "Y4-NPV-07.c",
    { friendly: [1001, 9999], standard: [1001, 9999], stretch: [1001, 9999] },
    { friendly: [1000], standard: [1000], stretch: [1000] },
  ),
);
