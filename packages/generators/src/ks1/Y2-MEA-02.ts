/**
 * @statement Y2-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-02: Compare and order lengths, mass, volume/capacity and record the results using >, <
// and =
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  unit: number;
  masses: [number, number, number];
  metres: number;
  cm: number;
}

const UNITS = ["cm", "g", "ml", "kg", "m"];
const sign = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

export default defineGenerator<Params>({
  id: "Y2-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.COMPARE.ONES-FIRST", "MEA.UNITS.MIXED"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 50 : 100;
    const a = rng.int(10, top);
    const b = rng.bool() ? a : rng.int(10, top);
    // Three masses with the same digits in different orders, e.g. 35, 53 and 305.
    const x = rng.int(1, 9);
    const y = rng.int(1, 9);
    if (x === y) reject("two different digits");
    const masses = rng.shuffle([
      10 * x + y,
      10 * y + x,
      numbers === "friendly" ? x + y + 10 * Math.max(x, y) + 1 : 100 * x + y,
    ]) as [number, number, number];
    if (new Set(masses).size < 3) reject("three different masses");
    const metres = rng.int(1, 3);
    const cm = rng.int(metres * 10 + 1, metres * 100 - 1);
    if (cm % 10 === 0) reject("a cm value that is not a round number");
    return { a, b, unit: rng.int(0, UNITS.length - 1), masses, metres, cm };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const u = UNITS[p.unit] ?? "cm";
        const s = sign(p.a, p.b);
        const flipped = s === "<" ? ">" : s === ">" ? "<" : undefined;
        return A.choice({
          rng,
          question: [
            "Which sign makes this true?",
            A.displayMath(`${p.a}\\text{ ${u}}\\ \\square\\ ${p.b}\\text{ ${u}}`),
          ],
          correct: A.math(s),
          distractors: (["<", ">", "="] as const)
            .filter((o) => o !== s)
            .map((o) => ({
              content: A.math(o),
              ...(o === flipped ? { code: "NPV.COMPARE.SIGN-DIRECTION" } : {}),
              feedback:
                s === "="
                  ? "The two amounts are the same, so use =."
                  : `The sign opens towards the bigger amount. ${Math.max(p.a, p.b)} ${u} is bigger.`,
            })),
          solution: [{ say: `${p.a} ${u} ${s} ${p.b} ${u}.` }],
        });
      }
      case 2: {
        const heaviest = Math.max(...p.masses);
        const byOnes = [...p.masses].sort((m, n) => (m % 10) - (n % 10) || n - m).pop() ?? heaviest;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Three parcels weigh ${p.masses.map((m) => `${m} g`).join(", ")}.`,
          ask: "Which parcel is the heaviest?",
          correct: `${heaviest} g`,
          distractors: p.masses
            .filter((m) => m !== heaviest)
            .map((m) => ({
              content: `${m} g`,
              ...(m === byOnes ? { code: "NPV.COMPARE.ONES-FIRST" } : {}),
              feedback: `Compare the hundreds first, then the tens. ${heaviest} g is heaviest.`,
            })),
          solution: [
            {
              say: `In order from lightest: ${[...p.masses]
                .sort((m, n) => m - n)
                .map((m) => `${m} g`)
                .join(", ")}.`,
            },
          ],
        });
      }
      default: {
        const truth = p.metres * 100 > p.cm;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Joe writes ",
            A.math(`${p.metres}\\text{ m} < ${p.cm}\\text{ cm}`),
            ` because ${p.metres} is less than ${p.cm}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.metres} m is ${p.metres * 100} cm, so ${p.metres} m ${truth ? ">" : "<"} ${p.cm} cm. Compare in the same units.`,
              correct: true,
            },
            {
              text: `True. ${p.metres} is a smaller number than ${p.cm}.`,
              code: "MEA.UNITS.MIXED",
            },
            { text: "True. Metres and centimetres are the same size.", code: "MEA.UNITS.MIXED" },
          ],
          solution: [{ say: `1 m = 100 cm, so ${p.metres} m = ${p.metres * 100} cm.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === sign(p.a, p.b);
    if (question.archetype === "varied-form")
      return chosenText(question) === `${Math.max(...p.masses)} g`;
    return p.metres * 100 > p.cm;
  },
});
