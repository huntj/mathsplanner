/**
 * @statement Y5-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-01: Identify multiples and factors, including all factor pairs and common factors of two
// numbers
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";

export default defineGenerator(
  factorsFamily("Y5-MD-01", { friendly: 50, standard: 72, stretch: 100 }, true),
);
