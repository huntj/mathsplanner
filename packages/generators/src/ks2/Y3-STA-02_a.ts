/**
 * @statement Y3-STA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-STA-02.a: Answer one-step questions from charts and tables
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y3-STA-02.ts";

export default defineGenerator({ ...parent.definition, id: "Y3-STA-02.a", depths: [1, 2] });
