/**
 * @statement Y2-MEA-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-06.a: Tell the time to quarter past and quarter to
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-MEA-06.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-MEA-06.a",
  params: (rng, numbers) => ({ ...def.params(rng, numbers), minutes: rng.pick([15, 45]) }),
});
