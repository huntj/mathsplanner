/**
 * @statement Y1-NPV-04.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-04.c: Use equal to, more than, less than, most and least
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** A has more tens but fewer ones than B. */
  a: number;
  b: number;
  swap: boolean;
  equal: boolean;
  three: [number, number, number];
  most: boolean;
}

const NAMES = ["Kit", "Ash", "Bo"];

export default defineGenerator<Params>({
  id: "Y1-NPV-04.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.ONES-FIRST", "NPV.COMPARE.SPREAD"],

  params(rng, numbers) {
    const t = rng.int(2, numbers === "friendly" ? 4 : 9);
    const a = t * 10 + rng.int(0, 4);
    const b = (t - 1) * 10 + rng.int(5, 9);
    const three = rng.shuffle([rng.int(3, 6), rng.int(8, 10), rng.int(12, 15)]) as [
      number,
      number,
      number,
    ];
    if (a === b) reject("different numbers");
    return { a, b, swap: rng.bool(), equal: rng.bool(0.25), three, most: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y] = p.swap ? [p.b, p.a] : [p.a, p.b];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which number is more: ${x} or ${y}?`],
          correct: String(p.a),
          distractors: [
            {
              content: String(p.b),
              code: "NPV.COMPARE.ONES-FIRST",
              feedback: `Compare the tens first: ${p.a} has ${Math.floor(p.a / 10)} tens and ${p.b} has ${Math.floor(p.b / 10)} tens.`,
            },
          ],
          solution: [{ say: `${p.a} has more tens, so ${p.a} is more than ${p.b}.` }],
        });
      case 2: {
        const right = p.equal ? "equal to" : x > y ? "more than" : "less than";
        const second = p.equal ? x : y;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Fill the gap: ${x} is ____ ${second}.`],
          correct: right,
          distractors: ["equal to", "more than", "less than"]
            .filter((w) => w !== right)
            .map((w) => ({
              content: w,
              ...(w !== "equal to" && !p.equal
                ? {
                    code: "NPV.COMPARE.ONES-FIRST",
                    feedback: "Look at the tens digits first. The number with more tens is more.",
                  }
                : {
                    feedback: p.equal
                      ? "The two numbers are the same."
                      : "The numbers are different.",
                  }),
            })),
          solution: [{ say: `${x} is ${right} ${second}.` }],
        });
      }
      default: {
        const big = Math.max(...p.three);
        const small = Math.min(...p.three);
        const target = p.most ? big : small;
        const wrong = p.most ? small : big;
        const who = (v: number) => NAMES[p.three.indexOf(v)] ?? "";
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: `${NAMES[0]} has ${p.three[0]} shells, ${NAMES[1]} has ${p.three[1]} and ${NAMES[2]} has ${p.three[2]}. ${who(wrong)} spreads the shells out in a long line and says, "I have the ${p.most ? "most" : "least"}."`,
              truth: false,
              reasons: [
                {
                  text: `False. ${who(target)} has the ${p.most ? "most" : "least"}: ${target}. Spreading shells out does not change how many there are.`,
                  correct: true,
                },
                { text: "True. The longest line has the most.", code: "NPV.COMPARE.SPREAD" },
                { text: `True. ${who(wrong)} can see more shells.`, code: "NPV.COMPARE.SPREAD" },
              ],
              solution: [
                {
                  say: `In order: ${[...p.three].sort((m, n) => m - n).join(", ")}. The most is ${big} and the least is ${small}.`,
                },
              ],
            }),
          [
            {
              statement: "Sam has 8 marbles and Kim has 5. Sam says he has more.",
              truth: true,
              right: "True. 8 is more than 5.",
              wrong: [
                ["False. Kim has more.", "NPV.COMPARE.ONES-FIRST"],
                ["False. They have the same."],
              ],
            },
            {
              claim: "Spreading counters out makes more of them.",
              truth: "never",
              right: "Never. Moving counters does not change how many there are.",
              wrong: [
                ["Always. A longer line has more.", "NPV.COMPARE.SPREAD"],
                ["Sometimes. If you spread them a lot.", "NPV.COMPARE.SPREAD"],
              ],
            },
            {
              statement: "Ana has 12 stickers and Ben has 21. Ana says she has the most.",
              truth: false,
              right: "False. 21 has 2 tens and 12 has 1 ten, so Ben has more.",
              wrong: [
                ["True. 2 is bigger than 1.", "NPV.COMPARE.ONES-FIRST"],
                ["True. Her stickers are spread out.", "NPV.COMPARE.SPREAD"],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === String(Math.max(p.a, p.b));
    if (question.key.depth === 2) {
      const [x, y] = p.swap ? [p.b, p.a] : [p.a, p.b];
      return chosenText(question) === (p.equal ? "equal to" : x > y ? "more than" : "less than");
    }
    return true;
  },
});
