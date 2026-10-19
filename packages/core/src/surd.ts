// Exact surds: sums of rational multiples of square roots, such as 3 + 2√5 or (1 - √2)/4.
// Each term's radicand is square-free and every term has a different radicand, so equal values
// always have equal terms (√12 is 2√3).
import { Rational, type Num } from "./rational.ts";

export type SurdLike = Surd | Num;

/** Radicands are factorised by trial division, so keep them classroom-sized. */
const MAX_RADICAND = 10n ** 12n;

/** Splits n ≥ 0 into k²·m with m square-free: returns [k, m]. */
export function squareFreeParts(n: bigint): [bigint, bigint] {
  if (n < 0n) throw new RangeError("squareFreeParts: n must not be negative");
  if (n > MAX_RADICAND) throw new RangeError(`squareFreeParts: ${n} is too large`);
  if (n === 0n) return [0n, 1n];
  // Below MAX_RADICAND every value is a safe integer, and number arithmetic is far faster.
  let outside = 1;
  let inside = 1;
  let rest = Number(n);
  for (let p = 2; p * p <= rest; p += p === 2 ? 1 : 2) {
    let count = 0;
    while (rest % p === 0) {
      rest /= p;
      count++;
    }
    outside *= p ** Math.floor(count / 2);
    if (count % 2 === 1) inside *= p;
  }
  return [BigInt(outside), BigInt(inside * rest)];
}

export class Surd {
  /** Square-free radicand → non-zero rational coefficient, sorted by radicand (1 is the rational part). */
  readonly terms: ReadonlyMap<bigint, Rational>;

  private constructor(terms: Map<bigint, Rational>) {
    const sorted = [...terms].filter(([, c]) => !c.isZero()).sort(([a], [b]) => (a < b ? -1 : 1));
    this.terms = new Map(sorted);
  }

  static from(value: SurdLike): Surd {
    if (value instanceof Surd) return value;
    return new Surd(new Map([[1n, Rational.from(value)]]));
  }

  /** coefficient × √radicand, simplified. */
  static term(coefficient: Num, radicand: Num = 1n): Surd {
    const r = Rational.from(radicand);
    if (r.sign() < 0) throw new RangeError(`√(${r.toString()}) is not real`);
    // √(p/q) = √(pq)/q
    const [outside, inside] = squareFreeParts(r.n * r.d);
    const c = Rational.from(coefficient).mul(Rational.of(outside, r.d));
    return new Surd(new Map([[inside, c]]));
  }

  add(other: SurdLike): Surd {
    const out = new Map(this.terms);
    for (const [r, c] of Surd.from(other).terms)
      out.set(r, (out.get(r) ?? Rational.from(0)).add(c));
    return new Surd(out);
  }

  sub(other: SurdLike): Surd {
    return this.add(Surd.from(other).neg());
  }

  neg(): Surd {
    return new Surd(new Map([...this.terms].map(([r, c]) => [r, c.neg()])));
  }

  mul(other: SurdLike): Surd {
    let out = Surd.from(0);
    for (const [r1, c1] of this.terms) {
      for (const [r2, c2] of Surd.from(other).terms) {
        // c1√r1 × c2√r2 = c1c2√(r1r2), and √(r1r2) = g√(r1r2/g²) with g = gcd(r1, r2)
        out = out.add(Surd.term(c1.mul(c2), r1 * r2));
      }
    }
    return out;
  }

  /**
   * Division, rationalising the denominator. The divisor must be a single term c√r or have the
   * form p + q√r; anything with two different irrational radicands is out of scope.
   */
  div(other: SurdLike): Surd {
    const o = Surd.from(other);
    if (o.isZero()) throw new RangeError("Surd: division by zero");
    const irrational = [...o.terms.keys()].filter((r) => r !== 1n);
    if (irrational.length > 1) {
      throw new RangeError(`Surd: cannot divide by ${o.toString()} (more than one surd term)`);
    }
    if (o.terms.size === 1) {
      const [[r, c]] = [...o.terms] as [[bigint, Rational]];
      // ÷ c√r = × √r / (c r)
      return this.mul(Surd.term(c.mul(r).inv(), r));
    }
    // ÷ (p + q√r) = × (p - q√r) / (p² - q²r)
    const conjugate = o.conjugate();
    const denominator = o.mul(conjugate).toRational();
    return this.mul(conjugate).mul(Surd.from(denominator.inv()));
  }

  /** p + q√r becomes p - q√r: every irrational term changes sign. */
  conjugate(): Surd {
    return new Surd(new Map([...this.terms].map(([r, c]) => [r, r === 1n ? c : c.neg()])));
  }

  /** A non-negative integer power. */
  pow(exponent: number): Surd {
    if (!Number.isSafeInteger(exponent) || exponent < 0) {
      throw new RangeError("Surd: exponent must be a non-negative integer");
    }
    let out = Surd.from(1);
    for (let i = 0; i < exponent; i++) out = out.mul(this);
    return out;
  }

  isZero(): boolean {
    return this.terms.size === 0;
  }

  isRational(): boolean {
    return [...this.terms.keys()].every((r) => r === 1n);
  }

  /** The rational value; throws if there is an irrational term. */
  toRational(): Rational {
    if (!this.isRational()) throw new RangeError(`${this.toString()} is irrational`);
    return this.terms.get(1n) ?? Rational.from(0);
  }

  eq(other: SurdLike): boolean {
    const o = Surd.from(other);
    if (o.terms.size !== this.terms.size) return false;
    return [...this.terms].every(([r, c]) => o.terms.get(r)?.eq(c) ?? false);
  }

  /** For drawing and comparison only. */
  toNumber(): number {
    let sum = 0;
    for (const [r, c] of this.terms) sum += c.toNumber() * Math.sqrt(Number(r));
    return sum;
  }

  /** "3 + 2√5", "-1/2√3" */
  toString(): string {
    if (this.isZero()) return "0";
    return [...this.terms]
      .map(([r, c], i) => {
        const sign = c.sign() < 0 ? (i === 0 ? "-" : " - ") : i === 0 ? "" : " + ";
        const size = c.abs();
        if (r === 1n) return sign + size.toString();
        return `${sign}${size.eq(1) ? "" : size.toString()}√${r}`;
      })
      .join("");
  }
}

/** √x, simplified: sqrt(12) is 2√3, sqrt("1/2") is √2/2. */
export function sqrt(x: Num): Surd {
  return Surd.term(1n, x);
}

/** coefficient × √radicand, simplified. */
export function surd(coefficient: Num, radicand: Num = 1n): Surd {
  return Surd.term(coefficient, radicand);
}
