/**
 * @statement FM-FS1-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-02.c: Approximate the binomial with a Poisson distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-02.ts";

const own = concept(
  "FM-FS1-02.c",
  ["PRO.POISSON"],
  [
    {
      question: "$X \\sim B(200, 0.02)$ is approximated by a Poisson distribution.",
      ask: "Which one?",
      correct: "$\\text{Po}(4)$",
      wrong: [
        ["$\\text{Po}(0.02)$", "Use the mean np = 200 × 0.02.", "PRO.POISSON"],
        ["$\\text{Po}(200)$", "The Poisson mean is np, not n.", "PRO.POISSON"],
      ],
      why: "With n large and p small, $B(n, p) \\approx \\text{Po}(np) = \\text{Po}(4)$.",
    },
    {
      question: "For which binomial distribution is a Poisson approximation most suitable?",
      correct: "$B(500, 0.01)$",
      wrong: [
        [
          "$B(20, 0.5)$",
          "p is not small, so the variance np(1 − p) is far from the mean.",
          "PRO.POISSON",
        ],
        ["$B(10, 0.3)$", "n is small and p is not small.", "PRO.POISSON"],
      ],
      why: "Poisson works when n is large and p is small, so that np(1 − p) ≈ np.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS1-02.c" };

export default defineGenerator(mixFamilies("FM-FS1-02.c", { 1: own, 2: own, 4: base }));
