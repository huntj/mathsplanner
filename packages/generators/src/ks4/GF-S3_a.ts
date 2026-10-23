/**
 * @statement GF-S3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S3.a: Construct and interpret grouped frequency tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { groupedTable } from "../shared/sta.ts";

const LOWS = [0, 10, 20, 30, 40];

interface Params {
  f: number[];
}

const cls = (i: number) => `${LOWS[i]} < t \\le ${(LOWS[i] ?? 0) + 10}`;
function medianClass(f: number[]): number {
  const n = f.reduce((s, x) => s + x, 0);
  let c = 0;
  for (let i = 0; i < f.length; i++) {
    c += f[i] ?? 0;
    if (c >= (n + 1) / 2) return i;
  }
  return f.length - 1;
}

export default defineGenerator<Params>({
  id: "GF-S3.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MODE.FREQUENCY", "STA.MEDIAN.UNORDERED", "STA.GROUPED.MIDPOINT"],

  params(rng) {
    const p = { f: LOWS.map(() => rng.int(2, 20)) };
    const top = Math.max(...p.f);
    if (p.f.filter((x) => x === top).length > 1) reject("one modal class");
    if (medianClass(p.f) === 2 || p.f.indexOf(top) === medianClass(p.f))
      reject("a median class away from the middle row and the mode");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(groupedTable("t", "\\text{time } t \\text{ (minutes)}", LOWS, 10, p.f));
    switch (depth) {
      case 1: {
        const m = p.f.indexOf(Math.max(...p.f));
        return A.choice({
          rng,
          question: ["The table shows how long some pupils spent on homework.", table],
          ask: "Which is the modal class?",
          correct: A.math(cls(m)),
          distractors: [
            {
              content: A.math(String(Math.max(...p.f))),
              code: "STA.MODE.FREQUENCY",
              feedback:
                "That is the highest frequency. The modal class is the class it belongs to.",
            },
            {
              content: A.math(cls(2)),
              code: "STA.MEDIAN.UNORDERED",
              feedback: "The middle row is not special: look for the biggest frequency.",
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(cls(m)))),
          solution: [{ say: "The class with the highest frequency: ", math: cls(m) }],
        });
      }
      case 2: {
        const m = medianClass(p.f);
        const n = p.f.reduce((s, x) => s + x, 0);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The table shows how long some pupils spent on homework.", table],
          ask: "Which class contains the median?",
          correct: A.math(cls(m)),
          distractors: [
            {
              content: A.math(cls(2)),
              code: "STA.MEDIAN.UNORDERED",
              feedback: `The median is the middle pupil, not the middle row. Count to the ${(n + 1) / 2}th pupil.`,
            },
            {
              content: A.math(cls(p.f.indexOf(Math.max(...p.f)))),
              code: "STA.MODE.FREQUENCY",
              feedback: "That is the modal class.",
            },
          ].filter(distinctFrom(A.math(cls(m)))),
          solution: [
            {
              say: `There are ${n} pupils; add up the frequencies until you pass the ${(n + 1) / 2}th: `,
              math: cls(m),
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eva says you can read the longest time any pupil spent from a grouped frequency table.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Grouping hides the exact values: you only know which class the longest time is in.",
              correct: true,
            },
            { text: "True. It is the top of the last class.", code: "STA.GROUPED.MIDPOINT" },
            { text: "True. It is the midpoint of the last class.", code: "STA.GROUPED.MIDPOINT" },
          ],
          solution: [{ say: "Grouped data gives estimates, not exact values." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === cls(p.f.indexOf(Math.max(...p.f)));
    if (question.key.depth === 2) return chosenText(question) === cls(medianClass(p.f));
    return true;
  },
});
