/**
 * @statement Y5-MD-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-04.a: Multiply up to 4 digits by a one-digit number
import { defineGenerator } from "@mathsplanner/core";
import { writtenMultiply } from "../shared/md.ts";

export default defineGenerator(
  writtenMultiply(
    "Y5-MD-04.a",
    { friendly: [3, 1], standard: [4, 1], stretch: [4, 1] },
    { friendly: 1, standard: 1, stretch: 2 },
  ),
);
