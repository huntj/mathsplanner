/**
 * @statement FM-FS2-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS2-05.b: Find confidence intervals
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS2-05.ts";

const own = concept(
  "FM-FS2-05.b",
  ["PRO.CLT"],
  [
    {
      question:
        "A 95% confidence interval for μ from a normal population with known σ uses which standard error?",
      correct: "$\\frac{\\sigma}{\\sqrt{n}}$",
      wrong: [
        ["$\\sigma$", "The sample mean varies less than single values: use σ/√n.", "PRO.CLT"],
        ["$\\frac{\\sigma}{n}$", "Divide by √n, not n.", "PRO.CLT"],
      ],
      why: "$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$, so the standard error is $\\frac{\\sigma}{\\sqrt{n}}$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS2-05.b" };

export default defineGenerator(mixFamilies("FM-FS2-05.b", { 1: own, 2: base, 4: base }));
