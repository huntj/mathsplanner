/**
 * @statement FM-CP-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-01.b: Prove divisibility results by induction
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-01.ts";

const own = concept(
  "FM-CP-01.b",
  ["ALG.INDUCTION"],
  [
    {
      question:
        "To show $f(n) = 7^n - 1$ is divisible by 6 by induction, you write $f(k+1)$ in terms of $f(k)$.",
      ask: "Which is right?",
      correct: "$f(k+1) = 7f(k) + 6$",
      wrong: [
        [
          "$f(k+1) = f(k) + 7$",
          "f(k + 1) = 7 × 7ᵏ − 1. Compare it with 7f(k) = 7 × 7ᵏ − 7.",
          "ALG.INDUCTION",
        ],
        ["$f(k+1) = 7f(k)$", "7f(k) = 7^(k+1) − 7, so you need to add 6.", "ALG.INDUCTION"],
      ],
      why: "$7f(k) + 6 = 7^{k+1} - 7 + 6 = 7^{k+1} - 1 = f(k+1)$, and both parts are multiples of 6.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-01.b" };

export default defineGenerator(mixFamilies("FM-CP-01.b", { 1: base, 2: own, 4: base }));
