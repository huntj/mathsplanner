/**
 * @statement FM-FP2-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-01.a: Use the division and Euclidean algorithms
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP2-01.a",
  ["ALG.GROUP"],
  [
    {
      question: "Use the Euclidean algorithm to find the highest common factor of 252 and 198.",
      correct: "18",
      wrong: [
        [
          "54",
          "252 = 198 + 54, then 198 = 3 × 54 + 36, 54 = 36 + 18, 36 = 2 × 18.",
          "NPV.FACTOR.HCF-LCM",
        ],
        [
          "6",
          "Keep going until the remainder is 0: the last non-zero remainder is 18.",
          "NPV.FACTOR.HCF-LCM",
        ],
      ],
      why: "252 = 1 × 198 + 54, 198 = 3 × 54 + 36, 54 = 1 × 36 + 18, 36 = 2 × 18 + 0.",
    },
    {
      question: "By the division algorithm, $-17 = 5q + r$ with $0 \\le r < 5$.",
      ask: "What are q and r?",
      correct: "$q = -4$, $r = 3$",
      wrong: [
        ["$q = -3$, $r = -2$", "The remainder must satisfy 0 ≤ r < 5.", "NPV.FACTOR.HCF-LCM"],
        ["$q = 3$, $r = 2$", "5 × 3 + 2 = 17, not −17.", "NPV.FACTOR.HCF-LCM"],
      ],
      why: "$5 \\times (-4) + 3 = -17$, with $0 \\le 3 < 5$.",
    },
  ],
  [
    {
      statement:
        "Kit says the Euclidean algorithm gives the lowest common multiple of two numbers.",
      truth: false,
      right:
        "False. It gives the highest common factor. The LCM is the product divided by the HCF.",
      wrong: [
        ["True. The last remainder is the LCM.", "NPV.FACTOR.HCF-LCM"],
        ["True. It finds both at once.", "NPV.FACTOR.HCF-LCM"],
      ],
    },
  ],
);

export default defineGenerator(own);
