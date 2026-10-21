/**
 * @statement GF-P6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P6: Enumerate sets and combinations systematically using tables, grids, Venn diagrams and tree
// diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { VennSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  starters: number;
  mains: number;
  /** Depth 3: sections on the spinner paired with a coin. */
  sections: number;
  /** Depth 4: the counts in the Venn diagram's regions. */
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params): VennSpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Cats}", "\\text{Dogs}"],
  regions: [String(p.onlyA), String(p.both), String(p.onlyB), String(p.neither)],
  description:
    "A Venn diagram of people who own cats and people who own dogs, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "GF-P6",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MD.MULTIPLY.ADDS", "PRO.VENN.DOUBLE-COUNT"],

  params(rng) {
    const p = {
      starters: rng.int(3, 6),
      mains: rng.int(3, 7),
      sections: rng.int(3, 5),
      onlyA: rng.int(3, 15),
      both: rng.int(2, 8),
      onlyB: rng.int(3, 15),
      neither: rng.int(2, 10),
    };
    if (p.starters === p.mains || new Set([p.onlyA, p.both, p.onlyB, p.neither]).size < 4)
      reject("different counts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.starters * p.mains;
        return A.standard({
          question: `A café menu has ${p.starters} starters and ${p.mains} main courses.`,
          ask: "How many different meals of one starter and one main course are there?",
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.starters + p.mains),
              feedback: `Each of the ${p.starters} starters goes with each of the ${p.mains} mains: multiply.`,
            },
          ]),
          solution: [
            {
              say: `List systematically: each starter pairs with ${p.mains} mains, so ${p.starters} × ${p.mains} = ${n}.`,
            },
          ],
        });
      }
      case 2: {
        const n = p.starters * p.mains;
        return A.reverse({
          question: `A café offers ${n} different meals of one starter and one main course. There are ${p.starters} starters.`,
          ask: "How many main courses are there?",
          answer: A.number(p.mains),
          wrong: wrongs(p.mains, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(n - p.starters),
              feedback: `Starters × mains = ${n}, so divide by ${p.starters}.`,
            },
          ]),
          solution: [
            {
              say: `${p.starters} × ? = ${n}, so there are ${n} ÷ ${p.starters} = ${p.mains} mains.`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each experiment to its number of possible outcomes.",
          pairs: [
            ["Flip two coins", "4"],
            ["Flip a coin and roll a dice", "12"],
            ["Roll two dice", "36"],
            [`Spin a ${p.sections}-section spinner and flip a coin`, String(p.sections * 2)],
          ].map(([a, b]) => [a ?? "", A.math(b ?? "")] as [A.RichInput, A.RichInput]),
          solution: [
            {
              say: "Multiply the number of outcomes of each part: a grid or tree diagram shows every pair once.",
            },
          ],
        });
      default: {
        const total = p.onlyA + p.both + p.onlyB;
        const claim = p.onlyA + 2 * p.both + p.onlyB;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The Venn diagram shows which pets some people own.",
            A.figure(venn(p)),
            `Kai says ${p.onlyA + p.both} + ${p.both + p.onlyB} = ${claim} people own a cat or a dog.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ${p.both} people who own both are counted twice. ${p.onlyA} + ${p.both} + ${p.onlyB} = ${total}.`,
              correct: true,
            },
            { text: "True. Add the cat owners and the dog owners.", code: "PRO.VENN.DOUBLE-COUNT" },
            { text: `False. Include the ${p.neither} outside the circles too.` },
          ],
          solution: [
            { say: `Count each region once: ${p.onlyA} + ${p.both} + ${p.onlyB} = ${total}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.starters * p.mains;
    if (question.archetype === "reverse") return numberAnswer(question) === p.mains;
    return true;
  },
});
