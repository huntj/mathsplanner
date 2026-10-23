/**
 * @statement Y2-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.c: Count in tens from any number, forwards and backwards
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies, moreOrLess } from "../shared/npv.ts";
import parent from "./Y2-NPV-01.ts";

const def = parent.definition;

// Counting back in tens, and the claim that the ones digit stays the same.
const back = {
  ...def,
  id: "Y2-NPV-01.c",
  params: (rng: Parameters<typeof def.params>[0], numbers: Parameters<typeof def.params>[1]) => ({
    ...def.params(rng, numbers),
    claim: 2,
  }),
};

export default defineGenerator(
  mixFamilies("Y2-NPV-01.c", {
    1: moreOrLess(
      "Y2-NPV-01.c",
      { friendly: [11, 79], standard: [11, 89], stretch: [90, 99] },
      { friendly: [10], standard: [10], stretch: [10] },
    ),
    2: back,
    4: back,
  }),
);
