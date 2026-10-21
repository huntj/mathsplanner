/**
 * @statement GF-A23
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A23: Generate terms of a sequence from either a term-to-term or a position-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  n: number;
  start: number;
  mult: number;
  sub: number;
}

export default defineGenerator<Params>({
  id: "GF-A23",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE", "ALG.FUNCTION.ORDER"],

  params(rng) {
    return {
      a: rng.int(2, 9),
      b: rng.int(-10, 10),
      n: rng.int(8, 30),
      start: rng.int(2, 6),
      mult: rng.int(2, 3),
      sub: rng.int(1, 4),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const t = p.a * p.n + p.b;
        return A.standard({
          question: [
            "The nth term of a sequence is ",
            A.math(`${p.a}n ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`),
            ".",
          ],
          ask: `What is the ${p.n}th term?`,
          answer: A.number(t),
          wrong: signedWrongs(t, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a * 10 + p.n + p.b),
              feedback: `${p.a}n means ${p.a} × n, not the digits ${p.a} and n.`,
            },
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a + p.b + p.a * (p.n - 1) + p.a),
              feedback: `Substitute n = ${p.n} straight into the rule.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} \\times ${p.n} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)} = ${t}`,
            },
          ],
        });
      }
      case 2: {
        const terms = [p.start];
        for (let i = 0; i < 4; i++) terms.push((terms[i] as number) * p.mult - p.sub);
        const right = terms.slice(1, 4).join(", ");
        const swapped = [p.start];
        for (let i = 0; i < 3; i++) swapped.push(((swapped[i] as number) - p.sub) * p.mult);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A sequence starts at ${p.start}. The rule is: multiply by ${p.mult}, then subtract ${p.sub}.`,
          ask: "What are the next three terms?",
          correct: right,
          distractors: [
            {
              content: swapped.slice(1).join(", "),
              code: "ALG.FUNCTION.ORDER",
              feedback: `Multiply by ${p.mult} first, then subtract ${p.sub}.`,
            },
            {
              content: [1, 2, 3].map((k) => p.start + k * (p.mult - p.sub)).join(", "),
              code: "ALG.SEQUENCE.POSITION-RULE",
              feedback: "Apply the rule to each term to get the next one.",
            },
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [{ say: `${terms.slice(0, 4).join(" → ")}.` }],
        });
      }
      default: {
        const target = p.a * p.n + p.b + (rng.bool() ? 0 : 1);
        const n = (target - p.b) / p.a;
        const truth = Number.isInteger(n) && n > 0;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Is ",
            A.math(String(target)),
            " a term of the sequence with nth term ",
            A.math(`${p.a}n ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`),
            "?",
          ],
          truth,
          reasons: [
            {
              text: truth
                ? `True. ${p.a}n ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${target} gives n = ${n}, a whole number.`
                : `False. ${p.a}n ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${target} gives n = ${Math.round(n * 100) / 100}, which is not a whole number.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Every number bigger than the first term is in the sequence.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            {
              text: `${truth ? "False" : "True"}. ${target} is in the ${p.a} times table.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
          ],
          solution: [
            {
              say: "Set the nth term equal to the number and solve: a term must have a whole-number position.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.a * p.n + p.b;
    if (question.archetype === "varied-form")
      return chosenText(question).split(", ")[0] === String(p.start * p.mult - p.sub);
    return true;
  },
});
