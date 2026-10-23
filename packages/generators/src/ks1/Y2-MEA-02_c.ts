/**
 * @statement Y2-MEA-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-MEA-02.c: Compare and order volumes and capacities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  /** Three capacities in ml made from the same two digits, e.g. 35, 53 and 305. */
  caps: [number, number, number];
  ml: number;
}

const sign = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

export default defineGenerator<Params>({
  id: "Y2-MEA-02.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.COMPARE.ONES-FIRST", "MEA.UNITS.MIXED"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 50 : 100;
    const a = rng.int(10, top);
    const b = rng.bool(0.25) ? a : rng.int(10, top);
    const x = rng.int(1, 9);
    const y = rng.int(1, 9);
    if (x === y) reject("two different digits");
    const caps = rng.shuffle([
      10 * x + y,
      10 * y + x,
      numbers === "friendly" ? 10 * Math.max(x, y) + 9 : 100 * x + y,
    ]) as [number, number, number];
    if (new Set(caps).size < 3) reject("three different capacities");
    return { a, b, caps, ml: rng.pick([200, 500, 700, 900]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = sign(p.a, p.b);
        const flipped = s === "<" ? ">" : s === ">" ? "<" : undefined;
        return A.choice({
          rng,
          question: [
            "Which sign makes this true?",
            A.displayMath(`${p.a}\\text{ ml}\\ \\square\\ ${p.b}\\text{ ml}`),
          ],
          correct: A.math(s),
          distractors: (["<", ">", "="] as const)
            .filter((o) => o !== s)
            .map((o) => ({
              content: A.math(o),
              ...(o === flipped ? { code: "NPV.COMPARE.SIGN-DIRECTION" } : {}),
              feedback:
                s === "="
                  ? "The two amounts are the same, so use =."
                  : `The sign opens towards the bigger amount: ${Math.max(p.a, p.b)} ml.`,
            })),
          solution: [{ say: `${p.a} ml ${s} ${p.b} ml.` }],
        });
      }
      case 2: {
        const most = Math.max(...p.caps);
        const trap = [...p.caps].sort((m, n) => (m % 10) - (n % 10)).pop() ?? most;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Three bottles hold ${p.caps.map((c) => `${c} ml`).join(", ")}.`,
          ask: "Which bottle holds the most?",
          correct: `${most} ml`,
          distractors: p.caps
            .filter((c) => c !== most)
            .map((c) =>
              c === trap
                ? {
                    content: `${c} ml`,
                    code: "NPV.COMPARE.ONES-FIRST",
                    feedback: "Compare the biggest place value first, not the ones digits.",
                  }
                : { content: `${c} ml`, feedback: `${most} ml is more than ${c} ml.` },
            ),
          solution: [
            {
              say: `Compare the hundreds, then the tens: ${[...p.caps].sort((m, n) => n - m).join(" ml, ")} ml.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Jo says a ${p.ml} ml bottle holds more than a 1 litre jug, because ${p.ml} is bigger than 1.`,
          truth: false,
          reasons: [
            { text: `False. 1 litre is 1000 ml, which is more than ${p.ml} ml.`, correct: true },
            { text: "True. The bigger number always holds more.", code: "MEA.UNITS.MIXED" },
            { text: "True. Bottles hold more than jugs." },
          ],
          solution: [{ say: `Use the same units: 1 litre = 1000 ml, and 1000 ml > ${p.ml} ml.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === sign(p.a, p.b);
    if (question.key.depth === 2) return chosenText(question) === `${Math.max(...p.caps)} ml`;
    return true;
  },
});
