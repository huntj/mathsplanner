/**
 * @statement Y6-FR-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-03.a: Add and subtract fractions with different denominators
import { defineGenerator } from "@mathsplanner/core";
import { addFractions } from "../shared/fr.ts";

export default defineGenerator(
  addFractions(
    "Y6-FR-03.a",
    "different",
    { friendly: [2, 3, 4, 5], standard: [3, 4, 5, 6, 7], stretch: [4, 5, 6, 7, 8, 9] },
    false,
    "simplest",
  ),
);
