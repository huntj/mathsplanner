/**
 * @statement Y5-STA-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-STA-02.a: Complete, read and interpret tables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

const CLUBS = ["Football", "Choir", "Chess", "Art"];

interface Params {
  /** Boys and girls in each club. */
  boys: number[];
  girls: number[];
  /** Depth 1: the club whose girls are hidden. */
  hide: number;
  ask: number;
}

export default defineGenerator<Params>({
  id: "Y5-STA-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.PROBLEM.KEYWORD", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 15 : 40;
    const boys = CLUBS.map(() => rng.int(3, top));
    const girls = CLUBS.map(() => rng.int(3, top));
    const totals = boys.map((b, i) => b + (girls[i] ?? 0));
    const unique = (xs: number[]) => xs.filter((x) => x === Math.max(...xs)).length === 1;
    if (!unique(girls) || !unique(totals))
      reject("one biggest club and one club with the most girls");
    return { boys, girls, hide: rng.int(0, 3), ask: rng.int(0, 3) };
  },

  build(p, depth, rng): QuestionDraft {
    const totals = p.boys.map((b, i) => b + (p.girls[i] ?? 0));
    const rows = (hidden?: number) =>
      CLUBS.map((c, i) => [
        c,
        p.boys[i] ?? 0,
        i === hidden ? "?" : (p.girls[i] ?? 0),
        totals[i] ?? 0,
      ]);
    const table = (hidden?: number) =>
      A.displayMath(tableLatex(["Club", "Boys", "Girls", "Total"], rows(hidden)));
    const club = CLUBS[p.ask] ?? "";
    switch (depth) {
      case 1: {
        const g = p.girls[p.hide] ?? 0;
        const t = totals[p.hide] ?? 0;
        const b = p.boys[p.hide] ?? 0;
        return A.standard({
          question: ["The table shows how many boys and girls go to each club.", table(p.hide)],
          ask: `How many girls go to ${CLUBS[p.hide]}?`,
          answer: A.number(g),
          wrong: wrongs(g, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(t + b),
              feedback:
                "The total is boys and girls together, so take the boys away from the total.",
            },
          ]),
          solution: [{ say: `${t} − ${b} = ${g}.` }],
        });
      }
      case 2: {
        const all = totals.reduce((s, v) => s + v, 0);
        const notClub = all - (totals[p.ask] ?? 0);
        return A.standard({
          question: ["The table shows how many boys and girls go to each club.", table()],
          ask: `How many children go to a club that is not ${club}?`,
          answer: A.number(notClub),
          wrong: wrongs(notClub, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(all),
              feedback: `That is everyone. Take away the ${club} total.`,
            },
          ]),
          solution: [
            { say: `${totals.join(" + ")} = ${all}, and ${all} − ${totals[p.ask]} = ${notClub}.` },
          ],
        });
      }
      default: {
        const most = Math.max(...p.girls);
        const mostClub = CLUBS[p.girls.indexOf(most)] ?? "";
        const bigTotal = CLUBS[totals.indexOf(Math.max(...totals))] ?? "";
        const truth = mostClub === bigTotal;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The table shows how many boys and girls go to each club.",
            table(),
            `Mia says the club with the most children also has the most girls.`,
          ],
          truth,
          reasons: truth
            ? [
                {
                  text: `True. ${bigTotal} has the biggest total and also the most girls, ${most}.`,
                  correct: true,
                },
                { text: "False. The biggest club always has the most boys instead." },
                { text: "False. You cannot tell from a table." },
              ]
            : [
                {
                  text: `False. ${bigTotal} has the most children, but ${mostClub} has the most girls, ${most}.`,
                  correct: true,
                },
                { text: "True. The biggest club must have the most of everyone." },
                {
                  text: "True. The total tells you who has the most girls.",
                  code: "AS.PROBLEM.KEYWORD",
                },
              ],
          solution: [
            {
              say: "Compare the right column: the Girls column for girls, the Total column for children.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const totals = p.boys.map((b, i) => b + (p.girls[i] ?? 0));
    if (question.key.depth === 1) return numberAnswer(question) === p.girls[p.hide];
    if (question.key.depth === 2)
      return numberAnswer(question) === totals.reduce((s, v) => s + v, 0) - (totals[p.ask] ?? 0);
    return true;
  },
});
