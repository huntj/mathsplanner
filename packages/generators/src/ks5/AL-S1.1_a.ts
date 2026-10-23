/**
 * @statement AL-S1.1.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S1.1.a: Understand populations, samples and the census
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const STUDIES = [
  {
    who: "the heights of all 1200 pupils in a school",
    census: true,
    why: "the population is small and easy to measure",
  },
  {
    who: "the lifetime of light bulbs from a factory",
    census: false,
    why: "testing a bulb's lifetime destroys it",
  },
  {
    who: "the opinions of every voter in the country",
    census: false,
    why: "the population is far too large to ask everyone",
  },
  {
    who: "the ages of the 25 members of a chess club",
    census: true,
    why: "there are only 25 members",
  },
  {
    who: "the strength of every rope a company makes",
    census: false,
    why: "testing the strength breaks the rope",
  },
];

interface Params {
  s: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "AL-S1.1.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SAMPLE.BIAS", "STA.SAMPLING.METHOD"],

  params(rng) {
    return { s: rng.int(0, STUDIES.length - 1), n: rng.int(2, 9) * 10 };
  },

  build(p, depth, rng): QuestionDraft {
    const s = STUDIES[p.s] ?? STUDIES[0];
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`A researcher wants to find out about ${s?.who}.`],
          ask: "Should she take a census or a sample?",
          correct: s?.census ? "A census" : "A sample",
          distractors: [
            {
              content: s?.census ? "A sample" : "A census",
              code: "STA.SAMPLING.METHOD",
              feedback: `Think about the population: ${s?.why}.`,
            },
          ],
          solution: [{ say: `${s?.census ? "A census" : "A sample"}, because ${s?.why}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`A council asks ${p.n} of the households in a town about recycling.`],
          ask: "What is the population?",
          correct: "All the households in the town",
          distractors: [
            {
              content: `The ${p.n} households asked`,
              code: "STA.SAMPLING.METHOD",
              feedback:
                "Those households are the sample. The population is everyone the study is about.",
            },
            {
              content: "Everyone who recycles",
              feedback: "The study is about all households, whether they recycle or not.",
            },
          ],
          solution: [
            {
              say: `The population is all the households in the town; the ${p.n} asked are a sample.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Sam says a census is always better than a sample, because it gives complete information.",
          truth: false,
          reasons: [
            {
              text: "False. A census can be too slow, too costly, or impossible when testing destroys the item. A good sample can be enough.",
              correct: true,
            },
            { text: "True. A sample can never represent a population.", code: "STA.SAMPLE.BIAS" },
            { text: "True. Bigger is always better, whatever the cost." },
          ],
          solution: [
            {
              say: "A census gives full information but takes time and money; a sample is quicker and cheaper but has sampling variability.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === (STUDIES[p.s]?.census ? "A census" : "A sample");
    if (question.key.depth === 2) return chosenText(question) === "All the households in the town";
    return true;
  },
});
