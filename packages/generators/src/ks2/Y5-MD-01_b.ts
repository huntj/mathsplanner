/**
 * @statement Y5-MD-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-MD-01.b: Find all factor pairs of a number
import { defineGenerator } from "@mathsplanner/core";
import { factorsFamily } from "../shared/md.ts";
import { withClaims } from "../shared/variety.ts";

export default defineGenerator(
  withClaims(
    {
      ...factorsFamily("Y5-MD-01.b", { friendly: 50, standard: 72, stretch: 100 }, false),
      depths: [2, 4],
    },
    [
      {
        statement: "Kim says the factor pairs of 20 are 1 × 20, 2 × 10 and 4 × 5.",
        truth: true,
        right: "True. Those are all the pairs of whole numbers that multiply to 20.",
        wrong: [
          ["False. 3 × 7 is missing.", "MD.FACTOR.MISSES-PAIR"],
          ["False. 40 is a factor too.", "MD.FACTOR.FACTOR-MULTIPLE"],
        ],
      },
      {
        statement: "Leo says 24 has 5 factors: 1, 2, 3, 4 and 6.",
        truth: false,
        right: "False. He missed the other half of each pair: 8, 12 and 24. 24 has 8 factors.",
        wrong: [
          ["True. Factors stop at 6.", "MD.FACTOR.MISSES-PAIR"],
          ["True. 24 is not a factor of itself."],
        ],
      },
      {
        claim: "A number is a factor of itself.",
        truth: "always",
        right: "Always. Every number divides itself exactly: n = n × 1.",
        wrong: [
          ["Never. Factors are smaller than the number.", "MD.FACTOR.FACTOR-MULTIPLE"],
          ["Sometimes. Only for prime numbers."],
        ],
      },
    ],
  ),
);
