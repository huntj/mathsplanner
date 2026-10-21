/**
 * @statement Y3-FR-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-04: Recognise and show, using diagrams, equivalent fractions with small denominators
import { defineGenerator } from "@mathsplanner/core";
import { equivalents } from "../shared/fr.ts";

export default defineGenerator(
  equivalents(
    "Y3-FR-04",
    { friendly: [2, 3, 4], standard: [2, 3, 4, 5], stretch: [3, 4, 5, 6] },
    { friendly: 2, standard: 3, stretch: 4 },
  ),
);
