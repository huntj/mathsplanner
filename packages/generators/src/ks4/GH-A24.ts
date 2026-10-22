/**
 * @statement GH-A24
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A24: Work with geometric sequences with surd ratios and other sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Terms a, a√k, ak, ak√k, … */
  a: number;
  k: 2 | 3 | 5;
  claimTrue: boolean;
}

const term = (p: Params, n: number) => Surd.from(p.a).mul(Surd.term(1, p.k).pow(n - 1));
const list = (p: Params, n: number) =>
  Array.from({ length: n }, (_, i) => toLatex(term(p, i + 1))).join(",\\ ");

export default defineGenerator<Params>({
  id: "GH-A24",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng) {
    return { a: rng.int(1, 5), k: rng.pick([2, 3, 5] as const), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const next = term(p, 5);
        const t3 = term(p, 3);
        const t4 = term(p, 4);
        return A.standard({
          question: [
            "Here are the first four terms of a geometric sequence: ",
            A.math(list(p, 4)),
            ".",
          ],
          ask: "Write down the next term.",
          answer: A.exact(next),
          wrong: [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.exact(t4.add(t4.sub(t3))),
              feedback: `Multiply by the common ratio √${p.k} each time; do not add.`,
            },
          ],
          solution: [
            {
              say: "Each term is the one before multiplied by ",
              math: `\\sqrt{${p.k}}: ${toLatex(t4)} \\times \\sqrt{${p.k}} = ${toLatex(next)}`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A geometric sequence begins ", A.math(list(p, 3)), "."],
              ask: "What is its common ratio?",
            },
            {
              question: [
                "Find the common ratio of the geometric sequence ",
                A.math(`${list(p, 3)},\\ \\dots`),
                ".",
              ],
            },
          ],
          answer: A.exact(Surd.term(1, p.k)),
          wrong: [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.exact(term(p, 2).sub(term(p, 1))),
              feedback: "The ratio is found by dividing a term by the one before, not subtracting.",
            },
          ],
          solution: [{ say: "", math: `${toLatex(term(p, 2))} \\div ${p.a} = \\sqrt{${p.k}}` }],
        });
      default: {
        const sixth = term(p, 6);
        const claimed = p.claimTrue ? sixth : Surd.from(p.a * p.k ** 3);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The geometric sequence ",
            A.math(`${list(p, 3)},\\ \\dots`),
            " has common ratio ",
            A.math(`\\sqrt{${p.k}}`),
            ". Kim says the 6th term is ",
            A.math(toLatex(claimed)),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The 6th term is ${p.a} × (√${p.k})⁵ = ${p.a} × ${p.k * p.k}√${p.k}.`,
                  correct: true,
                },
                {
                  text: `False. It is ${p.a * p.k ** 3}, because the terms are whole numbers.`,
                  code: "ALG.SEQUENCE.GEOMETRIC-ADD",
                },
                { text: "False. Surds cannot be raised to powers." },
              ]
            : [
                {
                  text: `False. The 6th term is ${p.a} × (√${p.k})⁵, which still has a √${p.k}. ${p.a * p.k ** 3} is the 7th term.`,
                  correct: true,
                },
                { text: "True. Every other term is a whole number, so the 6th is too." },
                {
                  text: "True. Add the same amount each time.",
                  code: "ALG.SEQUENCE.GEOMETRIC-ADD",
                },
              ],
          solution: [{ say: "The nth term is a × r^(n − 1); odd powers of √k keep a √k." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === toLatex(term(p, 5));
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(Surd.term(1, p.k));
    return true;
  },
});
