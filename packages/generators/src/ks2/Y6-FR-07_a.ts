/**
 * @statement Y6-FR-07.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-FR-07.a: Find the value of each digit in numbers with three decimal places
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./Y6-FR-07.ts";
import places from "./Y5-FR-09_a.ts";

const read = { ...places.definition, id: "Y6-FR-07.a" };

export default defineGenerator(
  mixFamilies("Y6-FR-07.a", { 1: read, 2: { ...parent.definition, id: "Y6-FR-07.a" }, 4: read }),
);
