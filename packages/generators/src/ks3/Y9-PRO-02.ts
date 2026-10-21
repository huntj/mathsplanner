/**
 * @statement Y9-PRO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-PRO-02: Generate theoretical sample spaces for single and combined events with equally likely,
// mutually exclusive outcomes and use these to calculate theoretical probabilities
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  /** Depth 1: a target total for two dice. */
  sum: number;
  /** Depth 2: a spinner with this many sections, and a coin. */
  sections: number;
  /** Depth 4: a middle total and an end total that are claimed to be equally likely. */
  middle: number;
  end: number;
}

const ways = (s: number) => [1, 2, 3, 4, 5, 6].filter((a) => s - a >= 1 && s - a <= 6).length;
const grid = () => {
  const rows = [1, 2, 3, 4, 5, 6].map(
    (a) => `${a} & ${[1, 2, 3, 4, 5, 6].map((b) => a + b).join(" & ")}`,
  );
  return `\\begin{array}{|c|cccccc|}\\hline + & 1 & 2 & 3 & 4 & 5 & 6 \\\\ \\hline ${rows.join(" \\\\ ")} \\\\ \\hline\\end{array}`;
};

export default defineGenerator<Params>({
  id: "Y9-PRO-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.SAMPLE-SPACE.EQUAL-TOTALS", "MD.MULTIPLY.ADDS"],

  params(rng, numbers) {
    return {
      sum: rng.int(numbers === "friendly" ? 5 : 2, numbers === "friendly" ? 9 : 12),
      sections: rng.int(3, 6),
      middle: rng.int(6, 8),
      end: rng.pick([2, 3, 11, 12]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = ways(p.sum);
        return A.standard({
          question: [
            "Two fair dice are rolled and their scores are added. The sample space shows every total.",
            A.displayMath(grid()),
          ],
          ask: `What is the probability of a total of ${p.sum}?`,
          answer: A.exact(frac(n, 36)),
          wrong: [
            {
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
              value: A.exact(fracTex(1, 11)),
              feedback:
                "The 11 totals are not equally likely. Count how many of the 36 cells show this total.",
            },
          ].filter(() => n !== 36 / 11),
          solution: [
            {
              say: `${n} of the 36 equally likely outcomes give ${p.sum}, so the probability is ${frac(n, 36).toString()}.`,
            },
          ],
        });
      }
      case 2: {
        const outcomes = p.sections * 2;
        return A.standard({
          question: `A spinner numbered 1 to ${p.sections} is spun and a coin is flipped.`,
          ask: "How many different outcomes are there altogether?",
          answer: A.number(outcomes),
          wrong: wrongs(outcomes, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(p.sections + 2),
              feedback: `Each of the ${p.sections} numbers can go with heads or with tails: ${p.sections} × 2.`,
            },
          ]),
          solution: [
            { say: `List them: 1H, 1T, 2H, 2T, … There are ${p.sections} × 2 = ${outcomes}.` },
          ],
        });
      }
      default: {
        const [m, e] = [ways(p.middle), ways(p.end)];
        const pairs = (s: number) =>
          [1, 2, 3, 4, 5, 6]
            .filter((a) => s - a >= 1 && s - a <= 6)
            .map((a) => `${a}+${s - a}`)
            .join(", ");
        return A.trueOrFalseWhy({
          rng,
          statement: `Two fair dice are rolled and the scores added. Zoe says a total of ${p.middle} is just as likely as a total of ${p.end}, because each is one possible total.`,
          truth: false,
          reasons: [
            {
              text: `False. ${p.middle} can be made in ${m} ways (${pairs(p.middle)}) but ${p.end} in only ${e === 1 ? "one way" : `${e} ways`} (${pairs(p.end)}), so P(${p.middle}) = ${m}/36 and P(${p.end}) = ${e}/36.`,
              correct: true,
            },
            {
              text: "True. Each total is one of 11 equally likely outcomes.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
            {
              text: "True. The dice are fair, so every total is equally likely.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
          ],
          solution: [{ say: "The 36 pairs of scores are equally likely; the totals are not." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(ways(p.sum), 36));
    if (question.archetype === "standard") return numberAnswer(question) === p.sections * 2;
    return true;
  },
});
