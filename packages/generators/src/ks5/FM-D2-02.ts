/**
 * @statement FM-D2-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-02: Solve allocation (assignment) problems using the Hungarian algorithm
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  c: number[][];
  i: number;
  j: number;
}

const PERMS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

const best = (c: number[][]) =>
  Math.min(...PERMS.map((p) => p.reduce((s, col, row) => s + (c[row]?.[col] ?? 0), 0)));

/** Each worker in turn takes the cheapest job still free. */
function greedy(c: number[][]): number {
  const used = new Set<number>();
  let total = 0;
  for (const row of c) {
    const options = row
      .map((x, j) => [x, j] as const)
      .filter(([, j]) => !used.has(j))
      .sort((a, b) => a[0] - b[0]);
    const [x, j] = options[0] ?? [0, 0];
    used.add(j);
    total += x;
  }
  return total;
}

export default defineGenerator<Params>({
  id: "FM-D2-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.HUNGARIAN"],

  params(rng) {
    const c = [0, 1, 2].map(() => [0, 1, 2].map(() => rng.int(5, 30)));
    const p = { c, i: rng.int(0, 2), j: rng.int(0, 2) };
    if (greedy(c) === best(c)) reject("a problem where greedy allocation fails");
    const rowMin = Math.min(...(c[p.i] ?? []));
    const colMin = Math.min(...c.map((r) => r[p.j] ?? 0));
    if (rowMin === colMin) reject("row and column reductions that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(
      tableLatex(
        ["", "Job 1", "Job 2", "Job 3"],
        p.c.map((row, i) => [`Worker ${["A", "B", "C"][i]}`, ...row]),
      ),
    );
    switch (depth) {
      case 1: {
        const v = best(p.c);
        return A.standard({
          question: [
            "The table shows the time, in minutes, each worker takes for each job. Each worker does one job.",
            table,
          ],
          ask: "Find the minimum total time.",
          answer: A.number(v, { units: "minutes" }),
          wrong: wrongs(v, [
            {
              code: "DEC.HUNGARIAN",
              value: A.number(greedy(p.c), { units: "minutes" }),
              feedback:
                "Giving each worker in turn their quickest free job is not always best. Use the Hungarian algorithm.",
            },
          ]),
          solution: [
            {
              say: `Reduce rows and columns, cover the zeros and adjust until an allocation of zeros exists. The minimum total is ${v} minutes.`,
            },
          ],
        });
      }
      case 2: {
        const v = (p.c[p.i]?.[p.j] ?? 0) - Math.min(...(p.c[p.i] ?? []));
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The Hungarian algorithm is applied to this cost matrix.", table],
              ask: `After reducing the rows, what is the entry for Worker ${["A", "B", "C"][p.i]}, Job ${p.j + 1}?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.HUNGARIAN",
              value: A.number((p.c[p.i]?.[p.j] ?? 0) - Math.min(...p.c.map((r) => r[p.j] ?? 0))),
              feedback: "Reduce rows first: subtract the smallest entry in each row.",
            },
          ]),
          solution: [{ say: `${p.c[p.i]?.[p.j]} − ${Math.min(...(p.c[p.i] ?? []))} = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sue wants to maximise the total score in an allocation problem and applies the Hungarian algorithm to the scores unchanged.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The Hungarian algorithm minimises. First subtract every entry from the largest entry (or negate them), then minimise.",
              correct: true,
            },
            {
              text: "True. The algorithm finds the best allocation whatever the aim.",
              code: "DEC.HUNGARIAN",
            },
            {
              text: "True. Maximising and minimising give the same allocation.",
              code: "DEC.HUNGARIAN",
            },
          ],
          solution: [
            { say: "Turning scores into 'losses' makes a maximising problem a minimising one." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === best(p.c);
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.c[p.i]?.[p.j] ?? 0) - Math.min(...(p.c[p.i] ?? []));
    return true;
  },
});
