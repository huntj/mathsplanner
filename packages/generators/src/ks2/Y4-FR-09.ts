/**
 * @statement Y4-FR-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-09: Compare numbers with the same number of decimal places up to two decimal places
import { defineGenerator } from "@mathsplanner/core";
import { compareDecimals } from "../shared/fr.ts";

export default defineGenerator(
  compareDecimals("Y4-FR-09", { friendly: 1, standard: 2, stretch: 2 }, false),
);
