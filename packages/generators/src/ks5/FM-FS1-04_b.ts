/**
 * @statement FM-FS1-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-04.b: Test a geometric parameter
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FS1-04.b",
  ["STA.HYPOTHESIS.TAIL", "PRO.GEOMETRIC"],
  [
    {
      question:
        "X is the number of attempts up to the first success, $X \\sim \\text{Geo}(p)$. Test H₀: $p = 0.3$ against H₁: $p < 0.3$.",
      ask: "Which values of X give evidence for H₁?",
      correct: "Large values of X",
      wrong: [
        [
          "Small values of X",
          "A smaller p means successes are rarer, so it takes longer: large X.",
          "STA.HYPOTHESIS.TAIL",
        ],
        [
          "Values of X near the mean",
          "Evidence against H₀ comes from the tail in the direction of H₁.",
          "STA.HYPOTHESIS.TAIL",
        ],
      ],
      why: "If p is smaller, the first success tends to come later, so the critical region is $X \\ge c$.",
    },
    {
      question: "Under H₀, $X \\sim \\text{Geo}(0.3)$. The first success comes on attempt 9.",
      ask: "Which probability is the p-value for H₁: $p < 0.3$?",
      correct: "$P(X \\ge 9) = 0.7^8$",
      wrong: [
        [
          "$P(X = 9) = 0.7^8 \\times 0.3$",
          "The p-value is a tail probability, not the probability of the result itself.",
          "STA.HYPOTHESIS.TAIL",
        ],
        ["$P(X \\le 9)$", "H₁ predicts large X, so use the upper tail.", "STA.HYPOTHESIS.TAIL"],
      ],
      why: "$X \\ge 9$ means the first 8 attempts fail: $P(X \\ge 9) = 0.7^8 \\approx 0.0576$.",
    },
  ],
  [
    {
      statement:
        "Eli tests H₀: $p = 0.25$ for a geometric distribution and compares $P(X = x)$ with the significance level.",
      truth: false,
      right:
        "False. Compare the tail probability P(X ≥ x) (or P(X ≤ x)) with the significance level.",
      wrong: [
        ["True. The probability of the observed value decides it.", "STA.HYPOTHESIS.TAIL"],
        ["True. Geometric tests never use tails.", "STA.HYPOTHESIS.TAIL"],
      ],
    },
  ],
);

export default defineGenerator(own);
