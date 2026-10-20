/**
 * @statement R-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-05: Compare numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenFigure, chosenText, countOf, tenFrames } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  ask: "bigger" | "smaller";
}

export default defineGenerator<Params>({
  id: "R-NPV-05",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COMPARE.SPREAD"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : 10;
    const a = rng.int(1, top);
    const b = rng.int(1, top);
    if (a === b || (numbers === "stretch" && Math.abs(a - b) > 2))
      reject("numbers must differ, by a little at stretch");
    return { a, b, ask: rng.pick(["bigger", "smaller"] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const want = p.ask === "bigger" ? Math.max(p.a, p.b) : Math.min(p.a, p.b);
    const other = want === p.a ? p.b : p.a;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [A.math(`${p.a} \\quad ${p.b}`)],
          ask: `Which number is ${p.ask}?`,
          correct: A.math(String(want)),
          distractors: [
            {
              content: A.math(String(other)),
              feedback: `Count to both: you say ${Math.min(p.a, p.b)} before ${Math.max(p.a, p.b)}, so ${Math.max(p.a, p.b)} is bigger.`,
            },
          ],
          solution: [
            {
              say: `When we count, ${Math.min(p.a, p.b)} comes before ${Math.max(p.a, p.b)}, so ${Math.max(p.a, p.b)} is bigger and ${Math.min(p.a, p.b)} is smaller.`,
            },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: `Which ten frame shows the ${p.ask} number?`,
          ask: "Choose the ten frame.",
          correct: tenFrames(want, { hidden: true }),
          distractors: [
            { figure: tenFrames(other, { hidden: true }), feedback: `That one shows ${other}.` },
          ],
          solution: [{ say: `One frame shows ${p.a} and the other ${p.b}. ${want} is ${p.ask}.` }],
        });
      default: {
        const big = Math.max(p.a, p.b);
        const small = Math.min(p.a, p.b);
        return A.trueOrFalseWhy({
          rng,
          statement: `Tia says ${small} is bigger than ${big}, because ${small} comes first when you count.`,
          truth: false,
          reasons: [
            {
              text: `Numbers get bigger as you count on, so ${big}, which comes later, is bigger.`,
              correct: true,
            },
            { text: "Numbers that come first are always bigger." },
            {
              text: `${small} must be bigger if it takes up more space.`,
              code: "NPV.COMPARE.SPREAD",
            },
          ],
          solution: [
            { say: `Counting goes up: ${small} comes before ${big}, so ${big} is bigger.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const want = p.ask === "bigger" ? Math.max(p.a, p.b) : Math.min(p.a, p.b);
    if (question.archetype === "standard") return chosenText(question) === String(want);
    if (question.archetype === "choose-the-diagram")
      return countOf(chosenFigure(question)) === want;
    return p.a !== p.b;
  },
});
