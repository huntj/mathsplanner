/**
 * @statement Y7-NPV-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-02.a: Order positive and negative integers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number[];
}

const show = (xs: number[]) => xs.join(", ");

export default defineGenerator<Params>({
  id: "Y7-NPV-02.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.ORDER"],

  params(rng) {
    const p = { n: [-rng.int(1, 15), -rng.int(1, 15), -rng.int(1, 15), rng.int(1, 12)] };
    if (new Set(p.n.map(Math.abs)).size < 4) reject("four numbers of different sizes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const negs = p.n.slice(0, 3);
    switch (depth) {
      case 1: {
        const right = Math.max(...negs);
        return A.choice({
          rng,
          question: [
            `Which of these temperatures is the warmest: ${negs.map((x) => `${x}°C`).join(", ")}?`,
          ],
          correct: `${right}°C`,
          distractors: negs
            .filter((x) => x !== right)
            .map((x) => ({
              content: `${x}°C`,
              code: "NPV.NEGATIVE.ORDER",
              feedback: `${x}°C is further below zero than ${right}°C, so it is colder.`,
            })),
          solution: [{ say: `${right}°C is closest to zero, so it is the warmest.` }],
        });
      }
      case 2: {
        const right = [...p.n].sort((a, b) => a - b);
        const bySize = [...p.n].sort((a, b) => Math.abs(a) - Math.abs(b));
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Write these numbers in order, smallest first: ${show(p.n)}.`],
          correct: A.math(show(right)),
          distractors: [
            {
              content: A.math(show(bySize)),
              code: "NPV.NEGATIVE.ORDER",
              feedback:
                "That orders them by size ignoring the signs. The more negative a number, the smaller it is.",
            },
            { content: A.math(show([...right].reverse())), feedback: "That is largest first." },
          ].filter(distinctFrom(A.math(show(right)))),
          solution: [{ say: "On a number line, from left to right: ", math: show(right) }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A negative number is smaller than a positive number."],
              truth: "always",
              reasons: [
                {
                  text: "Always. Every negative number is to the left of 0 on the number line, and every positive number is to the right.",
                  correct: true,
                },
                {
                  text: `Sometimes. ${Math.min(...negs)} is bigger than ${p.n[3]} because ${Math.abs(Math.min(...negs))} is bigger.`,
                  code: "NPV.NEGATIVE.ORDER",
                },
                {
                  text: "Never. The minus sign does not change the size of a number.",
                  code: "NPV.NEGATIVE.ORDER",
                },
              ],
              solution: [
                {
                  say: "Negative numbers are less than zero; positive numbers are more than zero.",
                },
              ],
            }),
          [
            {
              statement: `Leo says $-${Math.max(Math.abs(p.n[0] ?? 0), Math.abs(p.n[1] ?? 0))}$ is greater than $-${Math.min(Math.abs(p.n[0] ?? 0), Math.abs(p.n[1] ?? 0))}$.`,
              truth: false,
              right: `False. −${Math.max(Math.abs(p.n[0] ?? 0), Math.abs(p.n[1] ?? 0))} is further below zero than −${Math.min(Math.abs(p.n[0] ?? 0), Math.abs(p.n[1] ?? 0))}, so it is smaller.`,
              wrong: [
                [
                  `True. ${Math.max(Math.abs(p.n[0] ?? 0), Math.abs(p.n[1] ?? 0))} is bigger, so the negative is bigger too.`,
                  "NPV.NEGATIVE.ORDER",
                ],
                [
                  "True. Negative numbers get bigger the further they are from zero.",
                  "NPV.NEGATIVE.ORDER",
                ],
              ],
            },
            {
              statement: `Ana says $-${Math.max(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))} < -${Math.min(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))}$.`,
              truth: true,
              right: `True. On a number line −${Math.max(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))} is to the left of −${Math.min(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))}, so it is less.`,
              wrong: [
                [
                  `False. ${Math.max(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))} is bigger, so −${Math.max(Math.abs(p.n[1] ?? 0), Math.abs(p.n[2] ?? 0))} is bigger.`,
                  "NPV.NEGATIVE.ORDER",
                ],
                ["False. Negative numbers cannot be compared."],
              ],
            },
            {
              claim: "The number further from zero is the bigger number.",
              truth: "sometimes",
              right:
                "Sometimes. 8 is further from zero than 3 and is bigger, but −8 is further from zero than −3 and is smaller.",
              wrong: [
                ["Always. Further from zero means bigger.", "NPV.NEGATIVE.ORDER"],
                ["Never. Distance from zero has nothing to do with size."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === `${Math.max(...p.n.slice(0, 3))}°C`;
    if (question.key.depth === 2)
      return chosenText(question) === show([...p.n].sort((a, b) => a - b));
    return true;
  },
});
