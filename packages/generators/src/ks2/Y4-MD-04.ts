/**
 * @statement Y4-MD-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MD-04: Multiply two-digit and three-digit numbers by a one-digit number using formal written
// layout
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y4-MD-04",
    { friendly: [2, 1], standard: [3, 1], stretch: [3, 1] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
