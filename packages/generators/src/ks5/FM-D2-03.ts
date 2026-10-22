/**
 * @statement FM-D2-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-03: Find maximum flows in networks using the max-flow min-cut theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  forward: number[];
  backward: number[];
  cuts: number[];
}

export default defineGenerator<Params>({
  id: "FM-D2-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.FLOW"],

  params(rng) {
    const cuts = [rng.int(15, 40), rng.int(15, 40), rng.int(15, 40), rng.int(15, 40)];
    if (new Set(cuts).size < 4) reject("different cut capacities");
    return {
      forward: [rng.int(3, 15), rng.int(3, 15), rng.int(3, 15)],
      backward: [rng.int(2, 9)],
      cuts,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.forward.reduce((s, x) => s + x, 0);
        return A.standard({
          question: [
            `A cut separates a network into a part containing the source S and a part containing the sink T. Arcs crossing from S's side to T's side have capacities ${p.forward.join(", ")}. One arc crosses from T's side to S's side, with capacity ${p.backward[0]}.`,
          ],
          ask: "Find the capacity of the cut.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.FLOW",
              value: A.number(v + (p.backward[0] ?? 0)),
              feedback:
                "Only arcs from the source side to the sink side count towards a cut's capacity.",
            },
          ]),
          solution: [{ say: `${p.forward.join(" + ")} = ${v}.` }],
        });
      }
      case 2: {
        const v = Math.min(...p.cuts);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Every cut of a network has been found. Their capacities are ${p.cuts.join(", ")}.`,
              ],
              ask: "What is the maximum flow through the network?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.FLOW",
              value: A.number(Math.max(...p.cuts)),
              feedback:
                "Every unit of flow must cross every cut, so the flow is limited by the smallest cut.",
            },
          ]),
          solution: [
            {
              say: `By the max-flow min-cut theorem, the maximum flow equals the minimum cut, ${v}.`,
            },
          ],
        });
      }
      default: {
        const small = Math.min(...p.cuts);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Tim says a flow of ${small + 5} is possible through a network that has a cut of capacity ${small}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. All the flow has to cross that cut, so the flow can be at most ${small}.`,
              correct: true,
            },
            { text: "True. Flow can go round a cut.", code: "DEC.FLOW" },
            { text: "True. The maximum flow is the largest cut.", code: "DEC.FLOW" },
          ],
          solution: [{ say: "Any cut gives an upper bound on the flow." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === p.forward.reduce((s, x) => s + x, 0);
    if (question.key.depth === 2) return numberAnswer(question) === Math.min(...p.cuts);
    return true;
  },
});
