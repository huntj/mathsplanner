/**
 * @statement Y3-MD-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MD-02: Write and calculate statements for multiplication and division, including 2-digit ×
// 1-digit, using mental and progressing to formal written methods
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y3-MD-02",
    { friendly: [2, 1], standard: [2, 1], stretch: [2, 1] },
    { friendly: 1, standard: 1, stretch: 1 },
  ),
);
