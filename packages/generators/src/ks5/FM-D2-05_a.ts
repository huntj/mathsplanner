/**
 * @statement FM-D2-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-D2-05.a: Find play-safe strategies
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-D2-05.ts";

const own = concept(
  "FM-D2-05.a",
  ["DEC.GAMES"],
  [
    {
      question: "In a zero-sum game, the largest row minimum equals the smallest column maximum.",
      ask: "What does this show?",
      correct: "The game has a stable solution, a saddle point",
      wrong: [
        [
          "Neither player has a play-safe strategy",
          "Both have one; when they meet, the game is stable.",
          "DEC.GAMES",
        ],
        [
          "The value of the game is 0",
          "The value is the common value, which need not be 0.",
          "DEC.GAMES",
        ],
      ],
      why: "When max(row minima) = min(column maxima), neither player gains by changing: a saddle point.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-D2-05.a" };

export default defineGenerator(mixFamilies("FM-D2-05.a", { 1: base, 2: own, 4: base }));
