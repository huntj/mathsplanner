/**
 * @statement FM-FS1-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-01.a: Find the expectation and variance of a discrete random variable
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-01.ts";

const own = concept(
  "FM-FS1-01.a",
  ["PRO.EXPECTATION"],
  [
    {
      question: "X takes the values 1, 2 and 3 with probabilities 0.2, 0.5 and 0.3.",
      ask: "Find $E(X)$.",
      correct: "2.1",
      wrong: [
        ["2", "Weight each value by its probability: 0.2 + 1.0 + 0.9.", "PRO.EXPECTATION"],
        ["1", "E(X) is Σ x P(X = x), not the sum of the probabilities.", "PRO.EXPECTATION"],
      ],
      why: "$E(X) = 1 \\times 0.2 + 2 \\times 0.5 + 3 \\times 0.3 = 2.1$.",
    },
  ],
  [
    {
      statement: "Ada says $\\operatorname{Var}(X) = E(X^2)$.",
      truth: false,
      right: "False. Var(X) = E(X²) − [E(X)]²: subtract the square of the mean.",
      wrong: [
        ["True. Variance is the mean of the squares.", "PRO.EXPECTATION"],
        ["True. Squaring removes the need to subtract.", "PRO.EXPECTATION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FS1-01.a" };

export default defineGenerator(mixFamilies("FM-FS1-01.a", { 1: own, 2: base, 4: own }));
