/**
 * @statement Y8-ALG-09
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-09: Recognise arithmetic sequences and find the nth term
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { poly } from "../shared/alg.ts";

interface Params {
  d: number;
  first: number;
  /** Depth 2: a value to test, in or out of the sequence. */
  test: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-09",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng, numbers) {
    const d = rng.int(2, 9) * (numbers === "stretch" && rng.bool() ? -1 : 1);
    const first = rng.int(-5, 15) + (d < 0 ? 40 : 0);
    if (first === d || first - d === 0 || first === 0)
      reject("a constant that is not zero and differs from the slips");
    const n = rng.int(10, 40);
    return { d, first, test: first + (n - 1) * d + (rng.bool() ? 0 : rng.int(1, Math.abs(d) - 1)) };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.first - p.d;
    const nth = poly([p.d, c], "n");
    const shown = [0, 1, 2, 3].map((k) => p.first + k * p.d).join(", ");
    const how = `The terms go ${p.d > 0 ? "up" : "down"} by ${Math.abs(p.d)}, so the rule starts ${p.d}n. When n = 1, ${p.d}n = ${p.d}, but the first term is ${p.first}: ${c < 0 ? "subtract" : "add"} ${Math.abs(c)}. The nth term is ${nth}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Here is an arithmetic sequence: ${shown}, …`,
          ask: "Find an expression for the nth term.",
          answer: A.exact(nth),
          wrong: [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.exact(poly([1, p.d], "n")),
              feedback: `The difference, ${p.d}, multiplies n: the rule starts ${p.d}n.`,
            },
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.exact(poly([p.d, p.first], "n")),
              feedback: `${p.d}n + ${p.first} gives ${p.d + p.first} for the first term. Adjust so n = 1 gives ${p.first}.`,
            },
          ].filter((w) => w.value.kind === "exact" && w.value.value !== nth),
          solution: [{ say: how }],
        });
      case 2: {
        const inIt = (p.test - c) % p.d === 0 && (p.test - c) / p.d >= 1;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Here is an arithmetic sequence: ${shown}, …`,
          ask: `Is ${p.test} a term in the sequence?`,
          correct: inIt ? `Yes, it is term ${(p.test - c) / p.d}` : "No",
          distractors: inIt
            ? [
                {
                  content: "No",
                  feedback: `Solve ${nth} = ${p.test}: n = ${(p.test - c) / p.d}, a whole number.`,
                },
              ]
            : [
                {
                  content: `Yes, it is term ${Math.round((p.test - c) / p.d)}`,
                  code: "ALG.SEQUENCE.POSITION-RULE",
                  feedback: `Solve ${nth} = ${p.test}: n = ${((p.test - c) / p.d).toFixed(2)}, which is not a whole number.`,
                },
              ],
          solution: [
            {
              say: `The nth term is ${nth}. ${nth} = ${p.test} gives n = ${((p.test - c) / p.d).toFixed(2).replace(/\.00$/, "")}${inIt ? ", a whole number, so it is a term." : ", not a whole number, so it is not a term."}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Max says the nth term of ${shown}, … is `,
            A.math(poly([1, p.d], "n")),
            `, because it goes up by ${p.d}.`,
          ],
          truth: false,
          reasons: [
            { text: `False. ${poly([1, p.d], "n")} goes up by 1 each time. ${how}`, correct: true },
            {
              text: `True. "Goes up by ${p.d}" means + ${p.d}.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            { text: "True. Every sequence has nth term n plus the difference." },
          ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return a.value === poly([p.d, p.first - p.d], "n");
    if (question.archetype === "varied-form") {
      const c = p.first - p.d;
      const inIt = (p.test - c) % p.d === 0 && (p.test - c) / p.d >= 1;
      return chosenText(question).startsWith(inIt ? "Yes" : "No");
    }
    return true;
  },
});
