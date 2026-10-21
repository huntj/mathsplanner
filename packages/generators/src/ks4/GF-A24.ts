/**
 * @statement GF-A24
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A24: Recognise and use sequences of triangular, square and cube numbers, simple arithmetic
// progressions, Fibonacci-type sequences, quadratic sequences, and simple geometric progressions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  kind: number;
  a: number;
  b: number;
  claim: number;
}

const TYPES = [
  "arithmetic",
  "geometric",
  "Fibonacci-type",
  "square numbers",
  "triangular numbers",
  "cube numbers",
] as const;
function terms(kind: number, a: number, b: number): number[] {
  switch (kind) {
    case 0:
      return [0, 1, 2, 3, 4].map((i) => a + i * b);
    case 1:
      return [0, 1, 2, 3, 4].map((i) => a * b ** i);
    case 2: {
      const t = [a, b];
      for (let i = 2; i < 6; i++) t.push((t[i - 1] as number) + (t[i - 2] as number));
      return t.slice(0, 5);
    }
    case 3:
      return [1, 2, 3, 4, 5].map((n) => n * n);
    case 4:
      return [1, 2, 3, 4, 5].map((n) => (n * (n + 1)) / 2);
    default:
      return [1, 2, 3, 4, 5].map((n) => n ** 3);
  }
}
const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "1, 4, 9, 16, … is an arithmetic sequence.",
    truth: false,
    why: "The differences are 3, 5, 7: not constant. These are the square numbers.",
  },
  {
    text: "3, 6, 12, 24, … is a geometric sequence.",
    truth: true,
    why: "Each term is the one before multiplied by 2.",
  },
  {
    text: "2, 3, 5, 8, 13, … is a Fibonacci-type sequence.",
    truth: true,
    why: "Each term is the sum of the two before it.",
  },
  {
    text: "1, 3, 6, 10, … goes up by 2 each time.",
    truth: false,
    why: "The differences are 2, 3, 4: these are the triangular numbers.",
  },
];

export default defineGenerator<Params>({
  id: "GF-A24",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE", "ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng) {
    return {
      kind: rng.int(0, TYPES.length - 1),
      a: rng.int(2, 6),
      b: rng.int(2, 4),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const t = terms(p.kind, p.a, p.b);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Here is a sequence: ${t.slice(0, 4).join(", ")}, …`,
          ask: "What type of sequence is it?",
          correct: TYPES[p.kind] ?? "",
          distractors: rng
            .shuffle(TYPES.filter((x) => x !== TYPES[p.kind]))
            .slice(0, 3)
            .map((x) => ({
              content: x,
              code: "ALG.SEQUENCE.TYPE",
              feedback:
                "Look at the differences, the ratios, or how each term relates to the two before it.",
            })),
          solution: [{ say: `It is a sequence of ${TYPES[p.kind]}.` }],
        });
      case 2: {
        const next = terms(p.kind, p.a, p.b)[4] as number;
        const t3 = t[3] as number;
        const t2 = t[2] as number;
        return A.standard({
          question: `Here is a sequence: ${t.slice(0, 4).join(", ")}, …`,
          ask: "What is the next term?",
          answer: A.number(next),
          wrong: wrongs(next, [
            {
              code: p.kind === 1 ? "ALG.SEQUENCE.GEOMETRIC-ADD" : "ALG.SEQUENCE.TYPE",
              value: A.number(t3 + (t3 - t2)),
              feedback:
                p.kind === 0
                  ? "Check the difference."
                  : "The differences are not constant: find the pattern first.",
            },
          ]),
          solution: [{ say: `The next term is ${next}.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Mia says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Every sequence that goes up is arithmetic.`,
              code: "ALG.SEQUENCE.TYPE",
            },
            {
              text: `${c.truth ? "False" : "True"}. Geometric sequences add the same amount each time.`,
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
            },
          ],
          solution: [
            {
              say: "Arithmetic: same difference. Geometric: same ratio. Fibonacci-type: add the previous two.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const t = terms(p.kind, p.a, p.b);
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === t[4];
    if (question.archetype === "standard") return chosenText(question) === TYPES[p.kind];
    return true;
  },
});
