/**
 * @statement FM-D2-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D2-06.a: Solve recurrence relations
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D2-06.ts";

const own = concept(
  "FM-D2-06.a",
  ["ALG.RECURRENCE"],
  [
    {
      question: "Which describes the recurrence $u_{n+1} = 1.05u_n$, $u_0 = 200$?",
      correct: "£200 growing by 5% each year",
      wrong: [
        [
          "£200 increasing by £1.05 each year",
          "Multiplying by 1.05 is a 5% increase, not adding 1.05.",
          "ALG.RECURRENCE",
        ],
        [
          "£200 growing by 105% each year",
          "1.05 means 105% of the previous value, an increase of 5%.",
          "ALG.RECURRENCE",
        ],
      ],
      why: "Multiplying by 1.05 each step adds 5% of the current amount.",
    },
  ],
  [
    {
      statement: "Kai says the solution of $u_{n+1} = 2u_n$, $u_0 = 3$, is $u_n = 2 \\times 3^n$.",
      truth: false,
      right: "False. Each term doubles, starting from 3: u_n = 3 × 2ⁿ.",
      wrong: [
        ["True. The multiplier goes in front.", "ALG.RECURRENCE"],
        ["True. Both forms are the same.", "ALG.RECURRENCE"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D2-06.a" };

export default defineGenerator(mixFamilies("FM-D2-06.a", { 1: own, 2: base, 4: own }));
