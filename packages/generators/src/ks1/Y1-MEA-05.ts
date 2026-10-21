/**
 * @statement Y1-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-05: Recognise and use language relating to dates, including days of the week, weeks,
// months and years
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { DAYS, MONTHS } from "../shared/mea.ts";

interface Params {
  day: number;
  after: boolean;
  month: number;
  pairs: number[];
  /** Depth 4: today, and how many days on the claim is about. */
  today: number;
  shift: 1 | 2;
  claimTrue: boolean;
}

const at = <T>(list: readonly T[], i: number): T =>
  list[((i % list.length) + list.length) % list.length] as T;

export default defineGenerator<Params>({
  id: "Y1-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.SEQUENCE.ORDER", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    return {
      day: rng.int(0, 6),
      after: rng.bool(),
      month: rng.int(0, 11),
      pairs: rng.shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 3),
      today: rng.int(0, 6),
      shift: numbers === "friendly" ? 1 : rng.pick([1, 2] as const),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const correct = at(DAYS, p.day + (p.after ? 1 : -1));
        const wrong = at(DAYS, p.day + (p.after ? -1 : 1));
        return A.choice({
          rng,
          question: `Today is ${at(DAYS, p.day)}.`,
          ask: `What day ${p.after ? "will it be tomorrow" : "was it yesterday"}?`,
          correct,
          distractors: [
            {
              content: wrong,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `${wrong} was ${p.after ? "yesterday" : "tomorrow"}. ${p.after ? "Tomorrow is the day after today" : "Yesterday is the day before today"}.`,
            },
            {
              content: at(DAYS, p.day + (p.after ? 2 : -2)),
              feedback: `That is two days ${p.after ? "after" : "before"} today.`,
            },
          ],
          solution: [{ say: `The days go ${DAYS.join(", ")}, then back to Monday.` }],
        });
      }
      case 2: {
        const fact = rng.pick([
          {
            ask: "How many days are there in a week?",
            answer: 7,
            wrong: 5,
            why: "Count them: Monday to Sunday is 7 days.",
          },
          {
            ask: "How many months are there in a year?",
            answer: 12,
            wrong: 10,
            why: "January to December is 12 months.",
          },
          { ask: `Which month comes after ${at(MONTHS, p.month)}?`, answer: -1, wrong: 0, why: "" },
        ]);
        if (fact.answer > 0)
          return A.standard({
            question: fact.ask,
            answer: A.number(fact.answer),
            wrong: [{ code: "MEA.TIME.FACTS", value: A.number(fact.wrong), feedback: fact.why }],
            solution: [{ say: fact.why }],
          });
        return A.choice({
          rng,
          archetype: "varied-form",
          question: fact.ask,
          correct: at(MONTHS, p.month + 1),
          distractors: [
            {
              content: at(MONTHS, p.month - 1),
              code: "MEA.SEQUENCE.ORDER",
              feedback: `${at(MONTHS, p.month - 1)} comes before ${at(MONTHS, p.month)}.`,
            },
            {
              content: at(MONTHS, p.month + 2),
              feedback: `${at(MONTHS, p.month + 2)} is two months after ${at(MONTHS, p.month)}.`,
            },
          ],
          solution: [{ say: `The months go ${MONTHS.join(", ")}.` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each day to the day that comes straight after it.",
          pairs: p.pairs.map((i) => [at(DAYS, i), at(DAYS, i + 1)] as [A.RichInput, A.RichInput]),
          solution: [{ say: `The days go ${DAYS.join(", ")}, then Monday again.` }],
        });
      default: {
        const real = at(DAYS, p.today + p.shift);
        const said = p.claimTrue ? real : at(DAYS, p.today - p.shift);
        const when = p.shift === 1 ? "tomorrow" : "the day after tomorrow";
        return A.trueOrFalseWhy({
          rng,
          statement: `Today is ${at(DAYS, p.today)}. Kai says ${when} will be ${said}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Count on ${p.shift} day${p.shift === 1 ? "" : "s"} from ${at(DAYS, p.today)}: ${real}.`,
                  correct: true,
                },
                {
                  text: `False. ${when[0]?.toUpperCase()}${when.slice(1)} is before today.`,
                  code: "MEA.SEQUENCE.ORDER",
                },
                { text: "False. There are only 5 days in a week.", code: "MEA.TIME.FACTS" },
              ]
            : [
                {
                  text: `False. ${said} is ${p.shift} day${p.shift === 1 ? "" : "s"} before ${at(DAYS, p.today)}. Counting on gives ${real}.`,
                  correct: true,
                },
                {
                  text: `True. ${said} is next to ${at(DAYS, p.today)}.`,
                  code: "MEA.SEQUENCE.ORDER",
                },
                {
                  text: "True. You count back to find days in the future.",
                  code: "MEA.SEQUENCE.ORDER",
                },
              ],
          solution: [
            {
              say: `Count on from ${at(DAYS, p.today)}: ${[1, 2]
                .slice(0, p.shift)
                .map((k) => at(DAYS, p.today + k))
                .join(", ")}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === at(DAYS, p.day + (p.after ? 1 : -1));
    if (question.archetype === "varied-form")
      return chosenText(question) === at(MONTHS, p.month + 1);
    return true;
  },
});
