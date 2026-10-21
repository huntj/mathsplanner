/**
 * @statement Y4-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-STA-01: Interpret and present discrete and continuous data using appropriate graphical methods,
// including bar charts and time graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { lineGraph } from "../shared/sta.ts";

interface Params {
  /** Temperatures at 8, 10, 12, 14, 16 o'clock, in °C (multiples of 4). */
  temps: number[];
  ask: number;
}

const HOURS = [8, 10, 12, 14, 16];

export default defineGenerator<Params>({
  id: "Y4-STA-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ"],

  params(rng) {
    const temps = HOURS.map(() => rng.int(1, 5) * 4);
    const rises = temps.slice(1).map((t, i) => t - (temps[i] ?? 0));
    const best = Math.max(...rises);
    if (rises.filter((r) => r === best).length > 1 || best <= 0) reject("one clear biggest rise");
    return { temps, ask: rng.int(0, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const graph = A.figure(
      lineGraph(
        HOURS.map((h, i) => [h, p.temps[i] ?? 0] as [number, number]),
        { min: 8, max: 16, step: 2, label: "time (hours)" },
        { min: 0, max: 24, step: 4, label: "°C" },
        "A line graph of temperature through the day, with readings every two hours.",
      ),
    );
    const intro =
      "The graph shows the temperature in a garden through the day. The time is on the 24-hour clock.";
    switch (depth) {
      case 1: {
        const t = p.temps[p.ask] ?? 0;
        const h = HOURS[p.ask] ?? 8;
        return A.standard({
          question: [intro, graph],
          ask: `What was the temperature at ${h}:00, in °C?`,
          answer: A.number(t),
          wrong: wrongs(t, [
            {
              code: "STA.SCALE.READ",
              value: A.number(t / 4),
              feedback: "The temperature scale goes up in 4s, so each line is worth 4 degrees.",
            },
          ]),
          solution: [{ say: `Go up from ${h} to the line, then across to the scale: ${t} °C.` }],
        });
      }
      case 2: {
        const rises = p.temps.slice(1).map((t, i) => t - (p.temps[i] ?? 0));
        const k = rises.indexOf(Math.max(...rises));
        const span = (i: number) => `${HOURS[i]}:00 and ${HOURS[i + 1]}:00`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [intro, graph],
          ask: "Between which two readings did the temperature rise the most?",
          correct: span(k),
          distractors: [0, 1, 2, 3]
            .filter((i) => i !== k)
            .map((i) => ({
              content: span(i),
              feedback: `From ${span(i)} the temperature changed by ${rises[i]} °C.`,
            })),
          solution: [
            {
              say: `The steepest upward part of the line is between ${span(k)}: a rise of ${rises[k]} °C.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            graph,
            " Sid says you can use the line to estimate the temperature at 11:00, even though it was not measured then.",
          ],
          truth: true,
          reasons: [
            {
              text: "True. Temperature changes smoothly over time, so the line between the 10:00 and 12:00 readings gives a sensible estimate.",
              correct: true,
            },
            {
              text: "False. You can only read values at the points that were measured.",
              code: "STA.SCALE.READ",
            },
            { text: "False. Line graphs can only show whole hours." },
          ],
          solution: [
            {
              say: "Time and temperature are continuous, which is why the points are joined with a line.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.temps[p.ask];
    if (question.archetype === "varied-form") {
      const rises = p.temps.slice(1).map((t, i) => t - (p.temps[i] ?? 0));
      const k = rises.indexOf(Math.max(...rises));
      return chosenText(question) === `${HOURS[k]}:00 and ${HOURS[k + 1]}:00`;
    }
    return true;
  },
});
