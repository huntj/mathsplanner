/**
 * @statement Y2-NPV-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-01.c: Count in tens from any number, forwards and backwards
import { defineGenerator } from "@mathsplanner/core";
import { mixFamilies, moreOrLess } from "../shared/npv.ts";
import parent from "./Y2-NPV-01.ts";
import { withClaims } from "../shared/variety.ts";

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
  withClaims(
    mixFamilies("Y2-NPV-01.c", {
      1: moreOrLess(
        "Y2-NPV-01.c",
        { friendly: [11, 79], standard: [11, 89], stretch: [90, 99] },
        { friendly: [10], standard: [10], stretch: [10] },
      ),
      2: back,
      4: back,
    }),
    [
      {
        statement: "Leo counts on in 10s from 23: 23, 33, 43, 53.",
        truth: true,
        right: "True. Each step adds 1 ten; the ones stay 3.",
        wrong: [
          ["False. It goes 23, 24, 25.", "NPV.SEQUENCE.STEP-ONE"],
          ["False. It goes 23, 33, 34.", "NPV.PLACE.TENS-ONES-MIXUP"],
        ],
      },
      {
        statement: "Mia says 10 more than 45 is 46.",
        truth: false,
        right: "False. 10 more changes the tens: 55.",
        wrong: [
          ["True. Add 1.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["True. More means the next number."],
        ],
      },
      {
        claim: "Adding 10 to a number changes its ones digit.",
        truth: "never",
        right: "Never. Adding 10 changes the tens digit; the ones stay the same.",
        wrong: [
          ["Always. Adding changes the last digit.", "NPV.PLACE.TENS-ONES-MIXUP"],
          ["Sometimes. Only for big numbers."],
        ],
      },
    ],
  ),
);
