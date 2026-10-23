/**
 * @statement FM-FP2-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FP2-02.a: Use group axioms and Cayley tables
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";

const own = concept(
  "FM-FP2-02.a",
  ["ALG.GROUP"],
  [
    {
      question: "Which is a group?",
      correct: "The integers under addition",
      wrong: [
        [
          "The integers under multiplication",
          "Most integers have no multiplicative inverse in the integers, e.g. 2.",
          "ALG.GROUP",
        ],
        [
          "The integers under subtraction",
          "Subtraction is not associative, and there is no identity on both sides.",
          "ALG.GROUP",
        ],
      ],
      why: "Addition is closed and associative, 0 is the identity and −a is the inverse of a.",
    },
    {
      question: "In a Cayley table for a group, how often does each element appear in each row?",
      correct: "Exactly once",
      wrong: [
        [
          "At least once",
          "If an element appeared twice, two products would be equal and cancelling would fail.",
          "ALG.GROUP",
        ],
        [
          "It depends on the element",
          "Every row is a rearrangement of the elements: the Latin square property.",
          "ALG.GROUP",
        ],
      ],
      why: "If $ab = ac$ then $b = c$, so no element repeats in a row: each appears exactly once.",
    },
  ],
  [
    {
      statement: "Nia says a group's operation must be commutative.",
      truth: false,
      right:
        "False. Commutativity is not an axiom. Groups where it holds are called abelian; e.g. 2 × 2 invertible matrices under multiplication are not.",
      wrong: [
        ["True. Commutativity is one of the group axioms.", "ALG.GROUP"],
        ["True. Every group is abelian.", "ALG.GROUP"],
      ],
    },
  ],
);

export default defineGenerator(own);
