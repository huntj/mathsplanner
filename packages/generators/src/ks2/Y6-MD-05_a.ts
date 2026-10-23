/**
 * @statement Y6-MD-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-05.a: Identify common factors
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";

const base = factorsFamily("Y6-MD-05.a", { friendly: 60, standard: 100, stretch: 100 }, true);

export default defineGenerator({
  ...base,
  depths: [1, 4],
  params: (rng, numbers) => ({ ...base.params(rng, numbers), multiple: false, claim: 0 }),
});
