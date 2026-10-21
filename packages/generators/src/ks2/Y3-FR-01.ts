/**
 * @statement Y3-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-01: Count up and down in tenths; recognise that tenths arise from dividing an object into
// 10 equal parts and in dividing 1-digit numbers or quantities by 10
import { defineGenerator } from "@mathsplanner/core";
import { countParts } from "../shared/fr.ts";

export default defineGenerator(
  countParts("Y3-FR-01", 10, { friendly: true, standard: true, stretch: false }),
);
