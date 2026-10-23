/**
 * @statement Y4-MD-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-04.b: Multiply a three-digit number by a one-digit number using the formal written layout
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y4-MD-04.b",
    { friendly: [3, 1], standard: [3, 1], stretch: [3, 1] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
