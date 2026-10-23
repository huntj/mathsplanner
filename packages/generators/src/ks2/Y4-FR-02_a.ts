/**
 * @statement Y4-FR-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-02.a: Count up and down in hundredths
import { defineGenerator } from "@mathsplanner/core";
import { countParts } from "../shared/fr.ts";

export default defineGenerator(
  countParts("Y4-FR-02.a", 100, { friendly: false, standard: false, stretch: false }),
);
