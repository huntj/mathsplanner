/**
 * @statement CM-A1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A1: Infer properties of populations from a sample, knowing the limitations of sampling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

/** Surveys, each with one sample that is clearly biased and two that are less so. */
const SURVEYS = [
  {
    aim: "how often people in a town use the leisure centre",
    biased: "Asking people as they leave the leisure centre",
    fair: [
      "Asking a random sample of people from the electoral roll",
      "Asking every 20th person on a list of town residents",
    ],
  },
  {
    aim: "what students at a college think of the canteen food",
    biased: "Asking students queuing in the canteen at lunchtime",
    fair: [
      "Asking a random sample chosen from the college register",
      "Asking a random sample from each year group",
    ],
  },
  {
    aim: "how much time adults in a city spend online",
    biased: "Putting a survey on a website and using everyone who replies",
    fair: [
      "Phoning a random sample of city residents",
      "Asking a random sample chosen from a list of all adults in the city",
    ],
  },
];

interface Params {
  N: number;
  n: number;
  k: number;
  s: number;
}

const estimate = (p: Params) => (p.N * p.k) / p.n;

export default defineGenerator<Params>({
  id: "CM-A1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SAMPLE.SCALE", "STA.SAMPLE.BIAS"],

  params(rng) {
    const n = rng.pick([40, 50, 80, 100, 200]);
    const p = {
      N: rng.pick([1200, 2000, 2400, 3000, 4000, 6000]),
      n,
      k: rng.int(5, n - 5),
      s: rng.int(0, SURVEYS.length - 1),
    };
    if (!Number.isInteger(estimate(p))) reject("a whole-number estimate");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = estimate(p);
        return A.standard({
          question: [
            `A college has ${p.N} students. In a random sample of ${p.n} of them, ${p.k} cycle to college.`,
          ],
          ask: "Estimate how many students at the college cycle.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.SAMPLE.SCALE",
              value: A.number(p.k),
              feedback: `That is the number in the sample. Scale up: ${p.k}/${p.n} of ${p.N}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.k}}{${p.n}} \\times ${p.N} = ${v}` }],
        });
      }
      case 2: {
        const S = SURVEYS[p.s] ?? (SURVEYS[0] as (typeof SURVEYS)[number]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A researcher wants to find out ${S.aim}.`],
          ask: "Which sampling method is most likely to give a biased sample?",
          correct: S.biased,
          distractors: S.fair.map((f) => ({
            content: f,
            code: "STA.SAMPLE.BIAS",
            feedback: "Each member of the population has a fair chance of being chosen here.",
          })),
          solution: [
            {
              say: "The biased method only reaches people who are more likely to have a particular answer.",
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Dan says that if he asks ${p.n * 10} people outside a gym about their exercise habits, the large sample will remove any bias.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A larger sample reduces random variation, but if the way it is chosen is biased, every extra person repeats the same bias.",
              correct: true,
            },
            { text: "True. Big samples are always representative.", code: "STA.SAMPLE.BIAS" },
            { text: "True. Bias only affects small samples.", code: "STA.SAMPLE.BIAS" },
          ],
          solution: [{ say: "Random selection, not size, is what avoids bias." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === estimate(p);
    if (question.key.depth === 2) return chosenText(question) === SURVEYS[p.s]?.biased;
    return true;
  },
});
