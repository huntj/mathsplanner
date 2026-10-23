/**
 * @statement Y2-POS-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-POS-02.b: Describe quarter, half and three-quarter turns
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-POS-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-POS-02.b", depths: [2, 3] });
