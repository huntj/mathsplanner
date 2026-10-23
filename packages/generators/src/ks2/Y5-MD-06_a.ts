/**
 * @statement Y5-MD-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-06.a: Divide up to 4 digits by a one-digit number using short division
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator({
  ...division(
    "Y5-MD-06.a",
    { friendly: [2, 5], standard: [3, 9], stretch: [6, 9] },
    { friendly: 3, standard: 4, stretch: 4 },
    false,
  ),
  depths: [1, 4],
});
