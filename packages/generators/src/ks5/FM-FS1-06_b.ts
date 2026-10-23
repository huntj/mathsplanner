/**
 * @statement FM-FS1-06.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FS1-06.b: Use chi-squared tests for contingency tables
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FS1-06.ts";

const own = concept(
  "FM-FS1-06.b",
  ["STA.HYPOTHESIS.CONCLUSION"],
  [
    {
      question:
        "In a contingency table, a row total is 40, a column total is 30 and the grand total is 120.",
      ask: "What is the expected frequency of their cell, under independence?",
      correct: "10",
      wrong: [
        ["70", "Expected = row total × column total ÷ grand total.", "STA.HYPOTHESIS.CONCLUSION"],
        ["1200", "Divide the product by the grand total, 120.", "STA.HYPOTHESIS.CONCLUSION"],
      ],
      why: "$\\frac{40 \\times 30}{120} = 10$.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FS1-06.b" };

export default defineGenerator(mixFamilies("FM-FS1-06.b", { 1: base, 2: own, 4: base }));
