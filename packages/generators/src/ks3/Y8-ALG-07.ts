/**
 * @statement Y8-ALG-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-07: Interpret mathematical relationships both algebraically and graphically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Cost = fixed + rate × hours. */
  fixed: number;
  rate: number;
  hours: number;
  claimTrue: boolean;
}

const graph = (p: Params): CartesianSpec => ({
  type: "cartesian",
  x: { min: 0, max: 8, step: 1, label: "\\text{hours}" },
  y: {
    min: 0,
    max: p.fixed + p.rate * 8,
    step: p.fixed + p.rate * 8 > 60 ? 10 : 5,
    label: "\\text{cost (£)}",
  },
  grid: true,
  curves: [{ y: `${p.rate}*x + ${p.fixed}`, domain: [0, 8] }],
  description: "A straight-line graph of cost in pounds against hours, starting on the cost axis.",
});

export default defineGenerator<Params>({
  id: "Y8-ALG-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.COORD.ORDER"],

  params(rng, numbers) {
    const fixed = rng.int(1, 4) * 5;
    const rate = rng.pick(numbers === "friendly" ? [5, 10] : [5, 10, 15]);
    if (fixed === rate) reject("different fixed charge and rate");
    return { fixed, rate, hours: rng.int(1, 8), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = "The graph shows the cost of hiring a canoe.";
    switch (depth) {
      case 1: {
        const cost = p.fixed + p.rate * p.hours;
        return A.standard({
          question: [intro, A.figure(graph(p))],
          ask: `What does it cost to hire the canoe for ${p.hours} hours, in pounds?`,
          answer: A.number(cost),
          wrong: wrongs(cost, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.rate * p.hours),
              feedback: `The line starts at £${p.fixed}, not £0: read the cost where the line is above ${p.hours} hours.`,
            },
          ]),
          solution: [{ say: `Go up from ${p.hours} hours to the line, then across: £${cost}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [intro, A.figure(graph(p))],
          ask: `What does the point where the line meets the cost axis, £${p.fixed}, mean?`,
          correct: `A fixed charge of £${p.fixed}, before any hours`,
          distractors: [
            {
              content: `The cost per hour is £${p.fixed}`,
              code: "ALG.LINE.M-C",
              feedback: `The cost per hour is the gradient: it goes up £${p.rate} for each hour.`,
            },
            {
              content: `The canoe can be hired for ${p.fixed} hours`,
              code: "ALG.COORD.ORDER",
              feedback: "That point is on the cost axis, so it is a cost, not a number of hours.",
            },
          ],
          solution: [
            {
              say: `At 0 hours the cost is already £${p.fixed}: that is a fixed charge. The cost then rises by £${p.rate} an hour.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            A.figure(graph(p)),
            ` Jo says the cost goes up by £${p.claimTrue ? p.rate : p.fixed} for each extra hour.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The gradient is £${p.rate} per hour: for every hour across, the line goes up £${p.rate}.`,
                  correct: true,
                },
                {
                  text: `False. It goes up by £${p.fixed}, where the line starts.`,
                  code: "ALG.LINE.M-C",
                },
                { text: "False. The cost is the same for any number of hours." },
              ]
            : [
                {
                  text: `False. £${p.fixed} is the fixed charge. The gradient shows it goes up £${p.rate} each hour.`,
                  correct: true,
                },
                {
                  text: "True. The number where the line starts is the cost per hour.",
                  code: "ALG.LINE.M-C",
                },
                { text: "True. The line is straight, so it goes up by the same as it starts." },
              ],
          solution: [{ say: `Cost = ${p.fixed} + ${p.rate} × hours.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return numberAnswer(question) === p.fixed + p.rate * p.hours;
    if (question.archetype === "varied-form")
      return chosenText(question).startsWith("A fixed charge");
    return true;
  },
});
