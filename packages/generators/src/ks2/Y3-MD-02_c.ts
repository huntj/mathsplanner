/**
 * @statement Y3-MD-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-02.c: Divide a 2-digit number by a 1-digit number
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator({
  ...division(
    "Y3-MD-02.c",
    { friendly: [2, 5], standard: [2, 9], stretch: [3, 9] },
    { friendly: 2, standard: 2, stretch: 2 },
    false,
  ),
  depths: [1, 4],
});
