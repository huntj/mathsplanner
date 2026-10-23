/**
 * @statement Y2-FR-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-02.a: Write simple fractions of amounts, e.g. ½ of 6 = 3
import { defineGenerator } from "@mathsplanner/core";
import { fractionOfAmount } from "../shared/fr.ts";

export default defineGenerator(
  fractionOfAmount(
    "Y2-FR-02.a",
    { friendly: [2], standard: [2, 4], stretch: [2, 3, 4] },
    { friendly: false, standard: false, stretch: true },
    { friendly: 5, standard: 6, stretch: 10 },
  ),
);
