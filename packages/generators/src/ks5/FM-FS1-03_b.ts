/**
 * @statement FM-FS1-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-03.b: Use the negative binomial distribution
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-03.ts";

const own = concept(
  "FM-FS1-03.b",
  ["PRO.GEOMETRIC"],
  [
    {
      question: "Y is the number of trials needed to get 3 successes, with $p = 0.4$ each time.",
      ask: "Which is $P(Y = 5)$?",
      correct: "$\\binom{4}{2}0.4^3 \\times 0.6^2$",
      wrong: [
        [
          "$\\binom{5}{3}0.4^3 \\times 0.6^2$",
          "The 5th trial must be the 3rd success, so choose 2 successes from the first 4.",
          "PRO.GEOMETRIC",
        ],
        [
          "$0.6^4 \\times 0.4$",
          "That is the geometric probability of a first success on trial 5.",
          "PRO.GEOMETRIC",
        ],
      ],
      why: "Two successes in the first 4 trials, then a success: $\\binom{4}{2}p^3(1 - p)^2$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS1-03.b" };

export default defineGenerator(mixFamilies("FM-FS1-03.b", { 1: own, 2: own, 4: base }));
