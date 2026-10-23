/**
 * @statement Y4-FR-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-FR-07: Find the effect of dividing a one- or two-digit number by 10 and 100, identifying the value
// of the digits in the answer as ones, tenths and hundredths
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  n: number;
  by: 10 | 100;
}

const PLACE = ["ones", "tenths", "hundredths"];

export default defineGenerator<Params>({
  id: "Y4-FR-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWERS10.WRONG-WAY", "FR.DECIMAL.PLACE"],

  params(rng, numbers) {
    const n = rng.int(numbers === "friendly" ? 2 : 11, numbers === "friendly" ? 9 : 99);
    if (n % 10 === 0) reject("no trailing zero");
    return { n, by: numbers === "friendly" ? 10 : rng.pick([10, 100] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const answer = p.n / p.by;
    const shown = answer.toFixed(p.by === 10 ? 1 : 2);
    const places = p.by === 10 ? 1 : 2;
    const why = `Dividing by ${p.by} moves every digit ${places} place${places === 1 ? "" : "s"} to the right: ${p.n} ÷ ${p.by} = ${shown}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${p.n} \\div ${p.by}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.POWERS10.WRONG-WAY",
              value: A.number(p.n * p.by),
              feedback: "Dividing makes the number smaller: the digits move to the right.",
            },
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(p.by === 10 ? p.n / 100 : p.n / 10),
              feedback: `Dividing by ${p.by} moves the digits ${places} place${places === 1 ? "" : "s"}.`,
            },
          ]),
          solution: [{ say: why }],
        });
      case 2: {
        // The last digit of the answer, and which place it is in.
        const last = p.n % 10;
        const at = places;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [A.math(`${p.n} \\div ${p.by} = ${shown}`)],
          ask: `What is the value of the ${last} in ${shown}?`,
          correct: `${last} ${PLACE[at]}`,
          distractors: [
            {
              content: `${last} ${PLACE[at - 1]}`,
              code: "FR.DECIMAL.PLACE",
              feedback: `The ${last} was in the ones. Dividing by ${p.by} moves it ${places} place${places === 1 ? "" : "s"} to the right.`,
            },
            {
              content: `${last} ones`,
              code: "NPV.POWERS10.WRONG-WAY",
              feedback: "The digit has moved, so its value has changed.",
            },
            {
              content: `${last} ${at === 2 ? "thousandths" : "hundredths"}`,
              feedback: `Count the places after the point: the ${last} is ${places} place${places === 1 ? "" : "s"} along.`,
            },
          ].filter(
            (o, i, all) =>
              o.content !== `${last} ${PLACE[at]}` &&
              all.findIndex((x) => x.content === o.content) === i,
          ),
          solution: [{ say: why }, { say: `The ${last} is now in the ${PLACE[at]} column.` }],
        });
      }
      default: {
        const wrong = (p.n / (p.by * 10)).toFixed(places + 1);
        return A.trueOrFalseWhy({
          rng,
          statement: ["Isla says ", A.math(`${p.n} \\div ${p.by} = ${wrong}`), "."],
          truth: false,
          reasons: [
            { text: `False. ${why}`, correct: true },
            {
              text: `True. Dividing by ${p.by} puts ${places === 1 ? "a zero" : "two zeros"} after the point.`,
              code: "FR.DECIMAL.PLACE",
            },
            { text: "True. The answer is smaller, so it must be right." },
          ],
          solution: [{ say: why }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) * p.by - p.n) < 1e-9;
    if (question.archetype === "varied-form")
      return chosenText(question) === `${p.n % 10} ${PLACE[p.by === 10 ? 1 : 2]}`;
    return true;
  },
});
