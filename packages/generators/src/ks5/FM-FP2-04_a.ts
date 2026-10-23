/**
 * @statement FM-FP2-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-04.a: Solve first-order recurrence relations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-04.ts";

const own = concept(
  "FM-FP2-04.a",
  ["ALG.RECURRENCE"],
  [
    {
      question: "Solve $u_{n+1} = 3u_n$ with $u_0 = 5$.",
      correct: "$u_n = 5 \\times 3^n$",
      wrong: [
        [
          "$u_n = 3 \\times 5^n$",
          "Each term is 3 times the last, starting at 5.",
          "ALG.RECURRENCE",
        ],
        [
          "$u_n = 5 + 3n$",
          "Multiplying by 3 each time gives powers of 3.",
          "ALG.SEQUENCE.GEOMETRIC-ADD",
        ],
      ],
      why: "$u_n = u_0 \\times 3^n = 5 \\times 3^n$.",
    },
  ],
  [
    {
      statement: "Raj says the particular solution of $u_{n+1} = 2u_n + 3$ is $u_n = 3$.",
      truth: false,
      right: "False. Try u_n = k: k = 2k + 3, so k = −3. The particular solution is −3.",
      wrong: [
        ["True. The constant on the right is the particular solution.", "ALG.RECURRENCE"],
        ["True. Divide 3 by 1 − 2 and drop the sign.", "ALG.RECURRENCE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP2-04.a" };

export default defineGenerator(mixFamilies("FM-FP2-04.a", { 1: base, 2: own, 4: own }));
