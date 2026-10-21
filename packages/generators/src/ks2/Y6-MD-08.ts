/**
 * @statement Y6-MD-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MD-08: Use estimation to check answers and determine an appropriate degree of accuracy
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { fmt, tex } from "../shared/npv.ts";

interface Params {
  a: number;
  b: number;
  /** Depth 4: whether Leo's answer is right, or ten times too big. */
  right: boolean;
}

/** Round to the first digit: 487 → 500, 63 → 60. */
const lead = (n: number) => {
  const place = 10 ** (String(n).length - 1);
  return Math.round(n / place) * place;
};
const leadDown = (n: number) => {
  const place = 10 ** (String(n).length - 1);
  return Math.floor(n / place) * place;
};

export default defineGenerator<Params>({
  id: "Y6-MD-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "MD.MULTIPLY.ADDS", "MD.PLACE.ZEROS"],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 21 : 110, numbers === "stretch" ? 9999 : 999);
    const b = rng.int(12, numbers === "friendly" ? 49 : 98);
    for (const n of [a, b]) {
      const place = 10 ** (String(n).length - 1);
      if (n % place === 0 || (n % place) * 2 === place)
        reject("numbers that need rounding, not halfway");
    }
    if (lead(a) === leadDown(a) && lead(b) === leadDown(b)) reject("one number should round up");
    return { a, b, right: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [ra, rb] = [lead(p.a), lead(p.b)];
    const estimate = ra * rb;
    const exact = p.a * p.b;
    const how = `Round each number to its first digit: ${fmt(p.a)} ≈ ${fmt(ra)} and ${p.b} ≈ ${rb}, so ${fmt(ra)} × ${rb} = ${fmt(estimate)}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Estimate ",
            A.math(`${tex(p.a)} \\times ${p.b}`),
            " by rounding each number to its first digit.",
          ],
          answer: A.number(estimate),
          wrong: wrongs(estimate, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(leadDown(p.a) * leadDown(p.b)),
              feedback: "Round to the nearest, not always down: look at the next digit.",
            },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which is the best estimate for ", A.math(`${tex(p.a)} \\times ${p.b}`), "?"],
          correct: A.math(`${tex(ra)} \\times ${rb}`),
          distractors: [
            {
              content: A.math(
                `${tex(leadDown(p.a) === ra ? ra : leadDown(p.a))} \\times ${leadDown(p.b) === rb ? rb + 10 : leadDown(p.b)}`,
              ),
              code: "NPV.ROUND.ALWAYS-DOWN",
              feedback: "Round each number to the nearest, looking at the next digit.",
            },
            {
              content: A.math(`${tex(ra)} + ${rb}`),
              code: "MD.MULTIPLY.ADDS",
              feedback: "The estimate should use the same operation: multiply.",
            },
            {
              content: A.math(`${tex(ra * 10)} \\times ${rb}`),
              code: "MD.PLACE.ZEROS",
              feedback: `${fmt(p.a)} is nearer ${fmt(ra)} than ${fmt(ra * 10)}.`,
            },
          ],
          solution: [{ say: how }],
        });
      default: {
        const leo = p.right ? exact : exact * 10;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Leo works out ",
            A.math(`${tex(p.a)} \\times ${p.b} = ${tex(leo)}`),
            ". Mia uses an estimate to say his answer must be wrong.",
          ],
          truth: !p.right,
          reasons: p.right
            ? [
                {
                  text: `False. The estimate is ${fmt(estimate)}, which is close to ${fmt(leo)}, so his answer is sensible.`,
                  correct: true,
                },
                { text: "True. An answer is only right if it equals the estimate." },
                { text: "True. Count the zeros: the answer has too many.", code: "MD.PLACE.ZEROS" },
              ]
            : [
                {
                  text: `True. The estimate is ${fmt(estimate)}, but ${fmt(leo)} is about ten times bigger, so a digit is in the wrong place.`,
                  correct: true,
                },
                { text: "False. Estimates are never close enough to spot a mistake." },
                {
                  text: "False. Bigger answers are fine when you multiply.",
                  code: "MD.PLACE.ZEROS",
                },
              ],
          solution: [{ say: how }, { say: `The exact answer is ${fmt(exact)}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === lead(p.a) * lead(p.b);
    if (question.archetype === "varied-form")
      return chosenText(question) === `${tex(lead(p.a))} \\times ${lead(p.b)}`;
    return true;
  },
});
