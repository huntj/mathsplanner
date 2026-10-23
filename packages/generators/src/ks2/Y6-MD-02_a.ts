/**
 * @statement Y6-MD-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-02.a: Divide using long division with whole-number remainders
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-MD-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-MD-02.a", depths: [1, 4] });
