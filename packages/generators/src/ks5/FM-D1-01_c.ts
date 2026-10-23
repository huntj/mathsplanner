/**
 * @statement FM-D1-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D1-01.c: Judge the order of an algorithm
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-D1-01.c",
  ["DEC.SORT"],
  [
    {
      question: "An algorithm has quadratic order. It takes 2 seconds for 100 items.",
      ask: "Roughly how long will it take for 300 items?",
      correct: "18 seconds",
      wrong: [
        ["6 seconds", "Quadratic order: tripling n multiplies the time by 3² = 9.", "DEC.SORT"],
        ["54 seconds", "That is cubic order: 3³ = 27.", "DEC.SORT"],
      ],
      why: "The time grows like $n^2$, so $2 \\times 3^2 = 18$ seconds.",
    },
    {
      question: "What is the order of a bubble sort on n items?",
      correct: "Quadratic, $n^2$",
      wrong: [
        ["Linear, $n$", "There can be up to n passes of up to n comparisons.", "DEC.SORT"],
        ["Cubic, $n^3$", "The comparisons total about n²/2.", "DEC.SORT"],
      ],
      why: "Up to $n - 1$ passes of up to $n - 1$ comparisons gives about $\\frac{1}{2}n^2$ comparisons.",
    },
  ],
  [
    {
      statement:
        "Zed says a linear algorithm that takes 5 s for 1000 items will take 10 s for 4000 items.",
      truth: false,
      right:
        "False. Linear order means time is proportional to n: 4 times as many items takes about 20 s.",
      wrong: [
        ["True. Time doubles when n quadruples.", "DEC.SORT"],
        ["True. Linear means the time adds 5 s each time.", "DEC.SORT"],
      ],
    },
  ],
);

export default defineGenerator(own);
