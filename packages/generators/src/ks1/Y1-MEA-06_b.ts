/**
 * @statement Y1-MEA-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-06.b: Tell the time to half past the hour
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y1-MEA-06.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y1-MEA-06.b",
  params: (rng, numbers) => ({ ...def.params(rng, numbers), half: true }),
});
