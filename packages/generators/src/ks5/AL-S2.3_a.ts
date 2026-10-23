/**
 * @statement AL-S2.3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S2.3.a: Calculate and interpret measures of central tendency
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** Frequencies of the values 0 to 4. */
  f: number[];
  n: number;
  sx: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-S2.3.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MEAN.DIVISOR", "STA.MODE.FREQUENCY"],

  params(rng) {
    const f = [rng.int(2, 12), rng.int(5, 20), rng.int(3, 18), rng.int(1, 10), rng.int(1, 6)];
    const most = Math.max(...f);
    if (f.filter((x) => x === most).length > 1 || f.indexOf(most) === most)
      reject("one mode, different from its frequency");
    return { f, n: rng.int(15, 40), sx: rng.int(200, 900) };
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.displayMath(
      tableLatex(
        ["\\text{Number of pets}", "\\text{Frequency}"],
        p.f.map((x, i) => [i, x]),
      ),
    );
    const total = p.f.reduce((s, x) => s + x, 0);
    const sum = p.f.reduce((s, x, i) => s + x * i, 0);
    switch (depth) {
      case 1: {
        const mean = r2(sum / total);
        return A.standard({
          question: ["The table shows how many pets some children have.", table],
          ask: "Find the mean number of pets, to 2 decimal places.",
          answer: A.number(mean, { accuracy: { dp: 2 } }),
          wrong: wrongs(mean, [
            {
              code: "STA.MEAN.DIVISOR",
              value: A.number(r2(sum / 5), { accuracy: { dp: 2 } }),
              feedback: `Divide by the number of children, ${total}, not the number of rows.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{${sum}}{${total}} = ${mean}`,
            },
          ],
        });
      }
      case 2: {
        const mode = p.f.indexOf(Math.max(...p.f));
        return A.standard({
          question: ["The table shows how many pets some children have.", table],
          ask: "What is the mode?",
          answer: A.number(mode),
          wrong: wrongs(mode, [
            {
              code: "STA.MODE.FREQUENCY",
              value: A.number(Math.max(...p.f)),
              feedback:
                "The mode is the value with the highest frequency, not the frequency itself.",
            },
          ]),
          solution: [{ say: `The highest frequency is ${Math.max(...p.f)}, for ${mode} pets.` }],
        });
      }
      default: {
        const mean = r2(p.sx / p.n);
        return A.trueOrFalseWhy({
          rng,
          statement: `For ${p.n} values, Σx = ${p.sx}. Jo adds one more value equal to the mean and says the mean stays ${mean}.`,
          truth: true,
          reasons: [
            {
              text: `True. The new total is ${p.sx} + ${mean} over ${p.n + 1} values, which is still the mean.`,
              correct: true,
            },
            {
              text: `False. The mean must change because there are now ${p.n + 1} values.`,
              code: "STA.MEAN.DIVISOR",
            },
            { text: "False. Adding any value always increases the mean." },
          ],
          solution: [{ say: "Adding a value equal to the mean leaves the mean unchanged." }],
        });
      }
    }
  },

  verify(p, question) {
    const total = p.f.reduce((s, x) => s + x, 0);
    const sum = p.f.reduce((s, x, i) => s + x * i, 0);
    if (question.key.depth === 1) return numberAnswer(question) === r2(sum / total);
    if (question.key.depth === 2) return numberAnswer(question) === p.f.indexOf(Math.max(...p.f));
    return true;
  },
});
