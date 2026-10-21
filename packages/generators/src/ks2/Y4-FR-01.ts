/**
 * @statement Y4-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-01: Recognise and show, using diagrams, families of common equivalent fractions
import { defineGenerator } from "@mathsplanner/core";
import { equivalents } from "../shared/fr.ts";

export default defineGenerator(
  equivalents(
    "Y4-FR-01",
    { friendly: [2, 3, 4, 5], standard: [3, 4, 5, 6, 8], stretch: [5, 6, 7, 8, 9] },
    { friendly: 3, standard: 5, stretch: 6 },
  ),
);
