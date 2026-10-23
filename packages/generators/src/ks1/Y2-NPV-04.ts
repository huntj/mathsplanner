/**
 * @statement Y2-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-04: Compare and order numbers from 0 up to 100; use <, > and =
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

export interface Params {
  a: number;
  b: number;
  /** Four numbers to order: their tens digits differ, and ordering by ones digits gives another order. */
  list: number[];
}

const sign = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

export default defineGenerator<Params>({
  id: "Y2-NPV-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.COMPARE.ONES-FIRST"],

  params(rng, numbers) {
    const a = rng.int(10, 99);
    // Sometimes equal; otherwise close, with the ones digits pulling the other way at stretch.
    const b =
      rng.int(0, 5) === 0
        ? a
        : numbers === "stretch"
          ? Math.floor(a / 10) * 10 + 10 + rng.int(0, Math.max(0, (a % 10) - 1))
          : rng.int(10, 99);
    if (b > 99) reject("too big");
    const tens = rng.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
    const list = tens.map((t) => t * 10 + rng.int(0, 9));
    const byOnes = [...list].sort((x, y) => (x % 10) - (y % 10));
    const byValue = [...list].sort((x, y) => x - y);
    if (
      byOnes.join() === byValue.join() ||
      byOnes.join() === [...byValue].reverse().join() ||
      new Set(list.map((v) => v % 10)).size < 4
    )
      reject("ordering by ones must give a different order");
    return { a, b, list };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = sign(p.a, p.b);
        const flipped = right === "<" ? ">" : right === ">" ? "<" : undefined;
        return A.choice({
          rng,
          question: [A.math(`${p.a} \\; \\square \\; ${p.b}`)],
          ask: "Which sign goes in the box?",
          correct: A.math(right),
          distractors: (["<", ">", "="] as const)
            .filter((s) => s !== right)
            .map((s) => ({
              content: A.math(s),
              ...(s === flipped
                ? {
                    code: "NPV.COMPARE.SIGN-DIRECTION",
                    feedback: "The wide, open side of the sign faces the bigger number.",
                  }
                : {
                    feedback: `Compare the tens first: ${Math.floor(p.a / 10)} tens and ${Math.floor(p.b / 10)} tens.`,
                  }),
            })),
          solution: [
            {
              say: `${p.a} ${right === "<" ? "is less than" : right === ">" ? "is greater than" : "equals"} ${p.b}, so ${p.a} ${right} ${p.b}.`,
            },
          ],
        });
      }
      case 2: {
        const byValue = [...p.list].sort((x, y) => x - y);
        const byOnes = [...p.list].sort((x, y) => (x % 10) - (y % 10));
        const reversed = [...byValue].reverse();
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Here are four numbers: ", A.math(p.list.join(",\\ ")), "."],
          ask: "Which list puts them in order, smallest first?",
          correct: byValue.join(", "),
          distractors: [
            {
              content: byOnes.join(", "),
              code: "NPV.COMPARE.ONES-FIRST",
              feedback: "That orders the ones digits. Compare the tens digits first.",
            },
            { content: reversed.join(", "), feedback: "That is largest first." },
          ],
          solution: [{ say: `Look at the tens digits first: ${byValue.join(", ")}.` }],
        });
      }
      default: {
        const big = Math.max(...p.list);
        const small = Math.min(...p.list);
        const trap = Math.floor(small / 10) * 10 + 9;
        const other = Math.floor(big / 10) * 10;
        if (trap >= other) return reject("need a clear trap");
        return A.trueOrFalseWhy({
          rng,
          statement: [A.math(`${trap} > ${other}`), ` because 9 is bigger than 0.`],
          truth: false,
          reasons: [
            {
              text: `Compare the tens first: ${Math.floor(trap / 10)} tens is less than ${Math.floor(other / 10)} tens, so ${trap} < ${other}.`,
              correct: true,
            },
            {
              text: "The number with the bigger ones digit is bigger.",
              code: "NPV.COMPARE.ONES-FIRST",
            },
            {
              text: "The sign is the wrong way round, but the reason is right.",
              code: "NPV.COMPARE.SIGN-DIRECTION",
            },
          ],
          solution: [
            {
              say: `${trap} has ${Math.floor(trap / 10)} tens and ${other} has ${Math.floor(other / 10)} tens, so ${trap} < ${other}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === sign(p.a, p.b);
    if (question.archetype === "varied-form")
      return chosenText(question) === [...p.list].sort((x, y) => x - y).join(", ");
    return true;
  },
});
