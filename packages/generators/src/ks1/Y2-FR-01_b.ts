/**
 * @statement Y2-FR-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-01.b: Find ⅓ of a shape, length or quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y2-FR-01.b",
    { friendly: [[1, 3]], standard: [[1, 3]], stretch: [[1, 3]] },
    { friendly: 5, standard: 10, stretch: 12 },
  ),
);
