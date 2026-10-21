/**
 * @statement Y4-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-02: Count up and down in hundredths; recognise that hundredths arise when dividing an
// object by 100 and tenths by 10
import { defineGenerator } from "@mathsplanner/core";
import { countParts } from "../shared/fr.ts";

export default defineGenerator(
  countParts("Y4-FR-02", 100, { friendly: false, standard: false, stretch: false }),
);
