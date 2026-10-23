/**
 * @statement GH-S3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-S3.b: Construct and interpret cumulative frequency graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { groupedTable, lineGraph } from "../shared/sta.ts";

const LOWS = [0, 10, 20, 30, 40];

interface Params {
  f: number[];
  k: number;
}

const cum = (f: number[], k: number) => f.slice(0, k + 1).reduce((s, x) => s + x, 0);

export default defineGenerator<Params>({
  id: "GH-S3.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CUMFREQ.READ"],

  params(rng) {
    const p = { f: LOWS.map(() => rng.int(1, 8) * 2), k: rng.int(1, 3) };
    if (cum(p.f, 4) > 60 || cum(p.f, p.k) * 2 === cum(p.f, 4))
      reject("a total that fits the graph, and two different readings");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const n = cum(p.f, 4);
    switch (depth) {
      case 1: {
        const v = cum(p.f, p.k);
        return A.standard({
          question: [
            "The table shows the masses of some apples.",
            A.math(
              groupedTable(
                "m",
                "\\text{mass } m \\text{ (g)}",
                LOWS.map((x) => x + 100),
                10,
                p.f,
              ),
            ),
          ],
          ask: `Find the cumulative frequency for m ≤ ${(LOWS[p.k] ?? 0) + 110}.`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.CUMFREQ.READ",
              value: A.number(p.f[p.k] ?? 0),
              feedback:
                "Cumulative frequency is a running total: add all the frequencies up to this class.",
            },
          ]),
          solution: [{ say: "", math: `${p.f.slice(0, p.k + 1).join(" + ")} = ${v}` }],
        });
      }
      case 2: {
        const upTo = cum(p.f, p.k);
        const v = n - upTo;
        const graph = lineGraph(
          [
            [100, 0] as [number, number],
            ...p.f.map((_, i): [number, number] => [(LOWS[i] ?? 0) + 110, cum(p.f, i)]),
          ],
          { min: 100, max: 150, step: 10, label: "mass (g)" },
          { min: 0, max: 60, step: 5, label: "cumulative frequency" },
          `A cumulative frequency graph for the masses of ${n} apples.`,
        );
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The cumulative frequency graph shows the masses of ${n} apples.`,
                A.figure(graph),
              ],
              ask: `How many apples have a mass of more than ${(LOWS[p.k] ?? 0) + 110} g?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.CUMFREQ.READ",
              value: A.number(upTo),
              feedback: `The graph gives how many are up to ${(LOWS[p.k] ?? 0) + 110} g. Subtract from the total, ${n}.`,
            },
          ]),
          solution: [{ say: "", math: `${n} - ${upTo} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy has a cumulative frequency graph for 80 values. She reads across from 20 to find the median.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The median is the 40th value, so read across from 40. Reading from 20 gives the lower quartile.",
              correct: true,
            },
            {
              text: "True. The median is found from a quarter of the total.",
              code: "STA.CUMFREQ.READ",
            },
            {
              text: "True. Read from the middle of the vertical axis, whatever its scale.",
              code: "STA.CUMFREQ.READ",
            },
          ],
          solution: [{ say: "Median at n/2, quartiles at n/4 and 3n/4." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === cum(p.f, p.k);
    if (question.key.depth === 2) return numberAnswer(question) === cum(p.f, 4) - cum(p.f, p.k);
    return true;
  },
});
