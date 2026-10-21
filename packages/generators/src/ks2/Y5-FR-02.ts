/**
 * @statement Y5-FR-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-02: Identify, name and write equivalent fractions of a given fraction, including tenths and
// hundredths
import { defineGenerator } from "@mathsplanner/core";
import { equivalents } from "../shared/fr.ts";

export default defineGenerator(
  equivalents(
    "Y5-FR-02",
    { friendly: [2, 4, 5, 10], standard: [4, 5, 10, 20, 25], stretch: [5, 10, 20, 25, 50] },
    { friendly: 5, standard: 10, stretch: 10 },
  ),
);
