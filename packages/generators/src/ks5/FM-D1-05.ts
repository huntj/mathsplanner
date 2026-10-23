/**
 * @statement FM-D1-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-05: Use critical path analysis: activity networks, floats, Gantt charts, resource levelling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  dur: number;
  est: number;
  lft: number;
  /** Durations of activities A to E. */
  t: number[];
}

/** A, B start; C after A; D after A and B; E after C and D. */
const finish = (t: number[]) => {
  const [a = 0, b = 0, c = 0, d = 0, e = 0] = t;
  return e + Math.max(a + c, Math.max(a, b) + d);
};

export default defineGenerator<Params>({
  id: "FM-D1-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.CRITICAL-PATH"],

  params(rng) {
    const dur = rng.int(2, 9);
    const est = rng.int(0, 12);
    const p = {
      dur,
      est,
      lft: est + dur + rng.int(1, 8),
      t: Array.from({ length: 5 }, () => rng.int(2, 9)),
    };
    if (p.t[0] === p.t[1]) reject("activities A and B of different lengths");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f = p.lft - p.est - p.dur;
        return A.standard({
          question: [
            `An activity lasts ${p.dur} days. Its earliest start time is day ${p.est} and its latest finish time is day ${p.lft}.`,
          ],
          ask: "Find its total float.",
          answer: A.number(f, { units: "days" }),
          wrong: wrongs(f, [
            {
              code: "DEC.CRITICAL-PATH",
              value: A.number(p.lft - p.est, { units: "days" }),
              feedback: "Float = latest finish − earliest start − duration.",
            },
          ]),
          solution: [{ say: `${p.lft} − ${p.est} − ${p.dur} = ${f} days.` }],
        });
      }
      case 2: {
        const v = finish(p.t);
        const [a, b, c, d, e] = p.t;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A project has activities A (${a} days) and B (${b} days), which can start at once; C (${c} days), which needs A; D (${d} days), which needs A and B; and E (${e} days), which needs C and D.`,
              ],
              ask: "Find the minimum time to complete the project.",
            },
          ],
          answer: A.number(v, { units: "days" }),
          wrong: wrongs(v, [
            {
              code: "DEC.CRITICAL-PATH",
              value: A.number(
                p.t.reduce((s, x) => s + x, 0),
                { units: "days" },
              ),
              feedback:
                "Some activities run at the same time. The project time is the length of the longest (critical) path.",
            },
          ]),
          solution: [
            {
              say: `The paths are A–C–E (${(a ?? 0) + (c ?? 0) + (e ?? 0)}), A–D–E (${(a ?? 0) + (d ?? 0) + (e ?? 0)}) and B–D–E (${(b ?? 0) + (d ?? 0) + (e ?? 0)}). The longest is ${v} days.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Pam says an activity on the critical path has a float equal to its duration.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Critical activities have zero total float: any delay to them delays the whole project.",
              correct: true,
            },
            { text: "True. The float is how long the activity takes.", code: "DEC.CRITICAL-PATH" },
            { text: "True. Critical activities have the most float.", code: "DEC.CRITICAL-PATH" },
          ],
          solution: [{ say: "On the critical path, earliest and latest times are equal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.lft - p.est - p.dur;
    if (question.key.depth === 2) return numberAnswer(question) === finish(p.t);
    return true;
  },
});
