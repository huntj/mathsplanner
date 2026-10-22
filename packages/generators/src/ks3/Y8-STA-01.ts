/**
 * @statement Y8-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-STA-01: Construct and interpret appropriate tables, charts and diagrams, including frequency
// tables, bar charts, pie charts and pictograms for categorical data, and vertical line (or bar) charts
// for ungrouped and grouped numerical data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ChartSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Goals scored 0 to 4 and how many matches had each. */
  freqs: number[];
  /** Grouped heights: class frequencies. */
  grouped: number[];
}

const CLASSES = ["120 \\le h < 130", "130 \\le h < 140", "140 \\le h < 150", "150 \\le h < 160"];
const goalsTable = (freqs: number[]) =>
  `\\begin{array}{|c|c|}\\hline \\text{goals} & \\text{matches} \\\\ \\hline ${freqs.map((f, g) => `${g} & ${f}`).join(" \\\\ \\hline ")} \\\\ \\hline\\end{array}`;
const chart = (freqs: number[], step: number): ChartSpec => ({
  type: "chart",
  kind: "bar",
  categories: freqs.map((_, g) => String(g)),
  values: freqs,
  axis: { max: Math.ceil((Math.max(...freqs) + 1) / step) * step, step, label: "\\text{matches}" },
  description: "A bar chart of the number of matches for each number of goals.",
});

export default defineGenerator<Params>({
  id: "Y8-STA-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["STA.MEAN.DIVISOR", "STA.MODE.FREQUENCY"],

  params(rng) {
    const freqs = [0, 1, 2, 3, 4].map(() => rng.int(1, 9));
    const total = freqs.reduce((a, b) => a + b, 0);
    const goals = freqs.reduce((s, f, g) => s + f * g, 0);
    if ((goals * 10) % total !== 0 && (goals * 100) % total !== 0)
      reject("a mean with at most two decimal places");
    const grouped = [rng.int(2, 9), rng.int(5, 15), rng.int(5, 15), rng.int(2, 9)];
    if (new Set(grouped).size < 4 || new Set(freqs).size < 4) reject("distinct frequencies");
    return { freqs, grouped };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.freqs.reduce((a, b) => a + b, 0);
    const goals = p.freqs.reduce((s, f, g) => s + f * g, 0);
    switch (depth) {
      case 1: {
        const mean = goals / total;
        return A.standard({
          question: [
            "The table shows the number of goals a team scored in each match of a season.",
            A.displayMath(goalsTable(p.freqs)),
          ],
          ask: "Work out the mean number of goals per match.",
          answer: A.number(Number(mean.toFixed(2))),
          wrong: wrongs(mean, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(goals / 5),
              feedback: `Divide the total goals by the number of matches, ${total}, not by the number of rows.`,
            },
          ]),
          solution: [
            {
              say: `Total goals = ${p.freqs.map((f, g) => `${g} × ${f}`).join(" + ")} = ${goals}. Matches = ${total}. Mean = ${goals} ÷ ${total} = ${Number(mean.toFixed(2))}.`,
            },
          ],
        });
      }
      case 2: {
        const k = p.grouped.indexOf(Math.max(...p.grouped));
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The table shows the heights, h cm, of some pupils.",
            A.displayMath(
              `\\begin{array}{|c|c|}\\hline \\text{height } h & \\text{frequency} \\\\ \\hline ${CLASSES.map((c, i) => `${c} & ${p.grouped[i]}`).join(" \\\\ \\hline ")} \\\\ \\hline\\end{array}`,
            ),
          ],
          ask: "Which is the modal class?",
          correct: A.math(CLASSES[k] ?? ""),
          distractors: [
            ...CLASSES.filter((_, i) => i !== k)
              .slice(0, 2)
              .map((c) => ({
                content: A.math(c),
                feedback: "The modal class has the highest frequency.",
              })),
            {
              content: A.math(String(Math.max(...p.grouped))),
              code: "STA.MODE.FREQUENCY",
              feedback: "That is the highest frequency. The modal class is the group that has it.",
            },
          ],
          solution: [
            {
              say: `The highest frequency is ${Math.max(...p.grouped)}, so the modal class is the one with that frequency.`,
            },
          ],
        });
      }
      default: {
        const step = Math.max(...p.freqs) > 8 ? 2 : 1;
        const shifted = [...p.freqs.slice(1), p.freqs[0] ?? 0];
        return A.chooseTheDiagram({
          rng,
          question: [
            "Which bar chart shows the data in this table?",
            A.displayMath(goalsTable(p.freqs)),
          ],
          correct: chart(p.freqs, step),
          distractors: [
            {
              figure: chart(shifted, step),
              feedback: "The bars have moved along by one: check the 0 goals column.",
            },
            {
              figure: chart(
                [...p.freqs].sort((a, b) => b - a),
                step,
              ),
              code: "STA.MODE.FREQUENCY",
              feedback:
                "The bars must stay in order of the number of goals, not be sorted by height.",
            },
          ],
          solution: [{ say: "Each number of goals has a bar whose height is its frequency." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const total = p.freqs.reduce((a, b) => a + b, 0);
      return (
        Math.abs(numberAnswer(question) - p.freqs.reduce((s, f, g) => s + f * g, 0) / total) < 0.006
      );
    }
    if (question.archetype === "varied-form")
      return chosenText(question) === CLASSES[p.grouped.indexOf(Math.max(...p.grouped))];
    return (
      JSON.stringify((chosenFigure(question) as { values?: number[] } | undefined)?.values) ===
      JSON.stringify(p.freqs)
    );
  },
});
