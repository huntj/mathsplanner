/**
 * @statement Y2-FR-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-FR-02.b: Recognise that 2/4 and ½ are equivalent
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-FR-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-FR-02.b", depths: [3, 4] });
