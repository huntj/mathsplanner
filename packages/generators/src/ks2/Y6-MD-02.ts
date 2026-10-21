/**
 * @statement Y6-MD-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-02: Divide numbers up to 4 digits by a two-digit whole number using long division,
// interpreting remainders as whole numbers, fractions or by rounding
import { defineGenerator } from "@mathsplanner/core";
import { division } from "../shared/md.ts";

export default defineGenerator(
  division(
    "Y6-MD-02",
    { friendly: [11, 15], standard: [12, 35], stretch: [21, 79] },
    { friendly: 3, standard: 4, stretch: 4 },
    true,
  ),
);
