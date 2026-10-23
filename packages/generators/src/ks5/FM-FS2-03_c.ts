/**
 * @statement FM-FS2-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-03.c: Use the continuous uniform distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FS2-03.c",
  ["PRO.PDF"],
  [
    {
      question: "X is uniformly distributed on $[2, 10]$.",
      ask: "Find $P(X > 7)$.",
      correct: "$\\frac{3}{8}$",
      wrong: [
        ["$\\frac{3}{10}$", "The interval has length 8, not 10.", "PRO.PDF"],
        ["$\\frac{5}{8}$", "That is P(X < 7).", "PRO.PDF"],
      ],
      why: "$\\frac{10 - 7}{10 - 2} = \\frac{3}{8}$.",
    },
    {
      question: "X is uniformly distributed on $[0, 12]$.",
      ask: "Find $\\operatorname{Var}(X)$.",
      correct: "12",
      wrong: [
        ["6", "That is the mean. The variance is (b − a)²/12.", "PRO.EXPECTATION"],
        ["144", "Divide (b − a)² = 144 by 12.", "PRO.EXPECTATION"],
      ],
      why: "$\\frac{(b - a)^2}{12} = \\frac{144}{12} = 12$.",
    },
  ],
  [
    {
      statement: "Lou says the pdf of the uniform distribution on $[0, 0.5]$ is 0.5.",
      truth: false,
      right: "False. The pdf is 1/(b − a) = 2, so that the area is 1.",
      wrong: [
        ["True. A pdf equals the length of the interval.", "PRO.PDF"],
        ["True. A pdf can never be more than 1.", "PRO.PDF"],
      ],
    },
  ],
);

export default defineGenerator(own);
