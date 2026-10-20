/**
 * @statement R-NPV-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-10: Compare quantities up to 10 in different contexts: greater than, less than, the same as
// (ELG)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import {
  chosenFigure,
  chosenText,
  countOf,
  fingers,
  objects,
  tenFrames,
} from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  seed: number;
}

const relation = (a: number, b: number) =>
  a > b ? "more than" : a < b ? "fewer than" : "the same as";

export default defineGenerator<Params>({
  id: "R-NPV-10",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COMPARE.SPREAD", "NPV.SUBITISE.ARRANGEMENT"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : 10;
    const a = rng.int(1, top);
    // About a third of the time the two groups are the same.
    const b = rng.int(0, 2) === 0 ? a : rng.int(1, top);
    return { a, b, seed: rng.int(0, 999) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = relation(p.a, p.b);
        return A.choice({
          rng,
          question: [
            "Here are some stars.",
            A.figure(objects(p.a, { shape: "star", arrangement: "row", hidden: true })),
            "Here are some counters.",
            A.figure(objects(p.b, { arrangement: "scatter", seed: p.seed, hidden: true })),
          ],
          ask: "Which sentence is true?",
          correct: `The stars are ${right} the counters.`,
          distractors: (["more than", "fewer than", "the same as"] as const)
            .filter((r) => r !== right)
            .map((r) => ({
              content: `The stars are ${r} the counters.`,
              ...(r === "fewer than" && p.a >= p.b
                ? {
                    code: "NPV.COMPARE.SPREAD",
                    feedback:
                      "The counters are spread out, but that does not make more of them. Count both groups.",
                  }
                : { feedback: `Count both: ${p.a} stars and ${p.b} counters.` }),
            })),
          solution: [
            {
              say: `There are ${p.a} stars and ${p.b} counters, so the stars are ${right} the counters.`,
            },
          ],
        });
      }
      case 3: {
        const others = [p.a + 1, p.a - 1, p.a + 2].filter((m) => m >= 1 && m !== p.a).slice(0, 2);
        return A.chooseTheDiagram({
          rng,
          question: ["Here are some fingers.", A.figure(fingers(p.a, true))],
          ask: "Which ten frame shows the same number?",
          correct: tenFrames(p.a, { hidden: true }),
          distractors: others.map((m) => ({
            figure: tenFrames(m, { hidden: true }),
            feedback: `That shows ${m}; the fingers show ${p.a}.`,
          })),
          solution: [
            { say: `The hand shows ${p.a}, and so does the ten frame with ${p.a} counters.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ella says these show the same number.`,
            A.figure(objects(p.a, { arrangement: "row", hidden: true })),
            A.figure(
              objects(p.a, { shape: "star", arrangement: "scatter", seed: p.seed, hidden: true }),
            ),
          ],
          truth: true,
          reasons: [
            { text: `Both have ${p.a}. Shape and spacing do not change how many.`, correct: true },
            {
              text: "The stars are spread out, so there are more of them.",
              code: "NPV.COMPARE.SPREAD",
            },
            {
              text: "They look different, so they must be different numbers.",
              code: "NPV.SUBITISE.ARRANGEMENT",
            },
          ],
          solution: [{ say: `Count both groups: ${p.a} and ${p.a}. They are the same.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        chosenText(question) ===
          `The stars are ${relation(countOf(question.diagrams[0]), countOf(question.diagrams[1]))} the counters.` &&
        countOf(question.diagrams[0]) === p.a
      );
    if (question.archetype === "choose-the-diagram")
      return countOf(chosenFigure(question)) === countOf(question.diagrams[0]);
    return countOf(question.diagrams[0]) === countOf(question.diagrams[1]);
  },
});
