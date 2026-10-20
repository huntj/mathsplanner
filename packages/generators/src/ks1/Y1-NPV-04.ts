/**
 * @statement Y1-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-NPV-04: Identify and represent numbers using objects and pictures, including the number line;
// use equal to, more than, less than, most, least
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  n: number;
  set: number[];
  ask: "most" | "least";
  /** Depth 4: the answer, the trap (the best ones digit) and one more, in the order shown. */
  compare: number[];
}

const line = (n: number, top: number): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max: top,
  step: top > 10 ? 5 : 1,
  minor: top > 10 ? 5 : 1,
  points: [{ value: n, style: "arrow" }],
  description: `A number line from 0 to ${top} with an arrow pointing to a number.`,
});

export default defineGenerator<Params>({
  id: "Y1-NPV-04",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.NUMBERLINE.COUNT-TICKS", "NPV.COMPARE.ONES-FIRST"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const n = rng.int(1, top - 1);
    if (top > 10 && n % 5 === 0) reject("labelled numbers are too easy");
    const set = rng.sample(
      Array.from({ length: 10 }, (_, i) => 10 + i),
      3,
    );
    const ask = rng.pick(["most", "least"] as const);
    // The trap has the most extreme ones digit but the wrong tens digit.
    const t = rng.int(2, numbers === "friendly" ? 4 : 8);
    const compare =
      ask === "most"
        ? [t * 10 + rng.int(0, 3), (t - 1) * 10 + rng.int(7, 9), (t - 1) * 10 + rng.int(4, 6)]
        : [(t - 1) * 10 + rng.int(6, 9), t * 10 + rng.int(0, 2), t * 10 + rng.int(4, 5)];
    return { n, set, ask, compare: [...rng.shuffle([...compare]), ...compare.slice(0, 2)] };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const top = p.n > 9 || p.n % 5 !== 0 ? 20 : 10;
        return A.standard({
          question: ["Look at the number line.", A.figure(line(p.n, top))],
          ask: "What number is the arrow pointing to?",
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.NUMBERLINE.COUNT-TICKS",
              value: A.number(p.n + 1),
              feedback: "Count the jumps from 0, not the marks: the first mark is 0.",
            },
          ]),
          solution: [
            { say: `Count on from the nearest labelled number. The arrow points to ${p.n}.` },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each ten frame picture to its number.",
          pairs: p.set.map(
            (m) =>
              [A.figure(tenFrames(m, { hidden: true })), A.math(String(m))] as [
                A.RichInput,
                A.RichInput,
              ],
          ),
          solution: [{ say: "A full ten frame is 10; count on the counters in the second frame." }],
        });
      default: {
        // compare holds the three numbers as shown, then the answer and the trap.
        const shown = p.compare.slice(0, 3);
        const [answer, trap] = [p.compare[3] ?? 0, p.compare[4] ?? 0];
        const sorted = [...shown].sort((a, b) => a - b);
        return A.trueOrFalseWhy({
          rng,
          statement: `Kit has ${shown[0]} sweets, Ash has ${shown[1]} and Bo has ${shown[2]}. Kit says whoever has ${trap} has the ${p.ask}.`,
          truth: false,
          reasons: [
            {
              text: `Compare the tens first: ${answer} is the ${p.ask === "most" ? "greatest" : "smallest"} number.`,
              correct: true,
            },
            {
              text: `${trap} has the ${p.ask === "most" ? "biggest" : "smallest"} ones digit, so it must be the ${p.ask}.`,
              code: "NPV.COMPARE.ONES-FIRST",
            },
            { text: "They are all the same because they all have two digits." },
          ],
          solution: [{ say: `In order: ${sorted.join(", ")}. The ${p.ask} is ${answer}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const arrow = (question.diagrams[0] as NumberLineSpec | undefined)?.points?.[0]?.value;
      return numberAnswer(question) === arrow && arrow === p.n;
    }
    if (question.archetype === "true-or-false-why") {
      const shown = p.compare.slice(0, 3);
      const best = p.ask === "most" ? Math.max(...shown) : Math.min(...shown);
      return best === p.compare[3] && best !== p.compare[4];
    }
    return new Set(p.set).size === 3;
  },
});
