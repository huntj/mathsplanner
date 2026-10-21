/**
 * @statement N-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-AS-01: Solve real problems with numbers up to 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, fingers, numberAnswer, objects } from "../shared/counting.ts";

interface Params {
  /** Depth 1 and 3: a and b more. */
  a: number;
  b: number;
  /** Depth 2: start with `have` and take away `away`. */
  have: number;
  away: number;
}

export default defineGenerator<Params>({
  id: "N-AS-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE", "AS.PROBLEM.KEYWORD"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 4 : 5;
    const a = rng.int(1, top - 1);
    const b = rng.int(1, numbers === "stretch" ? top - a : 1);
    const have = rng.int(2, top);
    const away = rng.int(1, have - 1);
    if (a + b > top) reject("numbers up to 5");
    return { a, b, have, away };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.a + p.b;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `There ${p.a === 1 ? "is 1 duck" : `are ${p.a} ducks`} on the pond. ${p.b === 1 ? "1 more comes" : `${p.b} more come`}.`,
            A.figure(objects(total, { second: p.b })),
          ],
          ask: "How many ducks are there now?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(total + 1),
              feedback: "Touch each duck once as you count.",
            },
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(total - 1),
              feedback: "Make sure you count every duck.",
            },
          ]),
          solution: [
            {
              say: `Count them all: ${Array.from({ length: total }, (_, i) => i + 1).join(", ")}. There are ${total} ducks.`,
            },
          ],
        });
      case 2: {
        const left = p.have - p.away;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Hold up ${p.have} fingers. Put ${p.away} down.`,
                A.figure(fingers(p.have)),
              ],
              ask: "How many fingers are still up?",
            },
            {
              question: [
                `There are ${p.have} biscuits. You eat ${p.away}.`,
                A.figure(objects(p.have, { shape: "circle" })),
              ],
              ask: "How many biscuits are left?",
            },
          ],
          answer: A.number(left),
          wrong: wrongs(left, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.have + p.away),
              feedback: "Some are taken away, so there are fewer than before.",
            },
          ]),
          solution: [
            { say: `Start with ${p.have} and take away ${p.away}. Count what is left: ${left}.` },
          ],
        });
      }
      default:
        return A.chooseTheDiagram({
          rng,
          question: `Kit has ${p.a} ${p.a === 1 ? "car" : "cars"}. Then Kit gets ${p.b} more.`,
          ask: "Which picture shows all of Kit's cars?",
          correct: objects(total, { shape: "square", hidden: true }),
          distractors: [total - 1, total + 1]
            .filter((n) => n >= 1)
            .map((n) => ({
              figure: objects(n, { shape: "square", hidden: true }),
              feedback: `That picture has ${n}. Kit has ${p.a} and ${p.b} more, which is ${total}.`,
            })),
          solution: [{ say: `${p.a} and ${p.b} more makes ${total}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram")
      return countOf(chosenFigure(question)) === p.a + p.b;
    if (question.archetype === "standard")
      return numberAnswer(question) === countOf(question.diagrams[0]);
    return numberAnswer(question) === p.have - p.away;
  },
});
