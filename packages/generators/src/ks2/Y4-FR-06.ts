/**
 * @statement Y4-FR-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-06: Recognise and write decimal equivalents to ¼, ½ and ¾
import { defineGenerator } from "@mathsplanner/core";
import { fractionDecimal } from "../shared/fr.ts";

export default defineGenerator(
  fractionDecimal("Y4-FR-06", { friendly: [2, 4], standard: [2, 4], stretch: [2, 4] }, true),
);
