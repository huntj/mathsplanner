/**
 * @statement Y8-STA-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-STA-02.b: Describe the relationship shown by a scatter graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const TYPES = ["Positive correlation", "Negative correlation", "No correlation"];
const CONTEXTS: [string, number][] = [
  ["people's heights and their arm spans", 0],
  ["the temperature outside and the amount of heating used", 1],
  ["pupils' house numbers and their test marks", 2],
  ["the number of people in a car and the fuel economy", 1],
  ["hours spent practising and the number of goals scored", 0],
  ["the day of the month people were born and their heights", 2],
];
const STRENGTH: [string, string][] = [
  ["The points lie very close to a straight line sloping upwards.", "Strong positive correlation"],
  ["The points slope upwards but are widely scattered.", "Weak positive correlation"],
  [
    "The points lie very close to a straight line sloping downwards.",
    "Strong negative correlation",
  ],
];

interface Params {
  c: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "Y8-STA-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CORRELATION.TYPE", "STA.SCATTER.CAUSATION"],

  params(rng) {
    return { c: rng.int(0, CONTEXTS.length - 1), s: rng.int(0, STRENGTH.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [what, t] = CONTEXTS[p.c] ?? CONTEXTS[0] ?? ["", 0];
        const right = TYPES[t] ?? "";
        return A.choice({
          rng,
          question: [`What type of correlation would you expect between ${what}?`],
          correct: right,
          distractors: TYPES.filter((x) => x !== right).map((x) => ({
            content: x,
            code: "STA.CORRELATION.TYPE",
            feedback: "Ask: as one goes up, does the other tend to go up, go down, or neither?",
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      case 2: {
        const [desc, right] = STRENGTH[p.s] ?? STRENGTH[0] ?? ["", ""];
        const others = [
          "Strong positive correlation",
          "Weak positive correlation",
          "Strong negative correlation",
          "No correlation",
        ]
          .filter((x) => x !== right)
          .slice(0, 2);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [desc],
          ask: "How would you describe the correlation?",
          correct: right,
          distractors: others.map((x) => ({
            content: x,
            code: "STA.CORRELATION.TYPE",
            feedback:
              "The direction gives positive or negative; how close the points are to a line gives strong or weak.",
          })),
          solution: [{ say: `${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Taller people tend to have bigger feet. Jay says this shows that having bigger feet makes you taller.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A correlation shows the two go together, not that one causes the other. Both come from growing.",
              correct: true,
            },
            {
              text: "True. Strong correlation proves cause and effect.",
              code: "STA.SCATTER.CAUSATION",
            },
            { text: "True. The points lie close to a line.", code: "STA.SCATTER.CAUSATION" },
          ],
          solution: [{ say: "Correlation is not causation." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === TYPES[CONTEXTS[p.c]?.[1] ?? 0];
    if (question.key.depth === 2) return chosenText(question) === STRENGTH[p.s]?.[1];
    return true;
  },
});
