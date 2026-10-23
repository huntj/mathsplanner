/**
 * @statement Y2-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-04.a: Compare numbers up to 100 using <, > and =
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-NPV-04.ts";

export default defineGenerator({ ...parent.definition, id: "Y2-NPV-04.a", depths: [1, 4] });
