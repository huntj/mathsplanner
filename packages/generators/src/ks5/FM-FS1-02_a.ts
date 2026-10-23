/**
 * @statement FM-FS1-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-02.a: Use the Poisson distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-02.ts";

const own = concept(
  "FM-FS1-02.a",
  ["PRO.POISSON"],
  [
    {
      question: "Which situation is best modelled by a Poisson distribution?",
      correct: "The number of emails arriving in an hour, at a constant average rate",
      wrong: [
        [
          "The number of heads in 20 coin flips",
          "A fixed number of trials suggests a binomial distribution.",
          "PRO.POISSON",
        ],
        [
          "The heights of adult women",
          "Heights are continuous; a Poisson variable counts events.",
          "PRO.POISSON",
        ],
      ],
      why: "A Poisson distribution counts events that happen singly, independently and at a constant average rate.",
    },
  ],
  [
    {
      statement: "Bo says that for $X \\sim \\text{Po}(3)$, the variance of X is 9.",
      truth: false,
      right: "False. For a Poisson distribution the mean and the variance are both λ = 3.",
      wrong: [
        ["True. The variance is λ².", "PRO.POISSON"],
        ["True. The standard deviation is 3.", "PRO.POISSON"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-02.a" };

export default defineGenerator(mixFamilies("FM-FS1-02.a", { 1: base, 2: own, 4: own }));
