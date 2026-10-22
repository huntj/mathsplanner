/**
 * @statement CM-A7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A7: Use explanatory and response variables; interpolate and extrapolate, knowing the dangers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const PAIRS = [
  { ex: "the hours spent revising", res: "the test score" },
  { ex: "the amount of fertiliser used", res: "the crop yield" },
  { ex: "the outside temperature", res: "the gas used for heating" },
  { ex: "the age of a car", res: "its value" },
];

interface Params {
  pair: number;
  lo: number;
  hi: number;
  inside: number;
  outside: number;
}

export default defineGenerator<Params>({
  id: "CM-A7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.REGRESSION.VARIABLES", "STA.EXTRAPOLATE"],

  params(rng) {
    const lo = rng.int(1, 5);
    const hi = lo + rng.int(6, 12);
    return {
      pair: rng.int(0, PAIRS.length - 1),
      lo,
      hi,
      inside: rng.int(lo + 1, hi - 1),
      outside: hi + rng.int(5, 15),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const P = PAIRS[p.pair] ?? (PAIRS[0] as (typeof PAIRS)[number]);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`A study looks at how ${P.res} depends on ${P.ex}.`],
          ask: "Which is the explanatory variable?",
          correct: P.ex.replace(/^the /, ""),
          distractors: [
            {
              content: P.res.replace(/^the /, "").replace(/^its /, "the car's "),
              code: "STA.REGRESSION.VARIABLES",
              feedback: "The explanatory variable is the one that may explain or affect the other.",
            },
            {
              content: "Neither: both are response variables",
              code: "STA.REGRESSION.VARIABLES",
              feedback: `${P.res} responds to changes in ${P.ex}.`,
            },
          ],
          solution: [
            { say: `${P.ex} is explanatory (plotted on the x-axis); ${P.res} is the response.` },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `A regression line was found using data with x (${P.ex}) from ${p.lo} to ${p.hi}.`,
          ],
          ask: "Which prediction is the most reliable?",
          correct: `A prediction for x = ${p.inside}`,
          distractors: [
            {
              content: `A prediction for x = ${p.outside}`,
              code: "STA.EXTRAPOLATE",
              feedback: `x = ${p.outside} is outside the data (extrapolation): the pattern may not continue.`,
            },
            {
              content: "A prediction for x = 0",
              code: "STA.EXTRAPOLATE",
              feedback: `x = 0 is below the data range (${p.lo} to ${p.hi}), so this is extrapolation too.`,
            },
          ],
          solution: [{ say: `x = ${p.inside} lies inside the data range (interpolation).` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Jay says a regression line from data with x between ${p.lo} and ${p.hi} can be used to predict y for any value of x.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Outside the range of the data (extrapolation) the relationship may change, so predictions are unreliable.",
              correct: true,
            },
            {
              text: "True. A straight line goes on for ever, so it works everywhere.",
              code: "STA.EXTRAPOLATE",
            },
            {
              text: "True. A strong correlation makes every prediction reliable.",
              code: "STA.EXTRAPOLATE",
            },
          ],
          solution: [
            {
              say: "For example, a crop's yield cannot keep rising for ever as fertiliser increases.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === PAIRS[p.pair]?.ex.replace(/^the /, "");
    if (question.key.depth === 2)
      return chosenText(question) === `A prediction for x = ${p.inside}`;
    return true;
  },
});
