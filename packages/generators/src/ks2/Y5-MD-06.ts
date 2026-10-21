/**
 * @statement Y5-MD-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-06: Divide numbers up to 4 digits by a one-digit number using short division and interpret
// remainders in context
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator(
  division(
    "Y5-MD-06",
    { friendly: [2, 5], standard: [3, 9], stretch: [6, 9] },
    { friendly: 3, standard: 4, stretch: 4 },
    false,
  ),
);
