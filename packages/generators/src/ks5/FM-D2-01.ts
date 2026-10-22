/**
 * @statement FM-D2-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-01: Solve transportation problems using the north-west corner and stepping-stone methods
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  supply: number[];
  demand: number[];
  cost: number[][];
}

/** The north-west corner allocation. */
function northWest(supply: number[], demand: number[]): number[][] {
  const s = [...supply];
  const d = [...demand];
  const x = supply.map(() => demand.map(() => 0));
  let i = 0;
  let j = 0;
  while (i < s.length && j < d.length) {
    const q = Math.min(s[i] ?? 0, d[j] ?? 0);
    (x[i] as number[])[j] = q;
    s[i] = (s[i] ?? 0) - q;
    d[j] = (d[j] ?? 0) - q;
    if (s[i] === 0) i++;
    else j++;
  }
  return x;
}

const totalCost = (p: Params) =>
  northWest(p.supply, p.demand).reduce(
    (s, row, i) => s + row.reduce((t, q, j) => t + q * (p.cost[i]?.[j] ?? 0), 0),
    0,
  );

export default defineGenerator<Params>({
  id: "FM-D2-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.TRANSPORT"],

  params(rng) {
    const supply = [5 * rng.int(4, 10), 5 * rng.int(4, 10), 5 * rng.int(4, 10)];
    const total = supply.reduce((s, x) => s + x, 0);
    const d1 = 5 * rng.int(3, 8);
    const d2 = 5 * rng.int(3, 8);
    const demand = [d1, d2, total - d1 - d2];
    if ((demand[2] ?? 0) <= 0) reject("a balanced problem");
    const x = northWest(supply, demand);
    if ((x[1]?.[1] ?? 0) === 0 || (x[1]?.[1] ?? 0) === Math.min(supply[1] ?? 0, demand[1] ?? 0))
      reject("a middle cell that depends on earlier allocations");
    return { supply, demand, cost: supply.map(() => demand.map(() => rng.int(2, 15))) };
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(
      tableLatex(
        ["", "X", "Y", "Z", "Supply"],
        [
          ...p.supply.map((s, i) => [["P", "Q", "R"][i] ?? "", ...(p.cost[i] ?? []), s]),
          ["Demand", ...p.demand, ""],
        ],
      ),
    );
    switch (depth) {
      case 1: {
        const v = northWest(p.supply, p.demand)[1]?.[1] ?? 0;
        return A.standard({
          question: [
            "The table shows the cost of moving one unit from each depot (P, Q, R) to each shop (X, Y, Z).",
            table,
          ],
          ask: "Using the north-west corner method, how many units go from Q to Y?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.TRANSPORT",
              value: A.number(Math.min(p.supply[1] ?? 0, p.demand[1] ?? 0)),
              feedback:
                "Allow for what has already been allocated from Q and to Y in earlier cells.",
            },
          ]),
          solution: [
            {
              say: "Start at the top left, allocate as much as possible, then move right or down as each supply or demand is used up.",
            },
          ],
        });
      }
      case 2: {
        const v = totalCost(p);
        const used = northWest(p.supply, p.demand).reduce(
          (s, row, i) => s + row.reduce((t, q, j) => t + (q > 0 ? (p.cost[i]?.[j] ?? 0) : 0), 0),
          0,
        );
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The table shows the cost of moving one unit from each depot to each shop.",
                table,
              ],
              ask: "Find the total cost of the north-west corner solution.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.TRANSPORT",
              value: A.number(used),
              feedback: "Multiply each unit cost by the number of units in that cell.",
            },
          ]),
          solution: [{ say: `Σ (units × cost) over the allocated cells = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rob says the north-west corner method gives the cheapest way to transport the goods.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It ignores the costs completely and only gives a starting (feasible) solution, which the stepping-stone method then improves.",
              correct: true,
            },
            { text: "True. It fills the cells in the best order.", code: "DEC.TRANSPORT" },
            {
              text: "True. Any solution that meets supply and demand is optimal.",
              code: "DEC.TRANSPORT",
            },
          ],
          solution: [
            { say: "Use shadow costs and improvement indices to check for a better solution." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === northWest(p.supply, p.demand)[1]?.[1];
    if (question.key.depth === 2) return numberAnswer(question) === totalCost(p);
    return true;
  },
});
