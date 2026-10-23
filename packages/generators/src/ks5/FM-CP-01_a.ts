/**
 * @statement FM-CP-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-01.a: Prove sums of series by induction
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-01.ts";

const own = concept(
  "FM-CP-01.a",
  ["ALG.INDUCTION"],
  [
    {
      question:
        "To prove $\\sum_{r=1}^{n} r = \\tfrac{1}{2}n(n+1)$ by induction, you assume it is true for $n = k$.",
      ask: "What must you then show?",
      correct: "That $\\sum_{r=1}^{k+1} r = \\tfrac{1}{2}(k+1)(k+2)$",
      wrong: [
        [
          "That $\\sum_{r=1}^{k} r = \\tfrac{1}{2}k(k+1)$",
          "That is the assumption, not what you need to prove.",
          "ALG.INDUCTION",
        ],
        [
          "That it is true for $n = 1$",
          "That is the base case. The inductive step goes from k to k + 1.",
          "ALG.INDUCTION",
        ],
      ],
      why: "Add the (k + 1)th term to the assumed sum and show it equals the formula with n = k + 1.",
    },
    {
      question:
        "In the inductive step for $\\sum_{r=1}^{n} r^2 = \\tfrac{1}{6}n(n+1)(2n+1)$, you start from the sum up to $k$.",
      ask: "Which term do you add?",
      correct: "$(k+1)^2$",
      wrong: [
        ["$k^2$", "k² is already in the sum up to k.", "ALG.INDUCTION"],
        ["$(k+1)$", "The terms of this series are squares.", "ALG.SERIES.STANDARD"],
      ],
      why: "The next term of the series is the (k + 1)th square, $(k+1)^2$.",
    },
  ],
  [
    {
      statement:
        "Rob checks that a series formula works for n = 1, 2, 3 and 4 and says this proves it for all n.",
      truth: false,
      right:
        "False. Checking examples is not a proof. Induction needs the base case and a proof that true for k implies true for k + 1.",
      wrong: [
        ["True. Four cases are enough to see the pattern.", "ALG.PROOF.EXAMPLES"],
        ["True. Induction only needs the first few cases.", "ALG.INDUCTION"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-CP-01.a" };

export default defineGenerator(mixFamilies("FM-CP-01.a", { 1: own, 2: base, 4: own }));
