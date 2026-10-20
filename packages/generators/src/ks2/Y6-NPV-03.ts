/**
 * @statement Y6-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-NPV-03: Use negative numbers in context, and calculate intervals across zero
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fmt, tex } from "../shared/npv.ts";

interface Params {
  /** A temperature below zero and one above it. */
  low: number;
  high: number;
  context: "temperature" | "lift" | "bank";
}

const CONTEXTS = {
  temperature: {
    unit: "°C",
    start: (v: number) => `The temperature at dawn is ${fmt(v)}°C`,
    end: (v: number) => `by midday it is ${fmt(v)}°C`,
    ask: "By how many degrees has it risen?",
  },
  lift: {
    unit: " floors",
    start: (v: number) => `A lift starts at floor ${fmt(v)} (below ground)`,
    end: (v: number) => `goes up to floor ${fmt(v)}`,
    ask: "How many floors has it gone up?",
  },
  bank: {
    unit: "",
    start: (v: number) => `A bank account is overdrawn at £${fmt(-v)}, shown as −£${fmt(-v)}`,
    end: (v: number) => `after a payment it shows £${fmt(v)}`,
    ask: "How much money, in pounds, was paid in?",
  },
};

export default defineGenerator<Params>({
  id: "Y6-NPV-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.MIRROR"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : numbers === "standard" ? 20 : 60;
    const low = -rng.int(1, top);
    const high = rng.int(1, top);
    if (-low === high) reject("the dropped-sign answer would be 0");
    return {
      low,
      high,
      context:
        numbers === "friendly" ? "temperature" : rng.pick(["temperature", "lift", "bank"] as const),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const gap = p.high - p.low;
    const dropped = Math.abs(p.high + p.low);
    const wrong = wrongs(gap, [
      {
        code: "NPV.NEGATIVE.MIRROR",
        value: A.number(dropped),
        feedback: `Count up to zero first (${fmt(-p.low)}), then on to ${fmt(p.high)}: ${fmt(-p.low)} + ${fmt(p.high)}.`,
      },
    ]);
    const c = CONTEXTS[p.context];
    switch (depth) {
      case 1:
        return A.standard({
          question: `${c.start(p.low)}, and ${c.end(p.high)}.`,
          ask: c.ask,
          answer: A.number(gap),
          wrong,
          solution: [
            {
              say: `From ${fmt(p.low)} up to 0 is ${fmt(-p.low)}; from 0 up to ${fmt(p.high)} is ${fmt(p.high)}.`,
            },
            { say: "Altogether:", math: `${-p.low} + ${p.high} = ${gap}` },
          ],
        });
      case 2: {
        const span = Math.max(10, Math.ceil(Math.max(-p.low, p.high) / 5) * 5);
        const line: NumberLineSpec = {
          type: "number-line",
          min: -span,
          max: span,
          step: span > 20 ? 10 : 5,
          minor: span > 20 ? 10 : 5,
          points: [
            { value: p.low, label: tex(p.low) },
            { value: p.high, label: tex(p.high) },
          ],
          description: `A number line from ${fmt(-span)} to ${fmt(span)} with ${fmt(p.low)} and ${fmt(p.high)} marked.`,
        };
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Two numbers are marked on the number line.", A.figure(line)],
              ask: "What is the difference between them?",
            },
            { question: [A.math(`${tex(p.high)} - (${tex(p.low)})`)], ask: "Work it out." },
          ],
          answer: A.number(gap),
          wrong,
          solution: [
            {
              say: `The distance from ${fmt(p.low)} to ${fmt(p.high)} crosses zero:`,
              math: `${-p.low} + ${p.high} = ${gap}`,
            },
          ],
        });
      }
      default: {
        const right = rng.bool();
        const claimed = right ? gap : dropped;
        return A.trueOrFalseWhy({
          rng,
          statement: `Ali says the difference between ${fmt(p.low)}°C and ${fmt(p.high)}°C is ${fmt(claimed)} degrees.`,
          truth: right,
          reasons: right
            ? [
                {
                  text: `${fmt(-p.low)} degrees up to zero, then ${fmt(p.high)} more: ${fmt(gap)}.`,
                  correct: true,
                },
                {
                  text: `Take the smaller from the bigger: ${fmt(Math.max(-p.low, p.high))} − ${fmt(Math.min(-p.low, p.high))}.`,
                  code: "NPV.NEGATIVE.MIRROR",
                },
                { text: "You cannot find a difference across zero." },
              ]
            : [
                {
                  text: `That ignores the minus sign. Up to zero is ${fmt(-p.low)}, then ${fmt(p.high)} more: ${fmt(gap)}.`,
                  correct: true,
                },
                {
                  text: `${fmt(-p.low)} and ${fmt(p.high)} differ by ${fmt(dropped)}, so he is right.`,
                  code: "NPV.NEGATIVE.MIRROR",
                },
                { text: "Negative temperatures do not count." },
              ],
          solution: [
            {
              say: `Across zero, add the two distances from zero: ${fmt(-p.low)} + ${fmt(p.high)} = ${fmt(gap)}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return p.high - p.low > 0;
    return numberAnswer(question) === p.high - p.low;
  },
});
