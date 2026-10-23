/**
 * @statement Y6-MD-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-02.b: Interpret remainders as fractions or decimals
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y6-MD-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y6-MD-02.b", depths: [2, 4] });
