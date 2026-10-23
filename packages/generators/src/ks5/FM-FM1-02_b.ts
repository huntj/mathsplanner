/**
 * @statement FM-FM1-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// FM-FM1-02.b: Use power
import { defineGenerator } from "@mathsplanner/core";
import { concept } from "../shared/concept.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./FM-FM1-02.ts";

const own = concept(
  "FM-FM1-02.b",
  ["MECH.ENERGY"],
  [
    {
      question: "A crane lifts a 500 N load 12 m in 20 seconds at a steady speed.",
      ask: "What is its average power output?",
      correct: "300 W",
      wrong: [
        ["6000 W", "Power is work done per second: 6000 J ÷ 20 s.", "MECH.ENERGY"],
        ["120 000 W", "Divide the work done by the time, do not multiply.", "MECH.ENERGY"],
      ],
      why: "Work $= 500 \\times 12 = 6000$ J, so power $= 6000 \\div 20 = 300$ W.",
    },
  ],
  [
    {
      statement: "Pat says a car's power is its driving force divided by its speed.",
      truth: false,
      right: "False. Power = force × velocity, P = Fv.",
      wrong: [
        ["True. P = F/v.", "MECH.ENERGY"],
        ["True. More speed means less power.", "MECH.ENERGY"],
      ],
    },
  ],
);

const base = { ...parent.definition, id: "FM-FM1-02.b" };

export default defineGenerator(mixFamilies("FM-FM1-02.b", { 1: base, 2: own, 4: own }));
