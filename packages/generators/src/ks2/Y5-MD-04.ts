/**
 * @statement Y5-MD-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-04: Multiply numbers up to 4 digits by a one- or two-digit number using a formal written
// method, including long multiplication for 2-digit numbers
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y5-MD-04",
    { friendly: [3, 1], standard: [2, 2], stretch: [3, 2] },
    { friendly: 1, standard: 1, stretch: 1 },
  ),
);
