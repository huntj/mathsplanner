/**
 * @statement FM-D2-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-05: Analyse two-person zero-sum games, including play-safe strategies and mixed strategies
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  m: number[][];
  g: number[];
}

const rowMins = (m: number[][]) => m.map((r) => Math.min(...r));
const playSafe = (m: number[][]) => rowMins(m).indexOf(Math.max(...rowMins(m)));
const bigRow = (m: number[][]) =>
  m.map((r) => Math.max(...r)).indexOf(Math.max(...m.map((r) => Math.max(...r))));

/** For a 2 × 2 game [[a, b], [c, d]] with no saddle point, the probability A plays row 1. */
const mixP = ([a = 0, b = 0, c = 0, d = 0]: number[]) => toLatex(frac(d - c, a - b - c + d));

export default defineGenerator<Params>({
  id: "FM-D2-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.GAMES"],

  params(rng) {
    const e = () => rng.int(-5, 8);
    const m = [0, 1, 2].map(() => [e(), e(), e()]);
    const mins = rowMins(m);
    if (mins.filter((x) => x === Math.max(...mins)).length > 1 || playSafe(m) === bigRow(m))
      reject("a unique play-safe row that is not the row with the biggest pay-off");
    const g = [e(), e(), e(), e()];
    const [a = 0, b = 0, c = 0, d = 0] = g;
    // No saddle point: the larger entries are on one diagonal.
    if (!((a > b && a > c && d > b && d > c) || (b > a && b > d && c > a && c > d)))
      reject("a game with no saddle point");
    if (mixP(g) === toLatex(frac(1, 2)) || mixP(g) === toLatex(frac(a - b, a - b - c + d)))
      reject("p different from 1 − p");
    return { m, g };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `Row ${playSafe(p.m) + 1}`;
        const others = [0, 1, 2].filter((i) => i !== playSafe(p.m));
        return A.choice({
          rng,
          question: [
            "The table shows the pay-offs to player A, who chooses a row, in a zero-sum game.",
            A.math(
              tableLatex(
                ["", "Col 1", "Col 2", "Col 3"],
                p.m.map((r, i) => [`Row ${i + 1}`, ...r]),
              ),
            ),
          ],
          ask: "Which row is A's play-safe strategy?",
          correct: right,
          distractors: others.map((i) => ({
            content: `Row ${i + 1}`,
            code: "DEC.GAMES",
            feedback:
              i === bigRow(p.m)
                ? "That row has the biggest pay-off, but the play-safe strategy maximises the worst case: the largest row minimum."
                : "Find each row's minimum, then choose the largest of these.",
          })),
          solution: [
            { say: `The row minima are ${rowMins(p.m).join(", ")}. The largest is in ${right}.` },
          ],
        });
      }
      case 2: {
        const [a, b, c, d] = p.g;
        const v = mixP(p.g);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "In a zero-sum game, player A's pay-offs are given by ",
                A.math(`\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`),
                ", where A chooses a row. The game has no stable solution.",
              ],
              ask: "A plays row 1 with probability p to make the expected pay-off the same whatever B does. Find p.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "DEC.GAMES",
              value: A.exact(
                toLatex(frac((a ?? 0) - (b ?? 0), (a ?? 0) - (b ?? 0) - (c ?? 0) + (d ?? 0))),
              ),
              feedback: "That is 1 − p. Set ap + c(1 − p) = bp + d(1 − p) and solve for p.",
            },
          ],
          solution: [
            { say: "", math: `${a}p + ${c}(1 - p) = ${b}p + ${d}(1 - p) \\Rightarrow p = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Vic says that in a zero-sum game each player's expected pay-off is zero."],
          truth: false,
          reasons: [
            {
              text: "False. Zero-sum means that whatever one player wins, the other loses: the pay-offs add to zero in every outcome. The value of the game can still favour one player.",
              correct: true,
            },
            { text: "True. Zero-sum means nobody wins on average.", code: "DEC.GAMES" },
            { text: "True. A fair game is the same as a zero-sum game.", code: "DEC.GAMES" },
          ],
          solution: [{ say: "The value of the game is A's expected pay-off with optimal play." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `Row ${playSafe(p.m) + 1}`;
    if (question.key.depth === 2) return exactAnswer(question) === mixP(p.g);
    return true;
  },
});
