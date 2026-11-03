/**
 * @statement Y6-MD-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y6-MD-05.a: Identify common factors
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

const base = factorsFamily("Y6-MD-05.a", { friendly: 60, standard: 100, stretch: 100 }, true);

export default defineGenerator(
  withClaims(
    {
      ...base,
      depths: [1, 4],
      params: (rng, numbers) => ({ ...base.params(rng, numbers), multiple: false, claim: 0 }),
    },
    [
      {
        statement: "Jo says the common factors of 12 and 18 are 1, 2, 3 and 6.",
        truth: true,
        right: "True. They divide both: 12 = 2 × 6 = 3 × 4 and 18 = 2 × 9 = 3 × 6.",
        wrong: [
          ["False. 36 is a common factor.", "MD.FACTOR.FACTOR-MULTIPLE"],
          ["False. 6 is the only one."],
        ],
      },
      {
        statement: "Leo says 4 is a factor of 30.",
        truth: false,
        right: "False. 30 ÷ 4 = 7 remainder 2, so 4 does not divide 30.",
        wrong: [
          ["True. 4 and 30 are both even.", "MD.FACTOR.MISSES-PAIR"],
          ["True. Every even number divides 30."],
        ],
      },
      {
        claim: "1 is a factor of every whole number.",
        truth: "always",
        right: "Always. Every whole number is 1 times itself.",
        wrong: [
          ["Never. 1 is too small to be a factor.", "MD.FACTOR.FACTOR-MULTIPLE"],
          ["Sometimes. Only for odd numbers."],
        ],
      },
    ],
  ),
);
