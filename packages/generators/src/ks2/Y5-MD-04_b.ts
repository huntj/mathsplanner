/**
 * @statement Y5-MD-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-04.b: Multiply by a two-digit number using long multiplication
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y5-MD-04.b",
    { friendly: [2, 2], standard: [2, 2], stretch: [3, 2] },
    { friendly: 1, standard: 1, stretch: 1 },
  ),
);
