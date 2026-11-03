/**
 * @statement Y3-FR-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-03: Recognise and use fractions as numbers: unit fractions and non-unit fractions with small
// denominators
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { chosenFigure } from "../shared/counting.ts";
import { fracTex, fractionLine, ratTex, slash } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y3-FR-03",
  version: "1.1.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.NUMBERLINE.COUNT-TICKS"],

  params(rng, numbers) {
    const d = rng.pick(
      numbers === "friendly"
        ? [2, 3, 4]
        : numbers === "standard"
          ? [3, 4, 5, 6, 8]
          : [5, 6, 7, 8, 10],
    );
    return { n: rng.int(1, d - 1), d };
  },

  build(p, depth, rng): QuestionDraft {
    const v = frac(p.n, p.d);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `The line from 0 to 1 is split into ${p.d} equal parts.`,
            A.figure(fractionLine(p.n / p.d, p.d)),
          ],
          ask: "What fraction is the arrow pointing to?",
          answer: A.exact(v),
          wrong: [
            {
              code: "NPV.NUMBERLINE.COUNT-TICKS",
              value: A.exact(fracTex(p.n, p.d + 1)),
              feedback: `Count the spaces between the marks, not the marks: there are ${p.d} equal parts.`,
            },
          ],
          solution: [
            {
              say: `Each part is ${slash(1, p.d)}. The arrow is ${p.n} part${p.n === 1 ? "" : "s"} along, so it points to ${slash(p.n, p.d)}.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which number line shows ", A.math(fracTex(p.n, p.d)), "?"],
          correct: fractionLine(p.n / p.d, p.d),
          distractors: [
            {
              figure: fractionLine(p.n / (p.d + 1), p.d + 1),
              code: "NPV.NUMBERLINE.COUNT-TICKS",
              feedback: `That line has ${p.d + 1} parts, so the arrow is at ${slash(p.n, p.d + 1)}.`,
            },
            // Counted from the wrong end; for a half-way fraction, one part too far instead.
            p.d - p.n !== p.n
              ? {
                  figure: fractionLine((p.d - p.n) / p.d, p.d),
                  feedback: `That arrow is at ${slash(p.d - p.n, p.d)}: count from 0.`,
                }
              : {
                  figure: fractionLine((p.n + 1) / p.d, p.d),
                  feedback: `That arrow is at ${slash(p.n + 1, p.d)}: count the parts from 0.`,
                },
          ],
          solution: [{ say: `Split 0 to 1 into ${p.d} equal parts and count ${p.n} along.` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Noah says ", A.math(fracTex(p.n, p.d)), " is a number between 0 and 1."],
              truth: true,
              reasons: [
                {
                  text: `True. ${slash(p.n, p.d)} is ${p.n} of ${p.d} equal parts of 1, so it is more than 0 and less than 1.`,
                  correct: true,
                },
                { text: "False. Fractions are not numbers, so they are not on the number line." },
                {
                  text: `False. It is bigger than ${p.n}, because it has a ${p.d} in it.`,
                  code: "NPV.NUMBERLINE.COUNT-TICKS",
                },
              ],
              solution: [
                {
                  say: `${slash(p.n, p.d)} sits ${p.n} part${p.n === 1 ? "" : "s"} along a line from 0 to 1 split into ${p.d}.`,
                },
              ],
            }),
          [
            {
              claim: "A fraction with the same number on the top and the bottom is 1 whole.",
              truth: "always",
              right: "Always. 4/4 means all 4 of 4 equal parts: the whole thing.",
              wrong: [
                ["Never. It is 0.", "NPV.NUMBERLINE.COUNT-TICKS"],
                ["Sometimes. Only for halves."],
              ],
            },
            {
              statement:
                "On a number line from 0 to 1 split into quarters, Ben says the first mark after 0 is 1/4.",
              truth: true,
              right: "True. The line is in 4 equal parts, and the first part ends at 1/4.",
              wrong: [
                ["False. It is 1/5, as there are 5 marks.", "NPV.NUMBERLINE.COUNT-TICKS"],
                ["False. It is 1."],
              ],
            },
            {
              statement: "Mia says 5/4 is between 0 and 1.",
              truth: false,
              right: "False. 5/4 is more than 4/4, which is 1, so it is past 1.",
              wrong: [
                ["True. All fractions are between 0 and 1.", "NPV.NUMBERLINE.COUNT-TICKS"],
                ["True. Quarters are small."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const a = question.parts[0]?.answer;
      return a?.type === "exact" && String(a.value) === ratTex(frac(p.n, p.d));
    }
    if (question.archetype === "choose-the-diagram") {
      const line = chosenFigure(question) as NumberLineSpec | undefined;
      return Math.abs((line?.points?.[0]?.value ?? -1) - p.n / p.d) < 1e-9 && line?.minor === p.d;
    }
    return true;
  },
});
