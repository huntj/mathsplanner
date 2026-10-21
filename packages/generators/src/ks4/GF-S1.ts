/**
 * @statement GF-S1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S1: Infer properties of populations from a sample, knowing the limitations of sampling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Survey {
  /** What the survey wants to find out, and who it is about. */
  aim: string;
  who: string;
  /** A sample that leans one way, and why. */
  biased: string;
  why: string;
  /** Another convenient but biased sample. */
  other: string;
  /** A fair sample. */
  fair: string;
}

const SURVEYS: Survey[] = [
  {
    aim: "how often people in a town use the library",
    who: "people",
    biased: "people leaving the library",
    why: "people leaving the library already use it, so they are not typical of the whole town",
    other: "people in the library café",
    fair: "people chosen at random from the town's electoral register",
  },
  {
    aim: "how much exercise people in a town do",
    who: "people",
    biased: "people at a gym",
    why: "people at a gym probably exercise more than most, so they are not typical of the whole town",
    other: "members of a running club",
    fair: "people chosen at random from the town's electoral register",
  },
  {
    aim: "what pupils think of school dinners",
    who: "pupils",
    biased: "pupils in the queue for school dinners",
    why: "pupils who queue for dinners probably like them more, so they are not typical of the whole school",
    other: "pupils in the school cookery club",
    fair: "pupils chosen at random from the whole school register",
  },
];

const cap = (t: string) => `${t[0]?.toUpperCase() ?? ""}${t.slice(1)}`;

interface Params {
  survey: number;
  size: number;
}

export default defineGenerator<Params>({
  id: "GF-S1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SAMPLE.BIAS", "PRO.SAMPLE.SMALL"],

  params(rng) {
    return { survey: rng.int(0, SURVEYS.length - 1), size: rng.pick([100, 200, 300, 500]) };
  },

  build(p, depth, rng): QuestionDraft {
    const s = SURVEYS[p.survey] ?? (SURVEYS[0] as Survey);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `A researcher wants to find out ${s.aim}. She will ask ${p.size} ${s.who}.`,
          ask: "Which sample is least likely to be biased?",
          correct: cap(s.fair),
          distractors: [
            { content: cap(s.biased), code: "STA.SAMPLE.BIAS", feedback: `${cap(s.why)}.` },
            {
              content: cap(s.other),
              code: "STA.SAMPLE.BIAS",
              feedback:
                "A convenient group shares something in common, so it does not represent everyone.",
            },
            {
              content: "Any of these: they are all the same size.",
              code: "STA.SAMPLE.BIAS",
              feedback: "Size does not remove bias; how the sample is chosen matters.",
            },
          ],
          solution: [
            {
              say: "A random sample from the whole population gives everyone the same chance of being chosen.",
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `To find out ${s.aim}, a researcher asks ${p.size} ${s.biased}.`,
          ask: "Why might the results be biased?",
          correct: `Because ${s.why}.`,
          distractors: [
            {
              content: `Because ${p.size} ${s.who} is too few.`,
              code: "PRO.SAMPLE.SMALL",
              feedback: `${p.size} is a reasonable size; the problem is who was asked.`,
            },
            {
              content: "They will not be biased, because everyone asked is a real person.",
              code: "STA.SAMPLE.BIAS",
              feedback: "The people asked are not typical of the whole population.",
            },
          ],
          solution: [
            { say: "A biased sample over-represents one kind of person, whatever its size." },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `To find out ${s.aim}, Tom asks ${p.size * 2} ${s.biased}. He says such a large sample must represent everyone.`,
          truth: false,
          reasons: [
            {
              text: `False. A large sample is still biased if it is chosen badly: ${s.why}.`,
              correct: true,
            },
            {
              text: "True. A large enough sample is always representative.",
              code: "STA.SAMPLE.BIAS",
            },
            {
              text: `False. ${p.size * 2} people is too small a sample.`,
              code: "PRO.SAMPLE.SMALL",
            },
          ],
          solution: [
            {
              say: "Bigger samples reduce random variation, but they do not fix bias in how people are chosen.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const s = SURVEYS[p.survey] ?? (SURVEYS[0] as Survey);
    if (question.key.depth === 1) return chosenText(question).toLowerCase() === s.fair;
    if (question.key.depth === 2) return chosenText(question).includes(s.why);
    return true;
  },
});
