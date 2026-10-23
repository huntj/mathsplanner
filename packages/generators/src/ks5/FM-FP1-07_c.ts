/**
 * @statement FM-FP1-07.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP1-07.c: Use Simpson's rule
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP1-07.ts";

const own = concept(
  "FM-FP1-07.c",
  ["CALC.NUMERICAL"],
  [
    {
      question: "Simpson's rule with 4 strips uses ordinates $y_0, y_1, y_2, y_3, y_4$.",
      ask: "What are their weights?",
      correct: "1, 4, 2, 4, 1",
      wrong: [
        ["1, 2, 2, 2, 1", "Those are the trapezium rule's weights.", "CALC.NUMERICAL"],
        ["1, 4, 4, 4, 1", "The even inside ordinates have weight 2.", "CALC.NUMERICAL"],
      ],
      why: "Simpson's rule: $\\frac{h}{3}(y_0 + 4y_1 + 2y_2 + 4y_3 + y_4)$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP1-07.c" };

export default defineGenerator(mixFamilies("FM-FP1-07.c", { 1: own, 2: base, 4: base }));
