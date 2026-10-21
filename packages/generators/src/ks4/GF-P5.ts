/**
 * @statement GF-P5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P5: Understand that larger unbiased samples tend towards theoretical probability
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** The spinner's true chance of red, which the pupils do not see. */
  q: number;
  /** Reds seen in 10, 50, 100 and 500 spins. */
  reds: [number, number, number, number];
  /** Depth 4: a small run of dice rolls and the sixes seen in it. */
  rolls: number;
  sixes: number;
}

const SPINS = [10, 50, 100, 500] as const;
const NAMES = ["Ava", "Ben", "Cal", "Dee"] as const;

export default defineGenerator<Params>({
  id: "GF-P5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.SAMPLE.SMALL", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng) {
    const q = rng.pick([0.2, 0.3, 0.4, 0.6, 0.7]);
    const reds = SPINS.map((n, i) => {
      const wobble = [3, 6, 6, 12][i] ?? 0;
      return Math.round(q * n) + rng.int(-wobble, wobble);
    }) as Params["reds"];
    const small = reds[0] / 10;
    const large = reds[3] / 500;
    // The small run must look misleading, so the answers differ clearly.
    if (
      reds.some((r, i) => r <= 0 || r >= (SPINS[i] ?? 0)) ||
      Math.abs(small - q) < 0.15 ||
      small === large
    ) {
      reject("a misleading small run and a sensible large one");
    }
    const rolls = rng.pick([6, 12, 18]);
    return { q, reds, rolls, sixes: rng.int(3, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const rf = SPINS.map((n, i) => (p.reds[i] ?? 0) / n);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Four friends spin the same spinner to estimate the probability of red. ${NAMES.map((name, i) => `${name} spins it ${SPINS[i]} times`).join(", ")}.`,
          ask: "Whose results give the most reliable estimate?",
          correct: `${NAMES[3]}'s, because ${SPINS[3]} spins is the largest sample.`,
          distractors: [
            {
              content: `${NAMES[0]}'s, because fewer spins means fewer mistakes.`,
              code: "PRO.SAMPLE.SMALL",
              feedback: "Small samples vary a lot; more trials give a more reliable estimate.",
            },
            {
              content: "They are all equally reliable, because it is the same spinner.",
              code: "PRO.SAMPLE.SMALL",
              feedback: "The spinner is the same, but small samples wobble more.",
            },
            {
              content: `${NAMES[1]}'s, because ${SPINS[1]} is a sensible middle amount.`,
              code: "PRO.SAMPLE.SMALL",
              feedback:
                "The more trials, the closer the relative frequency tends to the true probability.",
            },
          ],
          solution: [
            {
              say: "The relative frequency tends towards the theoretical probability as the number of trials grows.",
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Some friends spin the same spinner and record how often it lands on red.",
                A.displayMath(tableLatex(["spins", ...SPINS.map(String)], [["reds", ...p.reds]])),
              ],
              ask: "Give the best estimate of the probability that the spinner lands on red.",
            },
          ],
          answer: A.number(rf[3] ?? 0),
          wrong: [
            {
              code: "PRO.SAMPLE.SMALL",
              value: A.number(rf[0] ?? 0),
              feedback: `Use the largest sample: ${p.reds[3]} ÷ ${SPINS[3]}.`,
            },
          ],
          solution: [
            {
              say: `The 500 spins give the most reliable estimate: ${p.reds[3]} ÷ 500 = ${rf[3]}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Sam rolls a dice ${p.rolls} times and gets ${p.sixes} sixes. Sam says the dice must be biased towards six.`,
          truth: false,
          reasons: [
            {
              text: `False. ${p.rolls} rolls is too few to tell; results vary a lot in small samples. Sam needs many more rolls.`,
              correct: true,
            },
            {
              text: `True. A fair dice would give exactly ${p.rolls / 6} sixes.`,
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            {
              text: `True. ${p.sixes} out of ${p.rolls} is more than a sixth, and that proves it.`,
              code: "PRO.SAMPLE.SMALL",
            },
          ],
          solution: [
            {
              say: "A small sample can easily stray from the theoretical probability; only a large sample is good evidence of bias.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form")
      return numberAnswer(question) === (p.reds[3] ?? 0) / 500;
    return true;
  },
});
