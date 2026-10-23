/**
 * @statement FM-D2-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D2-05.b: Find mixed strategies
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D2-05.ts";

const own = concept(
  "FM-D2-05.b",
  ["DEC.GAMES"],
  [
    {
      question: "Player A has two options and the game has no stable solution.",
      ask: "How is A's optimal mixed strategy usually found?",
      correct: "Choose the probabilities so that A's expected pay-off is the same whatever B does",
      wrong: [
        [
          "Play the row with the biggest pay-off every time",
          "With no stable solution, A should mix the options.",
          "DEC.GAMES",
        ],
        [
          "Play each option with probability ½",
          "The probabilities depend on the pay-offs.",
          "DEC.GAMES",
        ],
      ],
      why: "Equating A's expected pay-offs against each of B's options makes B indifferent and A's gain secure.",
    },
  ],
  [
    {
      statement: "Jo says a mixed strategy means choosing an option at random with equal chances.",
      truth: false,
      right:
        "False. A mixed strategy plays each option with a chosen probability, usually not equal.",
      wrong: [
        ["True. Mixed means 50:50.", "DEC.GAMES"],
        ["True. The pay-offs do not affect the probabilities.", "DEC.GAMES"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-D2-05.b" };

export default defineGenerator(mixFamilies("FM-D2-05.b", { 1: own, 2: base, 4: own }));
