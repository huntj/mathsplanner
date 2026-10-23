/**
 * @statement FM-FP2-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-02.d: Identify isomorphic groups
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FP2-02.ts";

const own = concept(
  "FM-FP2-02.d",
  ["ALG.GROUP"],
  [
    {
      question: "Which group is isomorphic to the integers modulo 4 under addition?",
      correct: "$\\{1, i, -1, -i\\}$ under multiplication",
      wrong: [
        [
          "$\\{1, -1\\}$ under multiplication",
          "Isomorphic groups have the same order; this has 2 elements.",
          "ALG.GROUP",
        ],
        [
          "The Klein four-group",
          "It has no element of order 4, but the integers mod 4 do.",
          "ALG.GROUP",
        ],
      ],
      why: "Both are cyclic of order 4: $i$ generates the first just as 1 generates the integers mod 4.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FP2-02.d" };

export default defineGenerator(mixFamilies("FM-FP2-02.d", { 1: own, 2: own, 4: base }));
