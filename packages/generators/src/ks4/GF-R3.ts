/**
 * @statement GF-R3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R3: Express one quantity as a fraction of another, where the fraction is less than 1 or
// greater than 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  minutes: number;
  hours: number;
  pence: number;
  pounds: number;
  big: number;
  small: number;
}

export default defineGenerator<Params>({
  id: "GF-R3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.FRACTION.UNITS"],

  params(rng) {
    const hours = rng.int(2, 4);
    const minutes = rng.pick([15, 20, 30, 40, 45]);
    const pounds = rng.int(2, 8);
    const pence = rng.int(1, 9) * 20;
    const big = rng.int(5, 12);
    const small = rng.int(2, 9);
    if (pence >= pounds * 100 || big <= small || frac(big, small).isInteger())
      reject("quantities that make sensible fractions");
    return { minutes, hours, pence, pounds, big, small };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = frac(p.minutes, p.hours * 60);
        return A.standard({
          question: `Write ${p.minutes} minutes as a fraction of ${p.hours} hours.`,
          ask: "Give your fraction in its simplest form.",
          answer: A.exact(right, "simplest"),
          wrong: [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.exact(frac(p.minutes, p.hours)),
              feedback: `Change both to minutes first: ${p.hours} hours = ${p.hours * 60} minutes.`,
            },
          ],
          solution: [
            { say: "", math: `\\frac{${p.minutes}}{${p.hours * 60}} = ${toLatex(right)}` },
          ],
        });
      }
      case 2: {
        const right = frac(p.pence, p.pounds * 100);
        return A.reverse({
          question: `Write ${p.pence}p as a fraction of £${p.pounds}.`,
          ask: "Give your fraction in its simplest form.",
          answer: A.exact(right, "simplest"),
          wrong: [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.exact(frac(p.pence, p.pounds)),
              feedback: `£${p.pounds} = ${p.pounds * 100}p. Use the same units.`,
            },
          ],
          solution: [
            { say: "", math: `\\frac{${p.pence}}{${p.pounds * 100}} = ${toLatex(right)}` },
          ],
        });
      }
      default: {
        const right = frac(p.big, p.small);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A red rope is ${p.big} m long and a blue rope is ${p.small} m long. Ella says the red rope is `,
            A.math(toLatex(right)),
            " of the length of the blue rope.",
          ],
          truth: true,
          reasons: [
            {
              text: `True. Red ÷ blue = ${p.big} ÷ ${p.small} = ${toLatex(right).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}. A fraction can be greater than 1.`,
              correct: true,
            },
            { text: "False. A fraction of something must be less than 1." },
            { text: `False. It should be ${p.small}/${p.big}, the smaller over the bigger.` },
          ],
          solution: [{ say: "‘A as a fraction of B’ means A ÷ B, whichever is larger." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.archetype === "standard")
      return a?.type === "exact" && a.value === toLatex(frac(p.minutes, p.hours * 60));
    if (question.archetype === "reverse")
      return a?.type === "exact" && a.value === toLatex(frac(p.pence, p.pounds * 100));
    return true;
  },
});
