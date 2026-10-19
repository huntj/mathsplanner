import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { frac, gcd, lcm, Rational } from "./rational.ts";

const bigint = fc.bigInt({ min: -(10n ** 12n), max: 10n ** 12n });
const nonZero = bigint.filter((n) => n !== 0n);
const rational = fc.tuple(bigint, nonZero).map(([n, d]) => Rational.of(n, d));
const nonZeroRational = fc.tuple(nonZero, nonZero).map(([n, d]) => Rational.of(n, d));

describe("Rational: canonical form", () => {
  it("is always in lowest terms with a positive denominator", () => {
    fc.assert(
      fc.property(bigint, nonZero, (n, d) => {
        const r = Rational.of(n, d);
        expect(r.d > 0n).toBe(true);
        expect(gcd(r.n, r.d)).toBe(1n);
        // Same value as n/d.
        expect(r.n * d).toBe(n * r.d);
      }),
    );
  });

  it("gives equal values equal representations", () => {
    fc.assert(
      fc.property(rational, nonZero, (r, k) => {
        expect(Rational.of(r.n * k, r.d * k).eq(r)).toBe(true);
      }),
    );
  });

  it("refuses a zero denominator", () => {
    expect(() => Rational.of(1n, 0n)).toThrow(RangeError);
    expect(() => frac(1, 0)).toThrow(RangeError);
  });
});

describe("Rational: field laws", () => {
  it("adds and multiplies commutatively and associatively", () => {
    fc.assert(
      fc.property(rational, rational, rational, (a, b, c) => {
        expect(a.add(b).eq(b.add(a))).toBe(true);
        expect(a.mul(b).eq(b.mul(a))).toBe(true);
        expect(
          a
            .add(b)
            .add(c)
            .eq(a.add(b.add(c))),
        ).toBe(true);
        expect(
          a
            .mul(b)
            .mul(c)
            .eq(a.mul(b.mul(c))),
        ).toBe(true);
      }),
    );
  });

  it("distributes multiplication over addition", () => {
    fc.assert(
      fc.property(rational, rational, rational, (a, b, c) => {
        expect(a.mul(b.add(c)).eq(a.mul(b).add(a.mul(c)))).toBe(true);
      }),
    );
  });

  it("has inverses: a - a = 0, a × 1/a = 1, (a ÷ b) × b = a", () => {
    fc.assert(
      fc.property(rational, nonZeroRational, (a, b) => {
        expect(a.sub(a).isZero()).toBe(true);
        expect(b.mul(b.inv()).eq(1)).toBe(true);
        expect(a.div(b).mul(b).eq(a)).toBe(true);
        expect(a.add(a.neg()).isZero()).toBe(true);
      }),
    );
  });

  it("raises to integer powers", () => {
    fc.assert(
      fc.property(
        nonZeroRational,
        fc.integer({ min: -6, max: 6 }),
        fc.integer({ min: -6, max: 6 }),
        (a, m, k) => {
          expect(
            a
              .pow(m)
              .mul(a.pow(k))
              .eq(a.pow(m + k)),
          ).toBe(true);
        },
      ),
    );
    expect(frac(2, 3).pow(-2).toString()).toBe("9/4");
    expect(frac(0).pow(0).eq(1)).toBe(true);
  });
});

describe("Rational: order", () => {
  it("orders consistently with subtraction and with floating point", () => {
    fc.assert(
      fc.property(rational, rational, (a, b) => {
        expect(a.cmp(b)).toBe(a.sub(b).sign());
        expect(a.cmp(b)).toBe(-b.cmp(a));
        expect(a.lt(b) || a.eq(b) || a.gt(b)).toBe(true);
        if (Math.abs(a.toNumber() - b.toNumber()) > 1e-6) {
          expect(a.lt(b)).toBe(a.toNumber() < b.toNumber());
        }
      }),
    );
  });

  it("floors and ceils around the value", () => {
    fc.assert(
      fc.property(rational, (a) => {
        const floor = Rational.of(a.floor(), 1n);
        const ceil = Rational.of(a.ceil(), 1n);
        expect(floor.le(a) && a.lt(floor.add(1))).toBe(true);
        expect(ceil.ge(a) && a.gt(ceil.sub(1))).toBe(true);
      }),
    );
    expect(frac(-7, 2).floor()).toBe(-4n);
    expect(frac(-7, 2).ceil()).toBe(-3n);
  });
});

