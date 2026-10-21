/**
 * @statement Y3-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-02: Recognise, find and write fractions of a discrete set of objects: unit fractions and
// non-unit fractions with small denominators
import { defineGenerator } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

export default defineGenerator(
  fractionOfAmount(
    "Y3-FR-02",
    { friendly: [2, 3, 4], standard: [2, 3, 4, 5, 8], stretch: [3, 4, 5, 6, 8] },
    { friendly: false, standard: true, stretch: true },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
