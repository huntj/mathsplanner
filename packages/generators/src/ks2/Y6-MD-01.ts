/**
 * @statement Y6-MD-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-01: Multiply multi-digit numbers up to 4 digits by a two-digit whole number using long
// multiplication
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y6-MD-01",
    { friendly: [3, 2], standard: [4, 2], stretch: [4, 2] },
    { friendly: 1, standard: 1, stretch: 1 },
  ),
);
