/**
 * @statement Y2-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-STA-02: Ask and answer simple questions by counting objects in each category and sorting by
// quantity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { distinctValues, pictogram, TOPICS } from "../shared/sta.ts";

interface Params {
  topic: number;
  values: number[];
  key: number;
  most: boolean;
}

export default defineGenerator<Params>({
  id: "Y2-STA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.KEY-IGNORED"],

  params(rng, numbers) {
    const key = numbers === "stretch" ? 2 : 1;
    return {
      topic: rng.int(0, TOPICS.length - 1),
      values: distinctValues(rng, 4, 1, 8).map((v) => v * key),
      key,
      most: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const topic = TOPICS[p.topic] ?? TOPICS[0];
    if (!topic) throw new Error("no topic");
    const cats = topic.categories.slice(0, 4);
    const figure = A.figure(pictogram(topic, p.values, p.key));
    const order = cats.map((c, i) => [c, p.values[i] ?? 0] as const).sort((a, b) => a[1] - b[1]);
    const [least, most] = [order[0]?.[0] ?? "", order.at(-1)?.[0] ?? ""];
    switch (depth) {
      case 1: {
        const target = p.most ? most : least;
        return A.choice({
          rng,
          question: [`The pictogram shows the ${topic.what} of some ${topic.who}.`, figure],
          ask: `Which was chosen by the ${p.most ? "most" : "fewest"} ${topic.who}?`,
          correct: target,
          distractors: cats
            .filter((c) => c !== target)
            .map((c) => ({
              content: c,
              feedback: `Count the symbols in each row: ${target} has the ${p.most ? "most" : "fewest"}.`,
            })),
          solution: [
            {
              say: `${target} has ${p.values[cats.indexOf(target)]}, the ${p.most ? "most" : "fewest"}.`,
            },
          ],
        });
      }
      case 2: {
        const right = order.map(([c]) => c);
        const reversed = [...right].reverse();
        const asListed = [...cats];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`The pictogram shows the ${topic.what} of some ${topic.who}.`, figure],
          ask: "Which list puts them in order, from fewest to most?",
          correct: right.join(", "),
          distractors: [
            { content: reversed.join(", "), feedback: "That is from most to fewest." },
            ...(asListed.join() !== right.join()
              ? [
                  {
                    content: asListed.join(", "),
                    feedback: "That is the order of the rows, not the order of the numbers.",
                  },
                ]
              : []),
            {
              content: [right[1], right[0], right[2], right[3]].join(", "),
              feedback: "Check the first two again.",
            },
          ].filter(
            (o, i, all) =>
              o.content !== right.join(", ") && all.findIndex((x) => x.content === o.content) === i,
          ),
          solution: [{ say: `In order: ${order.map(([c, v]) => `${c} (${v})`).join(", ")}.` }],
        });
      }
      default: {
        const big = order.at(-1);
        const second = order.at(-2);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `The pictogram shows the ${topic.what} of some ${topic.who}.`,
            figure,
            ` Ali says more ${topic.who} chose ${second?.[0]} than ${big?.[0]}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${big?.[0]} has ${big?.[1]} and ${second?.[0]} has ${second?.[1]}, so ${big?.[0]} has more.`,
              correct: true,
            },
            { text: "True. Its row is nearer the top.", code: "STA.KEY-IGNORED" },
            { text: "True. Its name is longer." },
          ],
          solution: [
            {
              say: `Count the symbols and use the key: ${big?.[0]} ${big?.[1]}, ${second?.[0]} ${second?.[1]}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const topic = TOPICS[p.topic];
    if (!topic) return false;
    const cats = topic.categories.slice(0, 4);
    const order = cats.map((c, i) => [c, p.values[i] ?? 0] as const).sort((a, b) => a[1] - b[1]);
    if (question.archetype === "standard")
      return chosenText(question) === (p.most ? order.at(-1)?.[0] : order[0]?.[0]);
    if (question.archetype === "varied-form")
      return chosenText(question) === order.map(([c]) => c).join(", ");
    return true;
  },
});
