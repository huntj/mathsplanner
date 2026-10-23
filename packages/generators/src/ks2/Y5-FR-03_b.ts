/**
 * @statement Y5-FR-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-03.b: Convert mixed numbers to improper fractions
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y5-FR-03.ts";

export default defineGenerator({ ...parent.definition, id: "Y5-FR-03.b", depths: [1, 4] });
