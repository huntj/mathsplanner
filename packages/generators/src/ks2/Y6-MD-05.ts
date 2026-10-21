/**
 * @statement Y6-MD-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-05: Identify common factors, common multiples and prime numbers
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily, primesFamily } from "../shared/md.ts";
import { mixFamilies } from "../shared/npv.ts";

export default defineGenerator(
  mixFamilies("Y6-MD-05", {
    1: factorsFamily("Y6-MD-05", { friendly: 60, standard: 100, stretch: 100 }, true),
    2: factorsFamily("Y6-MD-05", { friendly: 60, standard: 100, stretch: 100 }, true),
    4: primesFamily("Y6-MD-05", { friendly: 50, standard: 100, stretch: 100 }, false),
  }),
);
