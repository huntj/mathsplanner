/**
 * @statement N-NPV-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-08: Compare quantities using language such as 'more than' and 'fewer than'
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenFigure, chosenText, countOf, objects } from "../shared/counting.ts";

interface Params {
  /** Stars and counters; never equal. */
  stars: number;
  counters: number;
  ask: "more" | "fewer";
  seed: number;
}

export default defineGenerator<Params>({
  id: "N-NPV-08",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COMPARE.SPREAD"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 5 : numbers === "standard" ? 7 : 9;
    const stars = rng.int(1, top);
    const counters = rng.int(1, top);
    if (stars === counters || (numbers === "friendly" && Math.abs(stars - counters) < 2))
      reject("the groups must differ clearly");
    return { stars, counters, ask: rng.pick(["more", "fewer"] as const), seed: rng.int(0, 999) };
  },

  build(p, depth, rng): QuestionDraft {
    // The smaller group is spread out, so it looks bigger: the classic trap.
    const starsSpread = p.stars < p.counters;
    const starFigure = objects(p.stars, {
      shape: "star",
      arrangement: starsSpread ? "scatter" : "row",
      seed: p.seed,
      hidden: true,
    });
    const counterFigure = objects(p.counters, {
      arrangement: starsSpread ? "row" : "scatter",
      seed: p.seed,
      hidden: true,
    });
    const winner = (p.ask === "more") === p.stars > p.counters ? "The stars" : "The counters";
    const loser = winner === "The stars" ? "The counters" : "The stars";
    const spreadIsLoser = (loser === "The stars") === starsSpread;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Here are some stars.",
            A.figure(starFigure),
            "Here are some counters.",
            A.figure(counterFigure),
          ],
          ask: `Which group has ${p.ask}?`,
          correct: winner,
          distractors: [
            {
              content: loser,
              ...(p.ask === "more" && spreadIsLoser
                ? {
                    code: "NPV.COMPARE.SPREAD",
                    feedback:
                      "Those are spread out, but there are not more of them. Count each group.",
                  }
                : { feedback: "Count each group and compare." }),
            },
            {
              content: "They have the same",
              feedback: `Count again: there are ${p.stars} stars and ${p.counters} counters.`,
            },
          ],
          solution: [
            {
              say: `There are ${p.stars} stars and ${p.counters} counters, so ${winner.toLowerCase()} have ${p.ask}.`,
            },
          ],
        });
      case 3: {
        const counts = [p.stars, p.counters, Math.max(p.stars, p.counters) + 2];
        const target = p.ask === "more" ? Math.max(...counts) : Math.min(...counts);
        const [best, ...rest] = [target, ...counts.filter((c) => c !== target)];
        if (best === undefined || new Set(counts).size < 3)
          return reject("need three different groups");
        return A.chooseTheDiagram({
          rng,
          question: "Look at the groups of counters.",
          ask: `Which group has the ${p.ask === "more" ? "most" : "fewest"}?`,
          correct: objects(best, { arrangement: "row", hidden: true }),
          distractors: rest.map((c, i) => ({
            figure: objects(c, {
              arrangement: i === 0 ? "scatter" : "row",
              seed: p.seed,
              hidden: true,
            }),
            feedback: `That group has ${c}.`,
          })),
          solution: [
            {
              say: `Count each group. The one with ${best} has the ${p.ask === "more" ? "most" : "fewest"}.`,
            },
          ],
        });
      }
      default: {
        const few = Math.min(p.stars, p.counters);
        const many = Math.max(p.stars, p.counters);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben looks at these groups.",
            A.figure(
              objects(few, { shape: "star", arrangement: "scatter", seed: p.seed, hidden: true }),
            ),
            A.figure(objects(many, { arrangement: "row", hidden: true })),
            "He says there are more stars than counters, because the stars are spread out.",
          ],
          truth: false,
          reasons: [
            {
              text: `Count them: ${few} stars and ${many} counters, so there are more counters.`,
              correct: true,
            },
            {
              text: "The stars take up more space, so there are more of them.",
              code: "NPV.COMPARE.SPREAD",
            },
            { text: "Stars and counters cannot be compared." },
          ],
          solution: [
            {
              say: `How spread out a group is does not change how many there are. ${many} is more than ${few}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const want = p.ask === "more" ? Math.max : Math.min;
    if (question.archetype === "standard") {
      const winner = want(p.stars, p.counters) === p.stars ? "The stars" : "The counters";
      return (
        chosenText(question) === winner &&
        countOf(question.diagrams[0]) === p.stars &&
        countOf(question.diagrams[1]) === p.counters
      );
    }
    if (question.archetype === "choose-the-diagram") {
      const all = question.diagrams.map(countOf);
      return countOf(chosenFigure(question)) === want(...all);
    }
    return countOf(question.diagrams[0]) < countOf(question.diagrams[1]);
  },
});
