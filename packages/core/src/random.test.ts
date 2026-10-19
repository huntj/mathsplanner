import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createRng, Reject } from "./random.ts";

const seed = fc.string();

describe("Rng", () => {
  it("is pinned: changing these values changes every question ever generated", () => {
    const rng = createRng("Y6-FR-03|standard|42");
    expect([rng.uint32(), rng.uint32(), rng.uint32()]).toMatchInlineSnapshot(`
      [
        4227445482,
        511765524,
        358063622,
      ]
    `);
    expect(createRng("").int(1, 1000)).toMatchInlineSnapshot(`50`);
  });

  it("gives the same sequence for the same seed", () => {
    fc.assert(
      fc.property(seed, (s) => {
        const a = createRng(s);
        const b = createRng(s);
        for (let i = 0; i < 20; i++) expect(a.uint32()).toBe(b.uint32());
      }),
    );
  });

  it("gives different sequences for neighbouring seeds", () => {
    const first = (s: string) => createRng(s).uint32();
    const values = new Set(Array.from({ length: 1000 }, (_, i) => first(`seed ${i}`)));
    expect(values.size).toBe(1000);
  });

  it("keeps int within its inclusive bounds", () => {
    fc.assert(
      fc.property(seed, fc.integer({ min: -1e6, max: 1e6 }), fc.nat(1000), (s, min, span) => {
        const rng = createRng(s);
        for (let i = 0; i < 10; i++) {
          const v = rng.int(min, min + span);
          expect(Number.isInteger(v) && v >= min && v <= min + span).toBe(true);
        }
      }),
    );
  });

  it("makes every int value roughly equally likely", () => {
    const rng = createRng("uniformity");
    const counts = new Array<number>(6).fill(0);
    const draws = 60_000;
    for (let i = 0; i < draws; i++) {
      const face = rng.int(0, 5);
      counts[face] = (counts[face] ?? 0) + 1;
    }
    // Chi-squared with 5 degrees of freedom; 20.5 is the 0.1% critical value.
    const expected = draws / 6;
    const chi2 = counts.reduce((sum, c) => sum + (c - expected) ** 2 / expected, 0);
    expect(chi2).toBeLessThan(20.5);
  });

  it("keeps float in [0, 1)", () => {
    const rng = createRng("float");
    for (let i = 0; i < 10_000; i++) {
      const f = rng.float();
      expect(f >= 0 && f < 1).toBe(true);
    }
  });

  it("rejects bad int bounds", () => {
    const rng = createRng("bounds");
    expect(() => rng.int(5, 4)).toThrow(RangeError);
    expect(() => rng.int(0.5, 4)).toThrow(RangeError);
    expect(() => rng.int(0, 2 ** 33)).toThrow(RangeError);
  });

  it("shuffles into a permutation and samples distinct positions", () => {
    fc.assert(
      fc.property(seed, fc.array(fc.integer()), (s, items) => {
        const rng = createRng(s);
        expect(rng.shuffle(items).sort()).toEqual([...items].sort());
        const n = rng.int(0, items.length);
        expect(rng.sample(items, n)).toHaveLength(n);
      }),
    );
  });

  it("picks from the list and refuses an empty one", () => {
    fc.assert(
      fc.property(seed, fc.array(fc.string(), { minLength: 1 }), (s, items) => {
        expect(items).toContain(createRng(s).pick(items));
      }),
    );
    expect(() => createRng("x").pick([])).toThrow(RangeError);
  });

  it("chooses distinct values that satisfy the condition", () => {
    const dens = [2, 3, 4, 5, 6, 8, 10, 12];
    fc.assert(
      fc.property(seed, (s) => {
        const [a, b] = createRng(s).distinct(dens, 2, (x, y) => x % y !== 0 && y % x !== 0) as [
          number,
          number,
        ];
        expect(a).not.toBe(b);
        expect(a % b !== 0 && b % a !== 0).toBe(true);
      }),
    );
  });

  it("throws Reject when no selection satisfies the condition", () => {
    expect(() => createRng("x").distinct<number>([1, 2, 3], 2, () => false, 10)).toThrow(Reject);
  });

  it("respects weights", () => {
    const rng = createRng("weights");
    const counts = { a: 0, b: 0, c: 0 };
    for (let i = 0; i < 10_000; i++) {
      counts[
        rng.weighted([
          ["a", 1],
          ["b", 3],
          ["c", 0],
        ] as const)
      ]++;
    }
    expect(counts.c).toBe(0);
    expect(counts.b / counts.a).toBeGreaterThan(2.6);
    expect(counts.b / counts.a).toBeLessThan(3.4);
  });

  it("forks deterministically and independently", () => {
    const a = createRng("parent");
    const b = createRng("parent");
    expect(a.fork("step").uint32()).toBe(b.fork("step").uint32());
    expect(a.fork("step").uint32()).not.toBe(createRng("parent").fork("step").uint32());
  });
});
