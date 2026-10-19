import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  assertPlainJson,
  createRegistry,
  defineGenerator,
  GenerationError,
  type GeneratorDefinition,
} from "./generator.ts";
import { latex, toLatex } from "./latex.ts";
import { NUMBERS, type Depth } from "./question.ts";
import { reject } from "./random.ts";
import { frac, type Rational } from "./rational.ts";
import type { Statement } from "./statement.ts";

interface AddParams {
  a: Rational;
  b: Rational;
}

/** A small placeholder generator in the shape of the design doc's Y6-FR-03 example. */
const definition: GeneratorDefinition<AddParams> = {
  id: "Y6-FR-03",
  version: "1.0.0",
  depths: [1, 5],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS"],
  params(rng, numbers) {
    const dens = {
      friendly: [2, 3, 4, 6],
      standard: [2, 3, 4, 5, 6, 8, 10, 12],
      stretch: [6, 7, 8, 9, 12],
    }[numbers];
    const [d1, d2] = rng.distinct(dens, 2, (x, y) => x % y !== 0 && y % x !== 0) as [
      number,
      number,
    ];
    return { a: frac(rng.int(1, d1 - 1), d1), b: frac(rng.int(1, d2 - 1), d2) };
  },
  accept: ({ a, b }) => a.add(b).lt(1),
  build({ a, b }, depth) {
    const answer = a.add(b);
    if (depth === 1) {
      return {
        archetype: "standard",
        stem: [{ t: "math", v: latex`${a} + ${b}` }],
        parts: [
          {
            prompt: [{ t: "text", v: "Work out the sum." }],
            answer: { type: "exact", value: toLatex(answer), form: "simplest" },
            misconceptions: [
              {
                code: "FR.ADD.TOPS-AND-BOTTOMS",
                answer: { type: "exact", latex: toLatex(frac(a.n + b.n, a.d + b.d)) },
                feedback: [{ t: "text", v: "Find a common denominator first." }],
              },
            ],
          },
        ],
      };
    }
    // Depth 5: two different unit fractions with this sum must exist.
    const units = [];
    for (let n = 2n; n <= 60n; n++) {
      const rest = answer.sub(frac(1n, n));
      if (rest.isUnit() && rest.d !== n) units.push(n);
    }
    if (units.length === 0) reject("no unit fraction pair");
    return {
      archetype: "open-construction",
      stem: [
        { t: "text", v: "Find two different unit fractions with a sum of " },
        { t: "math", v: toLatex(answer) },
      ],
      parts: [
        {
          prompt: [],
          answer: {
            type: "condition",
            inputs: ["exact", "exact"],
            describe: [{ t: "text", v: "Two different unit fractions with the given sum" }],
            check: () => true,
          },
          marks: 2,
        },
      ],
    };
  },
  solution: ({ a, b }) => [
    { say: [{ t: "text", v: "Use a common denominator." }], math: latex`${a} + ${b}` },
  ],
};

const generator = defineGenerator(definition);
const request = { depth: 1 as Depth, numbers: "standard" as const, seed: 42 };

