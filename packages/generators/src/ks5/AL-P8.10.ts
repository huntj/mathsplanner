/**
 * @statement AL-P8.10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.10: Interpret the solution of a differential equation in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  room: number;
  diff: number;
  t: number;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "AL-P8.10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.INTERPRET", "ALG.LOG.INVERSE"],

  params(rng) {
    return {
      room: rng.pick([15, 18, 20, 22]),
      diff: rng.pick([40, 60, 80]),
      t: rng.pick([5, 10, 4]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const model = A.math(`T = ${p.room} + ${p.diff}e^{-kt}`);
    const intro = [
      "The temperature of a drink, T °C, t minutes after it is made satisfies ",
      model,
      ".",
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "What temperature does the model predict the drink approaches in the long term?",
          answer: A.number(p.room, { units: "°C" }),
          wrong: wrongs(p.room, [
            {
              code: "CALC.INTERPRET",
              value: A.number(p.room + p.diff, { units: "°C" }),
              feedback: "That is the starting temperature (t = 0). As t grows, e^(−kt) → 0.",
            },
          ]),
          solution: [{ say: `As t → ∞, e^(−kt) → 0, so T → ${p.room} °C: the room temperature.` }],
        });
      case 2: {
        const half = p.diff / 2;
        const k = r3(Math.log(2) / p.t);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [...intro, ` After ${p.t} minutes the drink is at ${p.room + half} °C.`],
              ask: "Find k, to 3 decimal places.",
            },
          ],
          answer: A.number(k, { accuracy: { dp: 3 } }),
          wrong: wrongs(k, [
            {
              code: "ALG.LOG.INVERSE",
              value: A.number(r3(2 / p.t), { accuracy: { dp: 3 } }),
              feedback: `e^(−${p.t}k) = ½, so take ln: k = ln 2 ÷ ${p.t}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.room + half} = ${p.room} + ${p.diff}e^{-${p.t}k} \\Rightarrow e^{-${p.t}k} = \\tfrac{1}{2} \\Rightarrow k = \\frac{\\ln 2}{${p.t}} = ${k}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Pat says the model predicts the drink will reach exactly ${p.room} °C after a certain time.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. e^(−kt) is never 0, so T is always above ${p.room} °C: it gets closer and closer but never reaches it.`,
              correct: true,
            },
            { text: "True. Every cooling drink reaches room temperature.", code: "CALC.INTERPRET" },
            { text: `True. Put t = ${p.diff} into the model.`, code: "CALC.INTERPRET" },
          ],
          solution: [
            {
              say: "Interpret the terms: the constant is the long-term value; the exponential term decays towards 0.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.room;
    return true;
  },
});
