/**
 * @statement Y2-GEO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-GEO-02.a: Count the faces of 3D shapes
import { defineGenerator } from "@mathsplanner/core";
import parent from "./Y2-GEO-02.ts";

const def = parent.definition;

export default defineGenerator({
  ...def,
  id: "Y2-GEO-02.a",
  depths: [1, 2, 3],
  params: (rng, numbers) => ({ ...def.params(rng, numbers), ask: "faces" as const }),
});
