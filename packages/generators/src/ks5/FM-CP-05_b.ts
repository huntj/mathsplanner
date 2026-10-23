/**
 * @statement FM-CP-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-CP-05.b: Use loci of the form arg(z − a) = θ
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-CP-05.ts";

const own = concept(
  "FM-CP-05.b",
  ["CPLX.LOCUS"],
  [
    {
      question: "Which describes the locus $\\arg(z - 2i) = \\frac{\\pi}{2}$?",
      correct: "A half-line from $(0, 2)$ going straight up, not including $(0, 2)$",
      wrong: [
        [
          "The whole imaginary axis",
          "arg gives one direction from the start point, so it is a half-line.",
          "CPLX.LOCUS",
        ],
        [
          "A half-line from $(0, -2)$ going straight up",
          "arg(z − a) starts at a = 2i, the point (0, 2).",
          "CPLX.LOCUS",
        ],
      ],
      why: "Points whose direction from $2i$ is $\\frac{\\pi}{2}$: straight up from $(0, 2)$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-CP-05.b" };

export default defineGenerator(mixFamilies("FM-CP-05.b", { 1: own, 2: own, 4: base }));
