/**
 * @statement Y9-ALG-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-08: Recognise geometric sequences and appreciate other sequences that arise, e.g. Fibonacci,
// square and triangular numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Kind = "geometric" | "fibonacci" | "square" | "triangular";

interface Params {
  first: number;
  ratio: number;
  kind: Kind;
  /** Fibonacci-type start. */
  f1: number;
  f2: number;
}

const sequence = (p: Params, kind: Kind): number[] => {
  switch (kind) {
    case "geometric":
      return [0, 1, 2, 3].map((k) => p.first * p.ratio ** k);
    case "fibonacci": {
      const s = [p.f1, p.f2];
      while (s.length < 5) s.push((s.at(-1) ?? 0) + (s.at(-2) ?? 0));
      return s;
    }
    case "square":
      return [1, 4, 9, 16, 25];
    case "triangular":
      return [1, 3, 6, 10, 15];
  }
};
const NAMES: Record<Kind, string> = {
  geometric: "geometric",
  fibonacci: "Fibonacci-type",
  square: "square numbers",
  triangular: "triangular numbers",
};

export default defineGenerator<Params>({
  id: "Y9-ALG-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng, numbers) {
    const first = rng.int(1, 5);
    const ratio = rng.int(2, numbers === "friendly" ? 3 : 5);
    const [f1, f2] = [rng.int(1, 5), rng.int(2, 7)];
    if (f1 === f2) reject("a Fibonacci-type start with different terms");
    return {
      first,
      ratio,
      kind: rng.pick(["geometric", "fibonacci", "square", "triangular"] as const),
      f1,
      f2,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = sequence(p, "geometric");
        const next = (s.at(-1) ?? 0) * p.ratio;
        const added = (s.at(-1) ?? 0) + ((s.at(-1) ?? 0) - (s.at(-2) ?? 0));
        return A.standard({
          question: `Here is a geometric sequence: ${s.join(", ")}, …`,
          ask: "What is the next term?",
          answer: A.number(next),
          wrong: wrongs(next, [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number(added),
              feedback: `Each term is ${p.ratio} times the one before, so multiply by ${p.ratio} rather than adding the last difference.`,
            },
          ]),
          solution: [
            { say: `Each term is multiplied by ${p.ratio}: ${s.at(-1)} × ${p.ratio} = ${next}.` },
          ],
        });
      }
      case 2: {
        const s = sequence(p, p.kind);
        const shown = p.kind === "fibonacci" ? s : s.slice(0, 4);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Here is a sequence: ${shown.join(", ")}, …`,
          ask: "What kind of sequence is it?",
          correct: NAMES[p.kind],
          distractors: (["geometric", "fibonacci", "square", "triangular"] as const)
            .filter((k) => k !== p.kind)
            .map((k) => ({
              content: NAMES[k],
              ...(k === "geometric" ? {} : {}),
              feedback: `Check how each term is made from the ones before.`,
            })),
          solution: [
            {
              say: {
                geometric: `Each term is ${p.ratio} times the last.`,
                fibonacci: "Each term is the sum of the two before it.",
                square: "They are 1², 2², 3², 4², …",
                triangular: "They go up by 2, 3, 4, …: 1, 1 + 2, 1 + 2 + 3, …",
              }[p.kind],
            },
          ],
        });
      }
      default: {
        const s = sequence(p, "geometric");
        return A.trueOrFalseWhy({
          rng,
          statement: `Ola says ${s.join(", ")}, … is an arithmetic sequence that goes up by ${(s[1] ?? 0) - (s[0] ?? 0)}.`,
          truth: false,
          reasons: [
            {
              text: `False. The differences are ${s
                .slice(1)
                .map((v, i) => v - (s[i] ?? 0))
                .join(
                  ", ",
                )}: they are not the same. Each term is ${p.ratio} times the one before, so it is geometric.`,
              correct: true,
            },
            {
              text: "True. Look at the first two terms: that gives the difference.",
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
            },
            { text: "True. Every sequence that goes up is arithmetic." },
          ],
          solution: [
            {
              say: `Arithmetic sequences add the same amount; geometric ones multiply by the same amount (here × ${p.ratio}).`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.first * p.ratio ** 4;
    if (question.archetype === "varied-form") return chosenText(question) === NAMES[p.kind];
    return true;
  },
});
