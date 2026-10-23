/**
 * @statement R-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-MEA-01.c: Compare capacities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ScaleSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

const jug = (level: number): ScaleSpec => ({
  type: "measure",
  instrument: "jug",
  max: 10,
  step: 10,
  reading: level,
  unit: "\\text{cups}",
  description: "A jug with some water in it.",
});

interface Params {
  a: number;
  b: number;
  cups: number;
}

export default defineGenerator<Params>({
  id: "R-MEA-01.c",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    const p = { a: rng.int(2, 9), b: rng.int(2, 9), cups: rng.int(3, 8) };
    if (Math.abs(p.a - p.b) < 2) reject("jugs that differ clearly");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Jug A fills ${p.a} cups. Jug B fills ${p.b} cups.`],
          ask: "Which jug holds more?",
          correct: p.a > p.b ? "Jug A" : "Jug B",
          distractors: [
            {
              content: p.a > p.b ? "Jug B" : "Jug A",
              code: "MEA.COMPARE.LOOKS",
              feedback: "The jug that fills more cups holds more.",
            },
            { content: "They hold the same", feedback: "They fill different numbers of cups." },
          ],
          solution: [
            { say: `${Math.max(p.a, p.b)} cups is more than ${Math.min(p.a, p.b)} cups.` },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which jug is about half full?"],
          correct: jug(5),
          distractors: [
            {
              figure: jug(p.a > 6 ? p.a : 9),
              code: "MEA.COMPARE.LOOKS",
              feedback: "That jug is nearly full. Half full means the water is halfway up.",
            },
            { figure: jug(1), feedback: "That jug is nearly empty." },
          ],
          solution: [{ say: "Half full: the water reaches halfway up." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Ben pours all the water from a full cup into an empty bowl. He says there is less water now, because it does not look as deep.`,
          truth: false,
          reasons: [
            {
              text: "False. Pouring does not change how much water there is. It looks shallower because the bowl is wider.",
              correct: true,
            },
            { text: "True. Shallower water means less water.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. Some water disappears when you pour it.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [
            { say: "The amount stays the same when you pour it into a different container." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === (p.a > p.b ? "Jug A" : "Jug B");
    if (question.key.depth === 3)
      return (chosenFigure(question) as ScaleSpec | undefined)?.reading === 5;
    return true;
  },
});
