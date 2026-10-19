// Seeded random source. Every question must be reproducible from its key, so generators only
// ever draw from an Rng, never Math.random. Changing these algorithms changes every question
// ever generated, so random.test.ts pins their output.

/** Thrown to reject a parameter set; defineGenerator catches it and draws again. */
export class Reject extends Error {
  constructor(reason = "parameters rejected") {
    super(reason);
    this.name = "Reject";
  }
}

/** Rejects the current parameter set from inside params or build. */
export function reject(reason?: string): never {
  throw new Reject(reason);
}

/** cyrb128: hashes a string to four 32-bit words. */
function hash128(text: string): [number, number, number, number] {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0; i < text.length; i++) {
    const k = text.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

const TWO_32 = 4294967296;

export class Rng {
  readonly seed: string;
  #a: number;
  #b: number;
  #c: number;
  #d: number;
  #forks = 0;

  constructor(seed: string) {
    this.seed = seed;
    [this.#a, this.#b, this.#c, this.#d] = hash128(seed);
    // Discard the first outputs so similar seeds diverge fully.
    for (let i = 0; i < 15; i++) this.uint32();
  }

  /** sfc32: a uniformly distributed 32-bit unsigned integer. */
  uint32(): number {
    const t = (((this.#a + this.#b) | 0) + this.#d) | 0;
    this.#d = (this.#d + 1) | 0;
    this.#a = this.#b ^ (this.#b >>> 9);
    this.#b = (this.#c + (this.#c << 3)) | 0;
    this.#c = (this.#c << 21) | (this.#c >>> 11);
    this.#c = (this.#c + t) | 0;
    return t >>> 0;
  }

  /** A float in [0, 1). Use only for drawing, never for maths that must be exact. */
  float(): number {
    return this.uint32() / TWO_32;
  }

  /** A uniformly distributed integer from min to max inclusive. */
  int(min: number, max: number): number {
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
      throw new RangeError(`int(${min}, ${max}): bounds must be integers`);
    }
    if (min > max) throw new RangeError(`int(${min}, ${max}): min is greater than max`);
    const range = max - min + 1;
    if (range > TWO_32) throw new RangeError(`int(${min}, ${max}): range is larger than 2^32`);
    // Rejection sampling keeps every value equally likely.
    const limit = TWO_32 - (TWO_32 % range);
    let u = this.uint32();
    while (u >= limit) u = this.uint32();
    return min + (u % range);
  }

  /** True with probability p. */
  bool(p = 0.5): boolean {
    if (!(p >= 0 && p <= 1)) throw new RangeError(`bool(${p}): p must be between 0 and 1`);
    return this.float() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new RangeError("pick: no items to choose from");
    return items[this.int(0, items.length - 1)] as T;
  }

  /** Picks an item with probability proportional to its weight. */
  weighted<T>(items: readonly (readonly [T, number])[]): T {
    const total = items.reduce((sum, [, w]) => {
      if (!(w >= 0) || !Number.isFinite(w)) throw new RangeError(`weighted: bad weight ${w}`);
      return sum + w;
    }, 0);
    if (total <= 0) throw new RangeError("weighted: weights must add up to more than 0");
    let r = this.float() * total;
    for (const [item, w] of items) {
      if (r < w) return item;
      r -= w;
    }
    // Floating-point rounding can leave r just short of 0; fall back to the last positive weight.
    return [...items].reverse().find(([, w]) => w > 0)?.[0] as T;
  }

  /** A shuffled copy (Fisher-Yates). */
  shuffle<T>(items: readonly T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [out[i], out[j]] = [out[j] as T, out[i] as T];
    }
    return out;
  }

  /** n items from different positions, in random order. */
  sample<T>(items: readonly T[], n: number): T[] {
    if (!Number.isInteger(n) || n < 0 || n > items.length) {
      throw new RangeError(`sample: cannot take ${n} of ${items.length} items`);
    }
    return this.shuffle(items).slice(0, n);
  }

  /**
   * n different values (compared with ===) such that `accept` holds for the whole selection.
   * Throws Reject if no acceptable selection turns up, so defineGenerator draws new parameters.
   */
  distinct<T>(
    items: readonly T[],
    n: number,
    accept?: (...picked: T[]) => boolean,
    tries = 1000,
  ): T[] {
    const unique = [...new Set(items)];
    if (n > unique.length) throw new RangeError(`distinct: only ${unique.length} different items`);
    for (let i = 0; i < tries; i++) {
      const picked = this.sample(unique, n);
      if (!accept || accept(...picked)) return picked;
    }
    return reject(`distinct: no acceptable selection of ${n} in ${tries} tries`);
  }

  /**
   * An independent child source, for example to reuse a prerequisite's generator. Forks are
   * deterministic: the nth fork with a given label is always the same.
   */
  fork(label: string): Rng {
    this.#forks++;
    return new Rng(`${this.seed}/${label}#${this.#forks}`);
  }
}

export function createRng(seed: string): Rng {
  return new Rng(seed);
}
