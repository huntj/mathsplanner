/**
 * @statement Y6-FR-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-07.b: Multiply and divide by 10, 100 and 1000 giving up to three decimal places
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-FR-07.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-FR-07.b", depths: [1, 4] });
