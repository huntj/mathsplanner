/**
 * @statement Y6-MD-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-03: Divide numbers up to 4 digits by a two-digit number using short division where
// appropriate
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator(
  division(
    "Y6-MD-03",
    { friendly: [11, 12], standard: [11, 19], stretch: [13, 25] },
    { friendly: 3, standard: 3, stretch: 4 },
    false,
  ),
);
