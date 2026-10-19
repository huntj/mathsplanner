// Exact rationals with BigInt. Values stay exact until display; floating point is only for
// drawing. A Rational is immutable and always in lowest terms with a positive denominator.

export type Num = Rational | bigint | number | string;

const abs = (x: bigint) => (x < 0n ? -x : x);

export function gcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return abs(a * b) / gcd(a, b);
}

/** Parses "3", "-3/4" or "1.25" (also "-.5", "2."), or returns undefined. */
function parse(text: string): [bigint, bigint] | undefined {
  const s = text.trim();
  const fraction = /^([+-]?\d+)\s*\/\s*([+-]?\d+)$/.exec(s);
  if (fraction) return [BigInt(fraction[1] ?? ""), BigInt(fraction[2] ?? "")];
  const decimal = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(s);
  if (!decimal || (decimal[2] === "" && (decimal[3] ?? "") === "")) return undefined;
  const sign = decimal[1] === "-" ? -1n : 1n;
  const digits = (decimal[2] ?? "") + (decimal[3] ?? "");
  const exponent = BigInt(decimal[4] ?? "0") - BigInt((decimal[3] ?? "").length);
  const n = sign * BigInt(digits || "0");
  return exponent >= 0n ? [n * 10n ** exponent, 1n] : [n, 10n ** -exponent];
}

export class Rational {
  /** Numerator; carries the sign. */
  readonly n: bigint;
  /** Denominator; always positive. */
  readonly d: bigint;

  private constructor(n: bigint, d: bigint) {
    if (d === 0n) throw new RangeError("Rational: division by zero");
    const g = gcd(n, d) || 1n;
    const sign = d < 0n ? -1n : 1n;
    this.n = (sign * n) / g;
    this.d = (sign * d) / g;
  }

