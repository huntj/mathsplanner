/**
 * @statement Y6-FR-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-01.a: Simplify fractions using common factors
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-FR-01.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-FR-01.a", depths: [1, 4] });
