/**
 * @statement Y7-RAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-RAT-02: Use ratio notation, including reduction to simplest form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  g: number;
  /** Subtracted from both parts in the slip. */
  s: number;
  claimTrue: boolean;
}

const ratio = (x: number, y: number) => `${x}:${y}`;

export default defineGenerator<Params>({
  id: "Y7-RAT-02",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.SIMPLIFY.SUBTRACT", "RAT.ORDER"],

  params(rng, numbers) {
    const a = rng.int(1, numbers === "friendly" ? 5 : 9);
    const b = rng.int(2, numbers === "friendly" ? 6 : 11);
    const g = rng.pick(numbers === "friendly" ? [2, 3, 5] : [4, 6, 8, 9, 12]);
    const s = rng.int(1, a * g - 1);
    if (a === b || gcdOf(a, b) !== 1) reject("a ratio already in lowest terms");
    if ((a * g - s) * b === (b * g - s) * a) reject("the slip must change the ratio");
    return { a, b, g, s, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [A0, B0] = [p.a * p.g, p.b * p.g];
    const how = `The highest common factor of ${A0} and ${B0} is ${p.g}. Divide both parts by ${p.g}: ${A0}:${B0} = ${p.a}:${p.b}.`;
    const half = [2, 3].find((h) => p.g % h === 0 && h < p.g);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Write ", A.math(ratio(A0, B0)), " in its simplest form."],
          correct: A.math(ratio(p.a, p.b)),
          distractors: [
            {
              content: A.math(ratio(A0 - p.s, B0 - p.s)),
              code: "RAT.SIMPLIFY.SUBTRACT",
              feedback:
                "Subtracting the same number from both parts changes the ratio. Divide by a common factor instead.",
            },
            {
              content: A.math(ratio(p.b, p.a)),
              code: "RAT.ORDER",
              feedback: "Keep the parts in the same order.",
            },
            ...(half
              ? [
                  {
                    content: A.math(ratio(A0 / half, B0 / half)),
                    feedback: `That is equivalent, but both parts can still be divided by ${p.g / half}.`,
                  },
                ]
              : []),
          ],
          solution: [{ say: how }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A club has ${A0} boys and ${B0} girls.`,
          ask: "What is the ratio of girls to boys in its simplest form?",
          correct: A.math(ratio(p.b, p.a)),
          distractors: [
            {
              content: A.math(ratio(p.a, p.b)),
              code: "RAT.ORDER",
              feedback: "The question asks for girls to boys, so the girls come first.",
            },
            {
              content: A.math(ratio(B0, A0)),
              feedback: `That is the right order, but both parts can be divided by ${p.g}.`,
            },
            {
              content: A.math(ratio(B0 - p.s, A0 - p.s)),
              code: "RAT.SIMPLIFY.SUBTRACT",
              feedback: "Subtracting changes the ratio. Divide by a common factor.",
            },
          ].filter(
            (o, i, all) =>
              all.findIndex((x) => JSON.stringify(x.content) === JSON.stringify(o.content)) === i,
          ),
          solution: [{ say: `Girls to boys is ${B0}:${A0}. Divide by ${p.g}: ${p.b}:${p.a}.` }],
        });
      default: {
        const shown = p.claimTrue ? ratio(p.a, p.b) : ratio(A0 - p.s, B0 - p.s);
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Asha says ",
                A.math(`${ratio(A0, B0)} = ${shown}`),
                p.claimTrue
                  ? `, because she divided both parts by ${p.g}.`
                  : `, because she took ${p.s} from both parts.`,
              ],
              truth: p.claimTrue,
              reasons: p.claimTrue
                ? [
                    { text: `True. ${how}`, correct: true },
                    {
                      text: "False. You simplify a ratio by subtracting, not dividing.",
                      code: "RAT.SIMPLIFY.SUBTRACT",
                    },
                    { text: "False. Ratios cannot be simplified." },
                  ]
                : [
                    { text: `False. Subtracting changes the ratio. ${how}`, correct: true },
                    {
                      text: "True. Doing the same to both parts keeps the ratio the same.",
                      code: "RAT.SIMPLIFY.SUBTRACT",
                    },
                    { text: "True. The numbers are smaller, so it is simpler." },
                  ],
              solution: [{ say: how }],
            }),
          [
            {
              claim:
                "Multiplying both parts of a ratio by the same number, not 0, gives an equivalent ratio.",
              truth: "always",
              right: "Always. The parts stay in the same proportion: 2 : 3 = 4 : 6 = 20 : 30.",
              wrong: [
                ["Sometimes. Only when you multiply by 2."],
                ["Never. A ratio can only be divided, not multiplied."],
              ],
            },
            {
              statement:
                "Gus says adding 1 to both parts of the ratio 2 : 3 gives an equivalent ratio, 3 : 4.",
              truth: false,
              right:
                "False. In 2 : 3 the first part is 2/3 of the second, but in 3 : 4 it is 3/4. Adding changes a ratio.",
              wrong: [
                [
                  "True. Doing the same to both parts keeps the ratio the same.",
                  "RAT.SIMPLIFY.SUBTRACT",
                ],
                ["True. The difference between the parts is still 1."],
              ],
            },
            {
              statement: "Ben says the ratio 4 : 6 simplifies to 2 : 3.",
              truth: true,
              right: "True. Divide both parts by 2, their highest common factor.",
              wrong: [
                ["False. Take 2 from both parts: 2 : 4.", "RAT.SIMPLIFY.SUBTRACT"],
                ["False. It simplifies to 3 : 2.", "RAT.ORDER"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === ratio(p.a, p.b);
    if (question.archetype === "varied-form") return chosenText(question) === ratio(p.b, p.a);
    return true;
  },
});
