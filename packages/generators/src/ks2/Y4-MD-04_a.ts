/**
 * @statement Y4-MD-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-04.a: Multiply a two-digit number by a one-digit number using the formal written layout
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y4-MD-04.a",
    { friendly: [2, 1], standard: [2, 1], stretch: [2, 1] },
    { friendly: 1, standard: 1, stretch: 1 },
  ),
);
