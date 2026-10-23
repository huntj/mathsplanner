/**
 * @statement Y2-AS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-AS-01.b: Derive related facts up to 100, e.g. 30 + 70 from 3 + 7
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-AS-01.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-AS-01.b" });
