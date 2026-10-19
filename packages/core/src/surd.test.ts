import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { Rational } from "./rational.ts";
import { sqrt, squareFreeParts, Surd, surd } from "./surd.ts";

const small = fc.bigInt({ min: -50n, max: 50n });
const positive = fc.bigInt({ min: 1n, max: 50n });
const rational = fc.tuple(small, positive).map(([n, d]) => Rational.of(n, d));
const radicand = fc.bigInt({ min: 1n, max: 200n });
/** A sum of up to three surd terms. */
const surdArb = fc
  .array(fc.tuple(rational, radicand), { maxLength: 3 })
  .map((terms) => terms.reduce((s, [c, r]) => s.add(surd(c, r)), Surd.from(0)));
/** p + q√r, the kind of divisor a GCSE question rationalises. */
const binomial = fc
  .tuple(rational, rational, radicand)
  .map(([p, q, r]) => surd(q, r).add(p))
  .filter((s) => !s.isZero());

const close = (a: number, b: number) =>
  Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

describe("squareFreeParts", () => {
  it("splits n into k²m with m square-free", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 0n, max: 10n ** 7n }), (n) => {
        const [k, m] = squareFreeParts(n);
        expect(k * k * m).toBe(n === 0n ? 0n : n);
        const small = Number(m);
        for (let p = 2; p * p <= small; p++) expect(small % (p * p)).not.toBe(0);
      }),
    );
    expect(squareFreeParts(72n)).toEqual([6n, 2n]);
  });
});

describe("Surd: simplification", () => {
  it("simplifies the textbook examples", () => {
    expect(sqrt(12).toString()).toBe("2√3");
    expect(sqrt(16).toString()).toBe("4");
    expect(sqrt("1/2").toString()).toBe("1/2√2");
    expect(sqrt(8).add(sqrt(18)).toString()).toBe("5√2");
    expect(sqrt(2).mul(sqrt(6)).toString()).toBe("2√3");
    expect(sqrt(3).add(1).toString()).toBe("1 + √3");
    expect(surd(-1, 5).sub(2).toString()).toBe("-2 - √5");
    expect(() => sqrt(-4)).toThrow(RangeError);
  });

  it("squares a root back to the rational it came from", () => {
    fc.assert(
      fc.property(
        rational.map((r) => r.abs()),
        (x) => {
          expect(sqrt(x).pow(2).toRational().eq(x)).toBe(true);
        },
      ),
    );
  });

  it("keeps terms canonical: square-free radicands, no zero coefficients, sorted", () => {
    fc.assert(
      fc.property(surdArb, surdArb, (a, b) => {
        for (const s of [a.add(b), a.mul(b), a.sub(b)]) {
          const radicands = [...s.terms.keys()];
          expect([...radicands].sort((x, y) => (x < y ? -1 : 1))).toEqual(radicands);
          for (const [r, c] of s.terms) {
            expect(c.isZero()).toBe(false);
            expect(squareFreeParts(r)[0]).toBe(1n);
          }
        }
      }),
    );
  });
});

describe("Surd: arithmetic", () => {
  it("is a commutative ring", () => {
    fc.assert(
      fc.property(surdArb, surdArb, surdArb, (a, b, c) => {
        expect(a.add(b).eq(b.add(a))).toBe(true);
        expect(a.mul(b).eq(b.mul(a))).toBe(true);
        expect(
          a
            .mul(b)
            .mul(c)
            .eq(a.mul(b.mul(c))),
        ).toBe(true);
        expect(a.mul(b.add(c)).eq(a.mul(b).add(a.mul(c)))).toBe(true);
        expect(a.sub(a).isZero()).toBe(true);
      }),
    );
  });

  it("agrees with floating point", () => {
    fc.assert(
      fc.property(surdArb, surdArb, (a, b) => {
        expect(close(a.add(b).toNumber(), a.toNumber() + b.toNumber())).toBe(true);
        expect(close(a.mul(b).toNumber(), a.toNumber() * b.toNumber())).toBe(true);
      }),
    );
  });

  it("rationalises denominators of the form p + q√r", () => {
    fc.assert(
      fc.property(surdArb, binomial, (a, b) => {
        const quotient = a.div(b);
        expect(quotient.mul(b).eq(a)).toBe(true);
        expect(close(quotient.toNumber(), a.toNumber() / b.toNumber())).toBe(true);
      }),
    );
    expect(Surd.from(1).div(sqrt(2).add(1)).toString()).toBe("-1 + √2");
    expect(Surd.from(6).div(sqrt(3)).toString()).toBe("2√3");
  });

  it("refuses divisors with two different surd terms", () => {
    expect(() => Surd.from(1).div(sqrt(2).add(sqrt(3)))).toThrow(RangeError);
    expect(() => Surd.from(1).div(0)).toThrow(RangeError);
  });

  it("knows when a value is rational", () => {
    expect(sqrt(2).add(1).mul(sqrt(2).sub(1)).toRational().eq(1)).toBe(true);
    expect(() => sqrt(2).toRational()).toThrow(RangeError);
  });
});
