/**
 * @statement Y4-FR-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-03.a: Find unit fractions of amounts
import { defineGenerator } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

export default defineGenerator(
  fractionOfAmount(
    "Y4-FR-03.a",
    { friendly: [3, 4, 5], standard: [3, 4, 5, 6, 8, 10], stretch: [6, 7, 8, 9, 10, 12] },
    { friendly: false, standard: false, stretch: false },
    { friendly: 10, standard: 12, stretch: 25 },
  ),
);
