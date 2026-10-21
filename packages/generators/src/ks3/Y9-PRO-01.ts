/**
 * @statement Y9-PRO-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-PRO-01: Enumerate sets and unions/intersections of sets systematically, using tables, grids and
// Venn diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import type { ProbabilitySpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  onlyA: number;
  both: number;
  onlyB: number;
  neither: number;
}

const venn = (p: Params, hideNeither = false): ProbabilitySpec => ({
  type: "probability",
  kind: "venn",
  sets: ["\\text{Football}", "\\text{Tennis}"],
  regions: [
    String(p.onlyA),
    String(p.both),
    String(p.onlyB),
    hideNeither ? "?" : String(p.neither),
  ],
  description:
    "A Venn diagram of pupils who play football and pupils who play tennis, with a number in each region.",
});

export default defineGenerator<Params>({
  id: "Y9-PRO-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.VENN.DOUBLE-COUNT", "PRO.ODDS"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 12 : 24;
    const p = {
      onlyA: rng.int(2, top),
      both: rng.int(1, top / 2),
      onlyB: rng.int(2, top),
      neither: rng.int(1, top / 2),
    };
    if (new Set(Object.values(p)).size < 4) reject("four different counts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.onlyA + p.both + p.onlyB + p.neither;
    const union = p.onlyA + p.both + p.onlyB;
    const intro = "The Venn diagram shows which sports some pupils play.";
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro, A.figure(venn(p))],
          ask: "How many pupils play football or tennis or both?",
          answer: A.number(union),
          wrong: wrongs(union, [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.number(union + p.both),
              feedback: `The ${p.both} in the middle play both: count them once.`,
            },
          ]),
          solution: [
            {
              say: `${p.onlyA} + ${p.both} + ${p.onlyB} = ${union}. The ${p.neither} outside play neither.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [intro, ` There are ${total} pupils altogether.`, A.figure(venn(p, true))],
          ask: "One pupil is chosen at random. What is the probability that they play exactly one of the two sports?",
          answer: A.exact(frac(p.onlyA + p.onlyB, total)),
          wrong: [
            {
              code: "PRO.VENN.DOUBLE-COUNT",
              value: A.exact(fracTex(p.onlyA + p.onlyB + 2 * p.both, total)),
              feedback: "Exactly one sport means football only or tennis only, not both.",
            },
          ],
          solution: [
            {
              say: `Football only ${p.onlyA} + tennis only ${p.onlyB} = ${p.onlyA + p.onlyB} out of ${total}.`,
            },
          ],
        });
      default: {
        const footballTotal = p.onlyA + p.both;
        const tennisTotal = p.onlyB + p.both;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            A.figure(venn(p)),
            ` ${footballTotal} play football and ${tennisTotal} play tennis. Sam says ${footballTotal} + ${tennisTotal} = ${footballTotal + tennisTotal} pupils play a sport.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ${p.both} who play both are in each total, so they are counted twice. ${footballTotal} + ${tennisTotal} − ${p.both} = ${union}.`,
              correct: true,
            },
            {
              text: "True. Add the two totals to get everyone who plays.",
              code: "PRO.VENN.DOUBLE-COUNT",
            },
            { text: "True. Everyone in the diagram plays a sport." },
          ],
          solution: [
            { say: `Count each region once: ${p.onlyA} + ${p.both} + ${p.onlyB} = ${union}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact")
      return (
        String(a.value) === toLatex(frac(p.onlyA + p.onlyB, p.onlyA + p.both + p.onlyB + p.neither))
      );
    if (question.archetype === "standard")
      return numberAnswer(question) === p.onlyA + p.both + p.onlyB;
    return true;
  },
});
