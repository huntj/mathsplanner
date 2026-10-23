/**
 * @statement GF-A4.e
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.e: Factorise x² + bx + c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";

interface Params {
  p: number;
  q: number;
  r: number;
  s: number;
  /** Depth 4: a shared factor (x + f), three partners for it, and an odd quadratic. */
  f: number;
  partners: number[];
  odd: number[];
}

const factorised = (p: number, q: number) => `${bracket(Math.min(p, q))}${bracket(Math.max(p, q))}`;

export default defineGenerator<Params>({
  id: "GF-A4.e",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng, numbers) {
    const top = numbers === "stretch" ? 12 : 9;
    const p = {
      p: rng.int(1, top),
      q: rng.int(1, top),
      r: rng.int(1, top) * rng.pick([1, -1]),
      s: rng.int(1, top) * -1,
      f: rng.int(1, 6),
      partners: [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)],
      odd: [rng.int(1, 9), rng.int(1, 9)],
    };
    if (p.p === p.q || p.r === p.s || p.r + p.s === 0)
      reject("two different factors and a middle term");
    if (new Set(p.partners).size < 3 || p.partners.includes(p.f))
      reject("three different partners");
    if (p.odd.includes(p.f) || p.odd[0] === p.odd[1])
      reject("an odd one out without the shared factor");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = factorised(p.p, p.q);
        return A.standard({
          question: ["Factorise ", A.math(poly([1, p.p + p.q, p.p * p.q])), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(factorised(1, p.p * p.q)),
              feedback: `Find two numbers that multiply to ${p.p * p.q} and add to ${p.p + p.q}.`,
            },
          ].filter(() => p.p * p.q + 1 !== p.p + p.q),
          solution: [
            {
              say: `${p.p} × ${p.q} = ${p.p * p.q} and ${p.p} + ${p.q} = ${p.p + p.q}: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = factorised(p.r, p.s);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Factorise ", A.math(poly([1, p.r + p.s, p.r * p.s])), "."] },
            {
              question: [
                "Write ",
                A.math(poly([1, p.r + p.s, p.r * p.s])),
                " as the product of two brackets.",
              ],
            },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(factorised(-p.r, -p.s)),
              feedback: `Check the signs: the numbers must add to ${p.r + p.s}, not ${-(p.r + p.s)}.`,
            },
          ],
          solution: [
            {
              say: `${p.r} × ${p.s} = ${p.r * p.s} and ${p.r} + ${p.s} = ${p.r + p.s}: `,
              math: right,
            },
          ],
        });
      }
      default: {
        const items = [
          ...p.partners.map((m) => ({ content: A.math(poly([1, p.f + m, p.f * m])) })),
          {
            content: A.math(
              poly([1, (p.odd[0] ?? 1) + (p.odd[1] ?? 2), (p.odd[0] ?? 1) * (p.odd[1] ?? 2)]),
            ),
            odd: true,
          },
        ];
        return A.oddOneOut({
          rng,
          question: "Which quadratic is the odd one out?",
          items,
          reasons: [
            { text: `It is the only one without a factor of (x + ${p.f}).`, correct: true },
            { text: "It is the only one with a positive constant term." },
            { text: "It is the only one that cannot be factorised.", code: "ALG.FACTORISE.SIGNS" },
          ],
          solution: [
            {
              say: `Factorising: ${p.partners.map((m) => factorised(p.f, m)).join(", ")} all contain (x + ${p.f}); the other is ${factorised(p.odd[0] ?? 1, p.odd[1] ?? 2)}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === factorised(p.p, p.q);
    return true;
  },
});
