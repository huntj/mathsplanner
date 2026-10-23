/**
 * @statement FM-FS2-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-03.a: Use probability density functions
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-03.ts";

const own = concept(
  "FM-FS2-03.a",
  ["PRO.PDF"],
  [
    {
      question: "X has probability density function $f(x) = \\frac{1}{8}x$ for $0 \\le x \\le 4$.",
      ask: "Find $P(X \\le 2)$.",
      correct: "$\\frac{1}{4}$",
      wrong: [
        ["$\\frac{1}{2}$", "Integrate f from 0 to 2: x²/16 at x = 2.", "PRO.PDF"],
        [
          "$\\frac{1}{4}x$",
          "A probability is a number: evaluate the integral at the limits.",
          "PRO.PDF",
        ],
      ],
      why: "$\\int_0^2 \\frac{x}{8}\\,dx = \\left[\\frac{x^2}{16}\\right]_0^2 = \\frac{1}{4}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS2-03.a" };

export default defineGenerator(mixFamilies("FM-FS2-03.a", { 1: base, 2: own, 4: base }));
