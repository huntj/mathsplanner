/**
 * @statement Y5-MD-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-06.b: Interpret remainders in context
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator({
  ...division(
    "Y5-MD-06.b",
    { friendly: [2, 5], standard: [3, 9], stretch: [6, 9] },
    { friendly: 3, standard: 4, stretch: 4 },
    false,
  ),
  depths: [2, 5],
});
