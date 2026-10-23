/**
 * @statement FM-FP2-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-04.b: Solve second-order recurrence relations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-04.ts";

const own = concept(
  "FM-FP2-04.b",
  ["ALG.RECURRENCE"],
  [
    {
      question: "Which is the characteristic equation of $u_{n+2} = 5u_{n+1} - 6u_n$?",
      correct: "$r^2 - 5r + 6 = 0$",
      wrong: [
        ["$r^2 + 5r - 6 = 0$", "Move every term to one side: r² − 5r + 6 = 0.", "ALG.RECURRENCE"],
        [
          "$r^2 - 6r + 5 = 0$",
          "The coefficient of u_(n+1) goes with r, the coefficient of u_n with 1.",
          "ALG.RECURRENCE",
        ],
      ],
      why: "Substituting $u_n = r^n$ gives $r^2 = 5r - 6$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP2-04.b" };

export default defineGenerator(mixFamilies("FM-FP2-04.b", { 1: own, 2: base, 4: base }));
