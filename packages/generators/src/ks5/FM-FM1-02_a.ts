/**
 * @statement FM-FM1-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM1-02.a: Use work and kinetic and potential energy
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM1-02.ts";

const own = concept(
  "FM-FM1-02.a",
  ["MECH.ENERGY"],
  [
    {
      question: "A 2 kg ball moves at 3 m/s.",
      ask: "What is its kinetic energy?",
      correct: "9 J",
      wrong: [
        ["18 J", "Kinetic energy is ½mv²: remember the ½.", "MECH.ENERGY"],
        ["6 J", "Square the speed: ½ × 2 × 3².", "MECH.ENERGY"],
      ],
      why: "$\\tfrac{1}{2} \\times 2 \\times 3^2 = 9$ J.",
    },
  ],
  [],
);

const base = { ...parent.definition, id: "FM-FM1-02.a" };

export default defineGenerator(mixFamilies("FM-FM1-02.a", { 1: own, 2: base, 4: base }));
