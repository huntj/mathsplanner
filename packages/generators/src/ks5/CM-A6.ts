/**
 * @statement CM-A6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A6: Recognise correlation and know it does not indicate causation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

const LINKS = [
  {
    a: "ice cream sales",
    b: "the number of people treated for sunburn",
    cause: "Hot, sunny weather increases both.",
  },
  {
    a: "the number of fire engines sent to a fire",
    b: "the cost of the damage",
    cause: "Bigger fires need more engines and cause more damage.",
  },
  {
    a: "a town's number of libraries",
    b: "its number of burglaries",
    cause: "Towns with more people tend to have more of both.",
  },
  {
    a: "shoe size in a primary school",
    b: "reading score",
    cause: "Older children have bigger feet and also read better.",
  },
];

const TYPES = ["positive correlation", "negative correlation", "no correlation"];

interface Params {
  link: number;
  type: number;
  xs: number[];
  noise: number[];
}

const ys = (p: Params) =>
  p.xs.map(
    (x, i) =>
      (p.type === 0 ? 10 + 3 * x : p.type === 1 ? 80 - 3 * x : 30) +
      (p.noise[i] ?? 0) * (p.type === 2 ? 4 : 1),
  );

export default defineGenerator<Params>({
  id: "CM-A6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CORRELATION.TYPE", "STA.SCATTER.CAUSATION"],

  params(rng) {
    return {
      link: rng.int(0, LINKS.length - 1),
      type: rng.int(0, 2),
      xs: [2, 5, 8, 11, 14, 17],
      noise: rng.shuffle([-3, -2, -1, 1, 2, 3]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const L = LINKS[p.link] ?? (LINKS[0] as (typeof LINKS)[number]);
    switch (depth) {
      case 1: {
        const right = TYPES[p.type] as string;
        return A.choice({
          rng,
          question: [
            "The table shows the hours of sunshine (x) and the sales of an item (y) on six days.",
            A.math(tableLatex(["x", ...p.xs.map(String)], [["y", ...ys(p)]])),
          ],
          ask: "What type of correlation does the data show?",
          correct: right,
          distractors: TYPES.filter((t) => t !== right).map((t) => ({
            content: t,
            code: "STA.CORRELATION.TYPE",
            feedback: "As x increases, does y tend to increase, decrease, or show no pattern?",
          })),
          solution: [
            {
              say:
                p.type === 0
                  ? "y tends to increase as x increases."
                  : p.type === 1
                    ? "y tends to decrease as x increases."
                    : "There is no clear pattern.",
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Data show a strong positive correlation between ${L.a} and ${L.b}.`],
          ask: "What is the most likely explanation?",
          correct: L.cause,
          distractors: [
            {
              content: `Increasing ${L.a} causes ${L.b} to increase.`,
              code: "STA.SCATTER.CAUSATION",
              feedback:
                "Correlation does not show that one variable causes the other. Look for a third factor.",
            },
            {
              content: `Increasing ${L.b} causes ${L.a} to increase.`,
              code: "STA.SCATTER.CAUSATION",
              feedback: "Correlation does not show causation in either direction.",
            },
          ],
          solution: [{ say: `${L.cause} This is a confounding variable.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ivy says that a strong correlation between ${L.a} and ${L.b} proves that one causes the other.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Correlation only shows the variables change together. ${L.cause}`,
              correct: true,
            },
            {
              text: "True. A strong correlation is proof of cause and effect.",
              code: "STA.SCATTER.CAUSATION",
            },
            {
              text: "True. If they rise together, one must be pushing the other.",
              code: "STA.SCATTER.CAUSATION",
            },
          ],
          solution: [
            {
              say: "To show causation you need a controlled experiment or a convincing mechanism.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === TYPES[p.type];
    if (question.key.depth === 2) return chosenText(question) === LINKS[p.link]?.cause;
    return true;
  },
});
