/**
 * @statement Y7-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-STA-01: Describe, interpret and compare observed distributions of a single variable through
// appropriate graphs and measures of central tendency (mean, mode, median) and spread (range)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** An odd number of values for the median. */
  data: number[];
  /** Frequency table for the mode: shoe sizes with frequencies. */
  sizes: number[];
  freqs: number[];
  /** Depth 4: two teams' scores. */
  teamA: number[];
  teamB: number[];
}

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[(xs.length - 1) / 2] ?? 0;
const range = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export default defineGenerator<Params>({
  id: "Y7-STA-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MEDIAN.UNORDERED", "STA.MODE.FREQUENCY"],

  params(rng, numbers) {
    const n = rng.pick(numbers === "friendly" ? [5, 7] : [7, 9, 11]);
    const data = Array.from({ length: n }, () => rng.int(1, 30));
    if (data[(n - 1) / 2] === median(data))
      reject("the unordered middle must differ from the median");
    const sizes = [3, 4, 5, 6, 7].map((s) => s + rng.int(0, 2));
    const freqs = rng.shuffle([2, 4, 7, 9, 5].map((f) => f + rng.int(0, 3)));
    if (new Set(freqs).size < 5 || sizes.includes(Math.max(...freqs)))
      reject("a single mode that is not a frequency value");
    // Build the teams: A steady around a mean, B with a higher mean and a wider spread.
    const mA = rng.int(10, 13);
    const teamA = [0, 0, 0, 0].map(() => mA + rng.int(-2, 2));
    teamA.push(5 * mA - teamA.reduce((a, b) => a + b, 0));
    const mB = mA + rng.int(1, 4);
    const teamB = [0, 0, 0, 0].map(() => mB + rng.int(-8, 8));
    teamB.push(5 * mB - teamB.reduce((a, b) => a + b, 0));
    if (teamB.some((v) => v < 0) || range(teamA) >= range(teamB) || range(teamA) > 6)
      reject("B: higher mean but more spread");
    return { data, sizes, freqs, teamA, teamB };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const m = median(p.data);
        const sorted = [...p.data].sort((a, b) => a - b);
        return A.standard({
          question: ["Find the median of ", A.math(p.data.join(",\\ ")), "."],
          answer: A.number(m),
          wrong: wrongs(m, [
            {
              code: "STA.MEDIAN.UNORDERED",
              value: A.number(p.data[(p.data.length - 1) / 2] ?? 0),
              feedback: "Put the numbers in order first, then find the middle one.",
            },
          ]),
          solution: [{ say: `In order: ${sorted.join(", ")}. The middle value is ${m}.` }],
        });
      }
      case 2: {
        const k = p.freqs.indexOf(Math.max(...p.freqs));
        const mode = p.sizes[k] ?? 0;
        return A.standard({
          question: [
            "The table shows the shoe sizes of some pupils.",
            A.displayMath(
              tableLatex(
                ["shoe size", "frequency"],
                p.sizes.map((s, i) => [String(s), p.freqs[i] ?? 0]),
              ).replace(/\\text\{(\d+)\}/g, "$1"),
            ),
          ],
          ask: "What is the modal shoe size?",
          answer: A.number(mode),
          wrong: wrongs(mode, [
            {
              code: "STA.MODE.FREQUENCY",
              value: A.number(Math.max(...p.freqs)),
              feedback: `${Math.max(...p.freqs)} is how many pupils have the most common size. The mode is the size itself.`,
            },
          ]),
          solution: [
            {
              say: `The highest frequency is ${Math.max(...p.freqs)}, for size ${mode}, so the mode is ${mode}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Team A scored ",
            A.math(p.teamA.join(",\\ ")),
            ". Team B scored ",
            A.math(p.teamB.join(",\\ ")),
            ". Kim says Team B is more consistent, because its mean is higher.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The mean tells you how high the scores are; the range tells you how consistent they are. A's range is ${range(p.teamA)} and B's is ${range(p.teamB)}, so A is more consistent, even though B's mean (${mean(p.teamB)}) is higher than A's (${mean(p.teamA)}).`,
              correct: true,
            },
            { text: "True. A higher mean always means more consistent scores." },
            {
              text: "True. B has the higher middle score, so it is more consistent.",
              code: "STA.MEDIAN.UNORDERED",
            },
          ],
          solution: [
            {
              say: `Means: A ${mean(p.teamA)}, B ${mean(p.teamB)}. Ranges: A ${range(p.teamA)}, B ${range(p.teamB)}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        numberAnswer(question) ===
        (question.key.depth === 1 ? median(p.data) : p.sizes[p.freqs.indexOf(Math.max(...p.freqs))])
      );
    return range(p.teamA) < range(p.teamB) && mean(p.teamA) < mean(p.teamB);
  },
});
