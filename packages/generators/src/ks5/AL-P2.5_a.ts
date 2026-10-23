/**
 * @statement AL-P2.5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.5.a: Solve linear and quadratic inequalities
import { defineGenerator } from "@mathsplanner/core";
import parent from "./AL-P2.5.ts";

export default defineGenerator({ ...parent.definition, id: "AL-P2.5.a", depths: [1, 4] });
