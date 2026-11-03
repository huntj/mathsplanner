/**
 * @statement Y5-STA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-STA-01: Solve comparison, sum and difference problems using information presented in a line graph
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lineGraph } from "../shared/sta.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** Plant height in cm at weeks 0 to 6, rising. */
  heights: number[];
  a: number;
  b: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y5-STA-01",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ", "AS.PROBLEM.KEYWORD"],

  params(rng) {
    const heights = [rng.int(1, 3) * 2];
    for (let w = 1; w <= 6; w++) heights.push((heights.at(-1) ?? 0) + rng.int(0, 4) * 2);
    if ((heights.at(-1) ?? 0) > 40) reject("heights on the grid");
    const a = rng.int(0, 4);
    const b = rng.int(a + 2, 6);
    if (heights[b] === heights[a]) reject("some growth");
    return { heights, a, b, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const graph = A.figure(
      lineGraph(
        p.heights.map((h, w) => [w, h] as [number, number]),
        { min: 0, max: 6, step: 1, label: "week" },
        { min: 0, max: 40, step: 4, label: "height (cm)" },
        "A line graph of the height of a plant each week for six weeks.",
      ),
    );
    const intro = "The graph shows the height of a plant, measured once a week.";
    const [ha, hb] = [p.heights[p.a] ?? 0, p.heights[p.b] ?? 0];
    switch (depth) {
      case 1:
        return A.standard({
          question: [intro, graph],
          ask: `How much did the plant grow between week ${p.a} and week ${p.b}, in cm?`,
          answer: A.number(hb - ha),
          wrong: wrongs(hb - ha, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(ha + hb),
              feedback: "Growth is the difference between the two heights.",
            },
          ]),
          solution: [
            { say: `Week ${p.a}: ${ha} cm. Week ${p.b}: ${hb} cm. ${hb} − ${ha} = ${hb - ha} cm.` },
          ],
        });
      case 2: {
        const h = p.heights[p.b] ?? 0;
        return A.standard({
          question: [intro, graph],
          ask: `How tall was the plant in week ${p.b}, in cm?`,
          answer: A.number(h),
          wrong: wrongs(h, [
            {
              code: "STA.SCALE.READ",
              value: A.number(h / 4),
              feedback: "The height scale goes up in 4s, so each grid line is worth 4 cm.",
            },
          ]),
          solution: [{ say: `Go up from week ${p.b} to the line, then across: ${h} cm.` }],
        });
      }
      default: {
        const flat = p.heights.slice(1).findIndex((h, i) => h === p.heights[i]);
        const statement =
          flat >= 0
            ? `The plant did not grow between week ${flat} and week ${flat + 1}.`
            : "The plant grew every week.";
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [intro, graph, ` Pia says: "${statement}"`],
              truth: true,
              reasons: [
                {
                  text:
                    flat >= 0
                      ? `True. The line is flat between week ${flat} and week ${flat + 1}: the height stayed the same.`
                      : "True. The line goes up between every pair of weeks.",
                  correct: true,
                },
                { text: "False. A line graph always goes up.", code: "STA.SCALE.READ" },
                { text: "False. You cannot tell growth from a line graph." },
              ],
              solution: [
                { say: "A flat part of the line means no change; going up means the plant grew." },
              ],
            }),
          [
            {
              statement:
                "A line graph's scale goes up in 2s. A point is halfway between 6 and 8. Leo says it shows 7.",
              truth: true,
              right: "True. Halfway between 6 and 8 is 7.",
              wrong: [["False. It shows 6.5.", "STA.SCALE.READ"], ["False. It shows 8."]],
            },
            {
              statement:
                "A line graph shows 12°C at 9:00 and 20°C at 13:00. Ivy says the temperature fell by 8 degrees.",
              truth: false,
              right: "False. It rose by 8 degrees: from 12°C up to 20°C.",
              wrong: [
                ["True. 'By' means take away, and 20 − 12 = 8.", "AS.PROBLEM.KEYWORD"],
                ["True. Temperatures fall during the day."],
              ],
            },
            {
              claim: "A flat part of a line graph shows that nothing changed then.",
              truth: "always",
              right: "Always. A flat line means the value stayed the same.",
              wrong: [
                ["Never. Flat means it went down.", "STA.SCALE.READ"],
                ["Sometimes. Only at the start."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === (p.heights[p.b] ?? 0) - (p.heights[p.a] ?? 0)
      : numberAnswer(question) === p.heights[p.b];
  },
});
