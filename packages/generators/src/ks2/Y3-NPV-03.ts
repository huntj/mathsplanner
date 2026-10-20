/**
 * @statement Y3-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-NPV-03: Compare and order numbers up to 1000
import { defineGenerator } from "@mathsplanner/core";
import { compareNumbers } from "../shared/npv.ts";

export default defineGenerator(
  compareNumbers("Y3-NPV-03", { friendly: [100, 999], standard: [100, 999], stretch: [100, 999] }),
);