describe("defineGenerator", () => {
  it("builds a complete question with its key", () => {
    const q = generator.generate(request);
    expect(q.key).toEqual({
      statementId: "Y6-FR-03",
      depth: 1,
      numbers: "standard",
      seed: 42,
      version: "1.0.0",
    });
    expect(q.archetype).toBe("standard");
    expect(q.parts[0]?.marks).toBe(1);
    expect(q.meta).toEqual({ calculator: false, marks: 1, minutes: 1, tags: [] });
    expect(q.solution).toHaveLength(1);
  });

  it("is deterministic: the same key always gives the same question", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Depth>(1, 5),
        fc.constantFrom(...NUMBERS),
        fc.nat(),
        (depth, numbers, seed) => {
          const a = generator.generate({ depth, numbers, seed });
          const b = generator.generate({ depth, numbers, seed });
          expect(JSON.stringify(a)).toBe(JSON.stringify(b));
        },
      ),
      { numRuns: 200 },
    );
  });

  it("produces plain JSON that survives a round trip", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<Depth>(1, 5),
        fc.constantFrom(...NUMBERS),
        fc.nat(),
        (depth, numbers, seed) => {
          const q = generator.generate({ depth, numbers, seed });
          expect(JSON.parse(JSON.stringify(q))).toEqual(q);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("uses the same parameters at every depth for one seed when no depth rejects them", () => {
    const allDepths = defineGenerator({
      ...definition,
      depths: [1, 2, 3, 4, 5],
      build: (params, _depth, rng) => definition.build(params, 1, rng),
    });
    fc.assert(
      fc.property(fc.constantFrom(...NUMBERS), fc.nat(), (numbers, seed) => {
        const at = (depth: Depth) => allDepths.generateFull({ depth, numbers, seed }).params;
        const first = at(1);
        for (const depth of [2, 3, 4, 5] as const) {
          expect(at(depth).a.eq(first.a) && at(depth).b.eq(first.b)).toBe(true);
        }
      }),
      { numRuns: 50 },
    );
  });

  it("only ever returns parameters that pass accept", () => {
    fc.assert(
      fc.property(fc.constantFrom(...NUMBERS), fc.nat(), (numbers, seed) => {
        const { params } = generator.generateFull({ depth: 1, numbers, seed });
        expect(params.a.add(params.b).lt(1)).toBe(true);
      }),
    );
  });

  it("retries after reject() and keeps validators out of the JSON", () => {
    const { question, validators } = generator.generateFull({ ...request, depth: 5 });
    expect(question.parts[0]?.answer).not.toHaveProperty("check");
    expect(validators.get(0)?.([])).toBe(true);
    expect(question.meta.marks).toBe(2);
  });

  it("refuses unsupported depths, bad seeds and other versions", () => {
    expect(() => generator.generate({ ...request, depth: 3 })).toThrow("does not support depth 3");
    expect(() => generator.generate({ ...request, seed: -1 })).toThrow(GenerationError);
    expect(() => generator.generate({ ...request, seed: 1.5 })).toThrow(GenerationError);
    expect(() => generator.generate({ ...request, version: "0.9.0" })).toThrow("not 0.9.0");
    expect(() => generator.generate({ ...request, version: "1.0.0" })).not.toThrow();
  });

  it("gives up after maxAttempts", () => {
    const never = defineGenerator({ ...definition, accept: () => false, maxAttempts: 5 });
    expect(() => never.generate(request)).toThrow("no acceptable parameters in 5 attempts");
  });

  it("lets other errors through", () => {
    const broken = defineGenerator({
      ...definition,
      build: () => {
        throw new TypeError("bug");
      },
    });
    expect(() => broken.generate(request)).toThrow(TypeError);
  });

  it("checks the definition", () => {
    expect(() => defineGenerator({ ...definition, id: "Y6-FR-3" })).toThrow("not a statement ID");
    expect(() => defineGenerator({ ...definition, version: "1.0" })).toThrow("not x.y.z");
    expect(() => defineGenerator({ ...definition, depths: [] })).toThrow("depths is empty");
    expect(() => defineGenerator({ ...definition, depths: [1, 1] })).toThrow("duplicates");
    expect(() => defineGenerator({ ...definition, misconceptions: ["fr.add"] })).toThrow(
      "malformed",
    );
  });

  it("checks what build returns", () => {
    const withDraft = (draft: ReturnType<GeneratorDefinition<AddParams>["build"]>) =>
      defineGenerator({ ...definition, build: () => draft }).generate(request);
    const part = {
      prompt: [],
      answer: { type: "number" as const, value: 1, accuracy: { exact: true as const } },
    };
    expect(() => withDraft({ archetype: "standard", stem: [], parts: [] })).toThrow("no parts");
    expect(() =>
      withDraft({ archetype: "standard", stem: [{ t: "diagram", i: 0 }], parts: [part] }),
    ).toThrow("diagram 0 does not exist");
    expect(() =>
      withDraft({
        archetype: "standard",
        stem: [],
        parts: [
          {
            ...part,
            misconceptions: [
              { code: "FR.OTHER", answer: { type: "number", value: 2 }, feedback: [] },
            ],
          },
        ],
      }),
    ).toThrow("undeclared misconception FR.OTHER");
    expect(() =>
      withDraft({
        archetype: "standard",
        stem: [{ t: "math", v: frac(1, 2) as unknown as string }],
        parts: [part],
      }),
    ).toThrow("is a Rational, not plain JSON");
  });
});

describe("assertPlainJson", () => {
  it("accepts JSON and rejects everything else", () => {
    expect(() => assertPlainJson({ a: [1, "x", null, true, { b: 2 }] })).not.toThrow();
    expect(() => assertPlainJson({ a: undefined })).toThrow("question.a is undefined");
    expect(() => assertPlainJson([Number.NaN])).toThrow("question[0] is NaN");
    expect(() => assertPlainJson({ f: () => 1 })).toThrow("function");
    expect(() => assertPlainJson({ n: 1n })).toThrow("bigint");
    expect(() => assertPlainJson(new Date())).toThrow("Date");
  });
});

describe("createRegistry", () => {
  const statement: Statement = {
    id: "Y6-FR-03",
    stage: "Y6",
    strand: "FR",
    text: "Add and subtract fractions",
    needs: [],
    source: "NC KS2",
    statutory: true,
  };

  it("attaches statement metadata", () => {
    const registry = createRegistry([generator], [statement]);
    expect(registry.get("Y6-FR-03")?.statement.text).toBe("Add and subtract fractions");
    expect(registry.entries()).toHaveLength(1);
    expect(registry.get("Y6-FR-04")).toBeUndefined();
  });

  it("fails on unknown or duplicate statements", () => {
    expect(() => createRegistry([generator], [])).toThrow("unknown statement ID");
    expect(() => createRegistry([generator, generator], [statement])).toThrow("registered twice");
  });
});
