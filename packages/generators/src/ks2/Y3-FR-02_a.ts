/**
 * @statement Y3-FR-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-FR-02.a: Find unit fractions of a set of objects
import { defineGenerator } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

export default defineGenerator(
  fractionOfAmount(
    "Y3-FR-02.a",
    { friendly: [2, 3, 4], standard: [2, 3, 4, 5, 8], stretch: [3, 4, 5, 6, 8] },
    { friendly: false, standard: false, stretch: false },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
