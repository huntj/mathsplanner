/**
 * @statement Y6-FR-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-03.b: Add and subtract mixed numbers
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y6-FR-03.b",
    "mixed",
    { friendly: [2, 3, 4], standard: [3, 4, 5, 6], stretch: [4, 5, 6, 8] },
    false,
    "simplest",
  ),
);
