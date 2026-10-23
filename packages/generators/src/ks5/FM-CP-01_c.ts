/**
 * @statement FM-CP-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-01.c: Prove matrix powers by induction
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-CP-01.c",
  ["ALG.INDUCTION", "MAT.PRODUCT"],
  [
    {
      question:
        "To prove $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}^n = \\begin{pmatrix} 1 & n \\\\ 0 & 1 \\end{pmatrix}$, you assume it for $n = k$.",
      ask: "How do you get the power $k + 1$?",
      correct: "Multiply the assumed result by $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$",
      wrong: [
        [
          "Add $\\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ to the assumed result",
          "Powers multiply: Mᵏ⁺¹ = Mᵏ × M.",
          "ALG.INDUCTION",
        ],
        [
          "Replace every $k$ by $k + 1$ in the assumed result",
          "That writes down what you want to prove; it does not prove it.",
          "ALG.INDUCTION",
        ],
      ],
      why: "$M^{k+1} = M^k M$, so multiply the assumed matrix by M and simplify.",
    },
    {
      question:
        "For $M = \\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$, the claim is $M^n = \\begin{pmatrix} 2^n & 0 \\\\ 0 & 3^n \\end{pmatrix}$.",
      ask: "What is the base case?",
      correct: "$n = 1$: both sides are $\\begin{pmatrix} 2 & 0 \\\\ 0 & 3 \\end{pmatrix}$",
      wrong: [
        [
          "$n = 0$: both sides are the zero matrix",
          "M⁰ is the identity, and the result is stated for n ≥ 1.",
          "ALG.INDUCTION",
        ],
        [
          "$n = k$: assume it is true",
          "That is the inductive hypothesis, not the base case.",
          "ALG.INDUCTION",
        ],
      ],
      why: "Check the smallest case, n = 1: $M^1 = M$ and the formula gives the same matrix.",
    },
  ],
  [
    {
      statement:
        "Jo proves that if $M^k$ has a formula then $M^{k+1}$ does too, but never checks $n = 1$. She says the result is proved.",
      truth: false,
      right:
        "False. Without the base case the chain never starts: the step from k to k + 1 needs a true first case.",
      wrong: [
        ["True. The inductive step is the important part.", "ALG.INDUCTION"],
        ["True. The base case is always obvious, so it can be left out.", "ALG.INDUCTION"],
      ],
    },
  ],
);

export default defineGenerator(own);
