/**
 * @statement FM-FS2-06.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-06.c: Use the F-distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FS2-06.c",
  ["STA.HYPOTHESIS.CONCLUSION"],
  [
    {
      question: "Which quantity follows an F-distribution?",
      correct: "The ratio of two independent sample variances from normal populations",
      wrong: [
        [
          "The difference of two sample means",
          "Differences of means use normal or t-distributions.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
        [
          "The sum of squared standardised normal variables",
          "That is a chi-squared distribution.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
      ],
      why: "$F = \\frac{s_1^2}{s_2^2}$ compares two variances.",
    },
    {
      question: "An F-test compares variances from samples of sizes 8 and 11.",
      ask: "What are the degrees of freedom, with the size-8 sample's variance on top?",
      correct: "7 and 10",
      wrong: [
        [
          "8 and 11",
          "Each sample loses one degree of freedom: n − 1.",
          "STA.HYPOTHESIS.CONCLUSION",
        ],
        ["10 and 7", "The numerator's degrees of freedom come first.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
      why: "$\\nu_1 = 8 - 1 = 7$ and $\\nu_2 = 11 - 1 = 10$.",
    },
  ],
  [
    {
      statement:
        "Ola says that for an F-test the larger sample variance should be put on the bottom.",
      truth: false,
      right:
        "False. Put the larger variance on top, so F ≥ 1 and you use the upper tail of the tables.",
      wrong: [
        ["True. That keeps F below 1.", "STA.HYPOTHESIS.CONCLUSION"],
        ["True. The order never matters.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
    },
  ],
);

export default defineGenerator(own);
