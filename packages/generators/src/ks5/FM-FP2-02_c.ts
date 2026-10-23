/**
 * @statement FM-FP2-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-02.c: Use Lagrange's theorem
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-02.ts";

const own = concept(
  "FM-FP2-02.c",
  ["ALG.GROUP"],
  [
    {
      question: "A group has 15 elements.",
      ask: "Which could be the order of one of its elements?",
      correct: "5",
      wrong: [
        ["4", "By Lagrange's theorem the order of an element divides 15.", "ALG.GROUP"],
        ["6", "6 does not divide 15.", "ALG.GROUP"],
      ],
      why: "An element's order equals the order of the cyclic subgroup it generates, which must divide 15.",
    },
  ],
  [
    {
      statement:
        "Pip says a group of order 12 must have a subgroup of order 6, because 6 divides 12.",
      truth: false,
      right:
        "False. Lagrange's theorem says subgroup orders divide 12; it does not promise a subgroup for every divisor (A₄ has no subgroup of order 6).",
      wrong: [
        ["True. Every divisor gives a subgroup.", "ALG.GROUP"],
        ["True. That is what Lagrange's theorem says.", "ALG.GROUP"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FP2-02.c" };

export default defineGenerator(mixFamilies("FM-FP2-02.c", { 1: own, 2: base, 4: own }));