describe("Rational: conversion", () => {
  it("round-trips through toString", () => {
    fc.assert(
      fc.property(rational, (a) => {
        expect(Rational.from(a.toString()).eq(a)).toBe(true);
      }),
    );
  });

  it("converts numbers and decimal strings exactly", () => {
    expect(frac(0.1).toString()).toBe("1/10");
    expect(frac(0.375).toString()).toBe("3/8");
    expect(frac("-1.25").toString()).toBe("-5/4");
    expect(frac("2.").toString()).toBe("2");
    expect(frac(".5").toString()).toBe("1/2");
    expect(frac(1e-7).toString()).toBe("1/10000000");
    expect(frac(3, 4).eq(frac("6/8"))).toBe(true);
    expect(() => frac("abc")).toThrow(SyntaxError);
    expect(() => frac(Number.NaN)).toThrow(RangeError);
    expect(() => frac(2 ** 60)).toThrow(RangeError);
  });

  it("round-trips terminating decimals", () => {
    fc.assert(
      fc.property(bigint, fc.nat(8), (n, places) => {
        const r = Rational.of(n, 10n ** BigInt(places));
        expect(r.isTerminating()).toBe(true);
        expect(Rational.from(r.toDecimalString()).eq(r)).toBe(true);
      }),
    );
  });

  it("knows which fractions terminate", () => {
    fc.assert(
      fc.property(nonZero, fc.nat(6), fc.nat(6), (n, twos, fives) => {
        const d = 2n ** BigInt(twos) * 5n ** BigInt(fives);
        expect(Rational.of(n, d).isTerminating()).toBe(true);
        const r = Rational.of(n, d * 3n);
        expect(r.isTerminating()).toBe(r.d % 3n !== 0n);
      }),
    );
  });

  it("finds recurring decimals", () => {
    expect(frac(1, 6).decimal()).toEqual({
      negative: false,
      integer: "0",
      fixed: "1",
      recurring: "6",
    });
    expect(frac(-22, 7).decimal()).toEqual({
      negative: true,
      integer: "3",
      fixed: "",
      recurring: "142857",
    });
    expect(frac(3, 8).decimal()).toEqual({
      negative: false,
      integer: "0",
      fixed: "375",
      recurring: "",
    });
    expect(() => frac(1, 3).toDecimalString()).toThrow(RangeError);
  });

  it("rebuilds the value from its recurring decimal", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: -(10n ** 6n), max: 10n ** 6n }),
        fc.bigInt({ min: 1n, max: 400n }),
        (n, d) => {
          const r = Rational.of(n, d);
          const { negative, integer, fixed, recurring } = r.decimal();
          // x = I.F(R) = (IFR - IF) / (10^|F| (10^|R| - 1)), or I.F when nothing recurs
          const head = BigInt(integer + fixed);
          const value = recurring
            ? Rational.of(
                BigInt(integer + fixed + recurring) - head,
                10n ** BigInt(fixed.length) * (10n ** BigInt(recurring.length) - 1n),
              )
            : Rational.of(head, 10n ** BigInt(fixed.length));
          expect((negative ? value.neg() : value).eq(r)).toBe(true);
        },
      ),
    );
  });

  it("converts to and from mixed numbers", () => {
    fc.assert(
      fc.property(rational, (a) => {
        const { sign, whole, part } = a.toMixed();
        expect(part.ge(0) && part.lt(1)).toBe(true);
        expect(part.add(whole).mul(sign).eq(a)).toBe(true);
      }),
    );
    expect(frac(-7, 3).toMixed()).toEqual({ sign: -1, whole: 2n, part: frac(1, 3) });
  });
});

describe("Rational: rounding", () => {
  it("rounds half away from zero", () => {
    expect(frac(5, 2).round().toString()).toBe("3");
    expect(frac(-5, 2).round().toString()).toBe("-3");
    expect(frac("2.345").round(2).toString()).toBe(frac("2.35").toString());
    expect(frac("2.344").round(2).eq(frac("2.34"))).toBe(true);
  });

  it("rounds to within half a unit in the last place", () => {
    fc.assert(
      fc.property(rational, fc.nat(6), (a, dp) => {
        const half = Rational.of(1n, 2n * 10n ** BigInt(dp));
        expect(a.round(dp).sub(a).abs().le(half)).toBe(true);
        expect(
          a
            .round(dp)
            .mul(10n ** BigInt(dp))
            .isInteger(),
        ).toBe(true);
      }),
    );
  });

  it("rounds to significant figures", () => {
    expect(frac(123456).roundSf(2).toString()).toBe("120000");
    expect(frac("0.004567").roundSf(2).eq(frac("0.0046"))).toBe(true);
    expect(frac("9.96").roundSf(2).eq(10)).toBe(true);
    expect(frac(-1234).roundSf(1).eq(-1000)).toBe(true);
    expect(frac(1000).roundSf(1).eq(1000)).toBe(true);
    expect(frac(999).roundSf(1).eq(1000)).toBe(true);
  });

  it("keeps significant-figure rounding within half a unit", () => {
    fc.assert(
      fc.property(nonZeroRational, fc.integer({ min: 1, max: 5 }), (a, sf) => {
        const rounded = a.roundSf(sf);
        const digits = rounded
          .abs()
          .toDecimalString()
          .replace(".", "")
          .replace(/^0+/, "")
          .replace(/0+$/, "");
        expect(digits.length).toBeLessThanOrEqual(sf);
        // Half a unit in the last significant place is at most |a| × 10^(1-sf) / 2.
        expect(
          rounded
            .sub(a)
            .abs()
            .le(
              a
                .abs()
                .div(10n ** BigInt(sf - 1))
                .div(2),
            ),
        ).toBe(true);
      }),
    );
  });
});

describe("gcd and lcm", () => {
  it("divide and are divided as they should", () => {
    fc.assert(
      fc.property(nonZero, nonZero, (a, b) => {
        const g = gcd(a, b);
        const l = lcm(a, b);
        expect(a % g === 0n && b % g === 0n).toBe(true);
        expect(l % a === 0n && l % b === 0n).toBe(true);
        expect(g * l).toBe(a * b < 0n ? -a * b : a * b);
      }),
    );
  });
});

describe("frac", () => {
  it("covers the design doc's fractions example", () => {
    const a = frac(1, 3);
    const b = frac(1, 4);
    expect(a.add(b).toString()).toBe("7/12");
    expect(a.sub(b).toString()).toBe("1/12");
    expect(frac(a.n + b.n, a.d + b.d).toString()).toBe("2/7");
    expect(frac(1, 12).isUnit()).toBe(true);
    expect(frac(2, 12).isUnit()).toBe(true);
    expect(frac(-1, 2).isUnit()).toBe(false);
    expect(a.gt(b)).toBe(true);
  });
});
