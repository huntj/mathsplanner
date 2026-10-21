/**
 * @statement GF-P1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P1: Record, describe and analyse the frequency of outcomes of probability experiments using
// tables and frequency trees
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { TreeSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  boys: number;
  girls: number;
  boysWalk: number;
  girlsWalk: number;
}

const txt = (s: string) => `\\text{${s}}`;

function tree(p: Params, hide: "boys bus" | "none"): TreeSpec {
  return {
    type: "probability",
    kind: "tree",
    root: String(p.boys + p.girls),
    branches: [
      {
        label: String(p.boys),
        outcome: txt("boys"),
        children: [
          { label: String(p.boysWalk), outcome: txt("walk") },
          { label: hide === "boys bus" ? "?" : String(p.boys - p.boysWalk), outcome: txt("bus") },
        ],
      },
      {
        label: String(p.girls),
        outcome: txt("girls"),
        children: [
          { label: String(p.girlsWalk), outcome: txt("walk") },
          { label: String(p.girls - p.girlsWalk), outcome: txt("bus") },
        ],
      },
    ],
    description: "A frequency tree showing how many boys and girls walk or take the bus to school.",
  };
}

export default defineGenerator<Params>({
  id: "GF-P1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ODDS", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const boys = rng.int(15, 40);
    const girls = rng.int(15, 40);
    const boysWalk = rng.int(4, boys - 4);
    const girlsWalk = rng.int(4, girls - 4);
    if (boys === girls || boysWalk === boys - boysWalk) reject("counts that tell the parts apart");
    return { boys, girls, boysWalk, girlsWalk };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.boys + p.girls;
    switch (depth) {
      case 1: {
        const bus = p.boys - p.boysWalk;
        return A.standard({
          question: [
            "The frequency tree shows how some pupils travel to school.",
            A.figure(tree(p, "boys bus")),
          ],
          ask: "How many boys take the bus?",
          answer: A.number(bus),
          wrong: wrongs(bus, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(total - p.boysWalk),
              feedback: `Start from the ${p.boys} boys, not all ${total} pupils.`,
            },
          ]),
          solution: [{ say: `${p.boys} − ${p.boysWalk} = ${bus} boys take the bus.` }],
        });
      }
      case 2: {
        const walk = p.boysWalk + p.girlsWalk;
        const rows = [
          ["walk", p.boysWalk, p.girlsWalk, walk],
          ["bus", p.boys - p.boysWalk, p.girls - p.girlsWalk, total - walk],
          ["total", p.boys, p.girls, total],
        ];
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The two-way table shows how some pupils travel to school.",
                A.displayMath(tableLatex(["", "boys", "girls", "total"], rows)),
              ],
              ask: "A pupil is chosen at random. What is the probability that they walk?",
            },
          ],
          answer: A.exact(frac(walk, total)),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(frac(walk, total - walk)),
              feedback:
                "Probability compares the walkers with all the pupils, not with the bus users.",
            },
          ],
          solution: [
            { say: `${walk} of the ${total} pupils walk: `, math: toLatex(frac(walk, total)) },
          ],
        });
      }
      default: {
        const girlsBus = p.girls - p.girlsWalk;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The frequency tree shows how some pupils travel to school.",
            A.figure(tree(p, "none")),
            `Ella says the probability that a girl chosen at random takes the bus is ${girlsBus}/${total}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Out of the girls only, ${girlsBus} of ${p.girls} take the bus: ${girlsBus}/${p.girls}. ${girlsBus}/${total} is the chance a pupil is a girl who takes the bus.`,
              correct: true,
            },
            {
              text: "True. Always divide by the total number of pupils.",
              code: "AS.MULTISTEP.ONE-STEP",
            },
            { text: `True. ${girlsBus} girls take the bus.` },
          ],
          solution: [
            {
              say: `Given the pupil is a girl, the denominator is the number of girls, ${p.girls}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.boys - p.boysWalk;
    return true;
  },
});