  /** Converts any Num exactly. Non-integer numbers use their shortest decimal form (0.1 is 1/10). */
  static from(value: Num): Rational {
    if (value instanceof Rational) return value;
    if (typeof value === "bigint") return new Rational(value, 1n);
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new RangeError(`Rational: ${value} is not finite`);
      if (Number.isInteger(value)) {
        if (!Number.isSafeInteger(value)) {
          throw new RangeError(`Rational: ${value} is too large to be exact; pass a bigint`);
        }
        return new Rational(BigInt(value), 1n);
      }
      return Rational.from(String(value));
    }
    const parsed = parse(value);
    if (!parsed) throw new SyntaxError(`Rational: cannot parse "${value}"`);
    return new Rational(parsed[0], parsed[1]);
  }

  static of(n: bigint, d: bigint): Rational {
    return new Rational(n, d);
  }

  add(other: Num): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.d + o.n * this.d, this.d * o.d);
  }

  sub(other: Num): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.d - o.n * this.d, this.d * o.d);
  }

  mul(other: Num): Rational {
    const o = Rational.from(other);
    return new Rational(this.n * o.n, this.d * o.d);
  }

  div(other: Num): Rational {
    const o = Rational.from(other);
    if (o.n === 0n) throw new RangeError("Rational: division by zero");
    return new Rational(this.n * o.d, this.d * o.n);
  }

  neg(): Rational {
    return new Rational(-this.n, this.d);
  }

  abs(): Rational {
    return this.n < 0n ? this.neg() : this;
  }

  /** The reciprocal. */
  inv(): Rational {
    if (this.n === 0n) throw new RangeError("Rational: zero has no reciprocal");
    return new Rational(this.d, this.n);
  }

  /** An integer power; negative exponents take the reciprocal. */
  pow(exponent: number): Rational {
    if (!Number.isSafeInteger(exponent))
      throw new RangeError("Rational: exponent must be an integer");
    if (exponent < 0) return this.inv().pow(-exponent);
    const e = BigInt(exponent);
    return new Rational(this.n ** e, this.d ** e);
  }

  /** -1, 0 or 1. */
  sign(): -1 | 0 | 1 {
    return this.n < 0n ? -1 : this.n > 0n ? 1 : 0;
  }

  cmp(other: Num): -1 | 0 | 1 {
    const o = Rational.from(other);
    const diff = this.n * o.d - o.n * this.d;
    return diff < 0n ? -1 : diff > 0n ? 1 : 0;
  }

  eq(other: Num): boolean {
    const o = Rational.from(other);
    return this.n === o.n && this.d === o.d;
  }

  lt(other: Num): boolean {
    return this.cmp(other) < 0;
  }

  le(other: Num): boolean {
    return this.cmp(other) <= 0;
  }

  gt(other: Num): boolean {
    return this.cmp(other) > 0;
  }

  ge(other: Num): boolean {
    return this.cmp(other) >= 0;
  }

  isZero(): boolean {
    return this.n === 0n;
  }

  isInteger(): boolean {
    return this.d === 1n;
  }

  /** A unit fraction: 1/n for a positive integer n. */
  isUnit(): boolean {
    return this.n === 1n;
  }

  /** Whether the decimal form terminates (the denominator has no prime factors but 2 and 5). */
  isTerminating(): boolean {
    let d = this.d;
    while (d % 2n === 0n) d /= 2n;
    while (d % 5n === 0n) d /= 5n;
    return d === 1n;
  }

  floor(): bigint {
    const q = this.n / this.d;
    return this.n < 0n && q * this.d !== this.n ? q - 1n : q;
  }

  ceil(): bigint {
    return -this.neg().floor();
  }

  /** Rounds to dp decimal places, halves away from zero (2.5 → 3, -2.5 → -3). */
  round(dp = 0): Rational {
    if (!Number.isSafeInteger(dp) || dp < 0) throw new RangeError("round: dp must be 0 or more");
    const scale = 10n ** BigInt(dp);
    const scaled = this.abs().mul(scale).add(Rational.of(1n, 2n)).floor();
    return new Rational(BigInt(this.sign()) * scaled, scale);
  }

  /** Rounds to sf significant figures, halves away from zero. */
  roundSf(sf: number): Rational {
    if (!Number.isSafeInteger(sf) || sf < 1) throw new RangeError("roundSf: sf must be 1 or more");
    if (this.isZero()) return this;
    // Find e with 10^e <= |x| < 10^(e+1).
    const x = this.abs();
    let e = x.n.toString().length - x.d.toString().length;
    if (x.lt(Rational.of(10n, 1n).pow(e))) e--;
    const shift = sf - 1 - e;
    const factor = Rational.of(10n, 1n).pow(shift);
    return this.mul(factor).round(0).div(factor);
  }

  /** A mixed number: 7/3 is { sign: 1, whole: 2, part: 1/3 }; whole and part are never negative. */
  toMixed(): { sign: -1 | 0 | 1; whole: bigint; part: Rational } {
    const a = this.abs();
    return { sign: this.sign(), whole: a.n / a.d, part: new Rational(a.n % a.d, a.d) };
  }

  /**
   * The decimal expansion, with any recurring block found by long division:
   * 1/6 is { negative: false, integer: "0", fixed: "1", recurring: "6" }.
   */
  decimal(): { negative: boolean; integer: string; fixed: string; recurring: string } {
    const a = this.abs();
    const integer = (a.n / a.d).toString();
    let remainder = a.n % a.d;
    const seen = new Map<bigint, number>();
    let digits = "";
    while (remainder !== 0n && !seen.has(remainder)) {
      seen.set(remainder, digits.length);
      remainder *= 10n;
      digits += (remainder / a.d).toString();
      remainder %= a.d;
    }
    const start = remainder === 0n ? digits.length : (seen.get(remainder) ?? 0);
    return {
      negative: this.n < 0n,
      integer,
      fixed: digits.slice(0, start),
      recurring: digits.slice(start),
    };
  }

  /** The exact decimal string, e.g. "0.375". Throws if the decimal recurs. */
  toDecimalString(): string {
    const { negative, integer, fixed, recurring } = this.decimal();
    if (recurring) throw new RangeError(`${this.toString()} has a recurring decimal`);
    return `${negative ? "-" : ""}${integer}${fixed ? `.${fixed}` : ""}`;
  }

  /** For drawing only. */
  toNumber(): number {
    return Number(this.n) / Number(this.d);
  }

  /** "3/4", "-2" */
  toString(): string {
    return this.d === 1n ? this.n.toString() : `${this.n}/${this.d}`;
  }
}

/** frac(3, 4), frac("3/4"), frac(0.75), frac(2n). */
export function frac(n: Num, d: Num = 1n): Rational {
  return Rational.from(n).div(d);
}
