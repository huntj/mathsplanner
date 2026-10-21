/**
 * @statement Y1-FR-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-FR-01: Recognise, find and name a half as one of two equal parts of an object, shape or
// quantity
import { defineGenerator } from "@mathsplanner/core";
import { namedFraction } from "../shared/fr.ts";

export default defineGenerator(
  namedFraction(
    "Y1-FR-01",
    { friendly: [[1, 2]], standard: [[1, 2]], stretch: [[1, 2]] },
    { friendly: 5, standard: 10, stretch: 20 },
  ),
);
