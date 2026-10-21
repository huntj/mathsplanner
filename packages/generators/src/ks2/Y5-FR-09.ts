/**
 * @statement Y5-FR-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-09: Read, write, order and compare numbers with up to three decimal places
import { defineGenerator } from "@mathsplanner/core";
import { compareDecimals } from "../shared/fr.ts";

export default defineGenerator(
  compareDecimals("Y5-FR-09", { friendly: 2, standard: 3, stretch: 3 }, true),
);
