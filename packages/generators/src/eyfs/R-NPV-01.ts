/**
 * @statement R-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-01: Count objects, actions and sounds
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CounterShape } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { countOf, numberAnswer, objects, SHAPE_PLURAL, SHAPES } from "../shared/counting.ts";

interface Params {
  n: number;
  shape: CounterShape;
  seed: number;
  sound: "clap" | "beep" | "jump" | "knock";
}

const plural = (word: string, n: number) => (n === 1 ? word : `${word}s`);

export default defineGenerator<Params>({
  id: "R-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(3, 6)
          : numbers === "standard"
            ? rng.int(5, 10)
            : rng.int(8, 12),
      shape: rng.pick(SHAPES),
      seed: rng.int(0, 999),
      sound: rng.pick(["clap", "beep", "jump", "knock"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const what = SHAPE_PLURAL[p.shape];
    const wrong = wrongs(p.n, [
      {
        code: "NPV.COUNT.SKIP-OR-DOUBLE",
        value: A.number(p.n + 1),
        feedback: "Count again, and say just one number for each one.",
      },
      {
        code: "NPV.COUNT.SKIP-OR-DOUBLE",
        value: A.number(p.n - 1),
        feedback: "Count again: it is easy to miss one out.",
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Count the ${what}.`,
            A.figure(
              objects(p.n, { shape: p.shape, arrangement: "scatter", seed: p.seed, hidden: true }),
            ),
          ],
          ask: `How many ${what} are there?`,
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `Touch each one once as you count. There are ${p.n}.` }],
        });
      case 2: {
        const sounds = Array.from({ length: p.n }, () => p.sound).join(", ");
        return A.variedForm({
          rng,
          forms: [
            { question: `Listen and count: ${sounds}.`, ask: `How many ${plural(p.sound, 2)}?` },
            {
              question: `A frog does some jumps. Count them with your finger: ${Array.from({ length: p.n }, () => "jump").join(", ")}.`,
              ask: "How many jumps?",
            },
          ],
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `Say one number for each: there are ${p.n}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Zara counts these ${what} and gets ${p.n + 1}.`,
            A.figure(
              objects(p.n, { shape: p.shape, arrangement: "scatter", seed: p.seed, hidden: true }),
            ),
          ],
          truth: false,
          reasons: [
            { text: `There are ${p.n}. She counted one of them twice.`, correct: true },
            {
              text: "When they are mixed up you can count some twice, so her answer is fine.",
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
            },
            { text: "She should have counted the gaps as well." },
          ],
          solution: [{ say: `Count each one once, perhaps crossing them off: there are ${p.n}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form") return numberAnswer(question) === p.n;
    if (question.archetype === "true-or-false-why") return countOf(question.diagrams[0]) === p.n;
    return numberAnswer(question) === countOf(question.diagrams[0]);
  },
});
