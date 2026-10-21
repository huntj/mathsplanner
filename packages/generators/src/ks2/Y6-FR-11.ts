/**
 * @statement Y6-FR-11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-11: Recall and use equivalences between simple fractions, decimals and percentages,
// including in different contexts
import { defineGenerator } from "@mathsplanner/core";
import { percentages } from "../shared/fr.ts";

export default defineGenerator(
  percentages(
    "Y6-FR-11",
    { friendly: [2, 4, 5, 10], standard: [4, 5, 10, 20, 25], stretch: [5, 20, 25, 50] },
    true,
  ),
);
