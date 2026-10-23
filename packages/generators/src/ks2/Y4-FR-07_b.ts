/**
 * @statement Y4-FR-07.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-FR-07.b: Divide a one- or two-digit number by 100
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y4-FR-07.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y4-FR-07.b",
  params: (rng, numbers) => ({ ...def.params(rng, numbers), by: 100 as const }),
});
