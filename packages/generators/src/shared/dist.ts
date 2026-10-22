// Probability distributions for A level statistics: binomial probabilities and an accurate normal
// distribution (Φ to about 1e-12, so answers rounded to 4 decimal places match a calculator).

/** ⁿCᵣ as a floating-point number (exact for the sizes used in questions). */
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let c = 1;
  for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;
  return Math.round(c);
}

/** P(X = k) for X ~ B(n, p). */
export const binomialPmf = (n: number, p: number, k: number) =>
  nCr(n, k) * p ** k * (1 - p) ** (n - k);

/** P(X ≤ k) for X ~ B(n, p). */
export function binomialCdf(n: number, p: number, k: number): number {
  let s = 0;
  for (let i = 0; i <= Math.min(k, n); i++) s += binomialPmf(n, p, i);
  return s;
}

/** erf by its Taylor series for small |x| and a continued fraction for erfc beyond. */
export function erf(x: number): number {
  const ax = Math.abs(x);
  if (ax < 2.5) {
    let term = ax;
    let sum = ax;
    for (let n = 1; n < 200; n++) {
      term *= (-ax * ax) / n;
      const add = term / (2 * n + 1);
      sum += add;
      if (Math.abs(add) < 1e-17) break;
    }
    const v = (2 / Math.sqrt(Math.PI)) * sum;
    return x < 0 ? -v : v;
  }
  // erfc(x) = exp(−x²)/√π · 1/(x + 1/2/(x + 1/(x + 3/2/(x + …)))) by Lentz's method.
  let f = ax;
  let C = ax;
  let D = 0;
  for (let n = 1; n < 300; n++) {
    const a = n / 2;
    D = ax + a * D;
    D = D === 0 ? 1e-300 : 1 / D;
    C = ax + a / C;
    const delta = C * D;
    f *= delta;
    if (Math.abs(delta - 1) < 1e-16) break;
  }
  const erfc = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / f;
  return x < 0 ? erfc - 1 : 1 - erfc;
}

/** Φ(z), the standard normal cumulative distribution. */
export const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

/** P(X < x) for X ~ N(μ, σ²). */
export const normalCdf = (x: number, mu: number, sigma: number) => phi((x - mu) / sigma);

/** Φ⁻¹(p) by bisection on Φ. */
export function invPhi(p: number): number {
  let lo = -10;
  let hi = 10;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (phi(mid) < p) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export const round = (x: number, dp: number) => Math.round(x * 10 ** dp) / 10 ** dp;

const factorial = (k: number): number => (k <= 1 ? 1 : k * factorial(k - 1));

/** P(X = k) for X ~ Po(λ). */
export const poissonPmf = (lambda: number, k: number) =>
  (Math.exp(-lambda) * lambda ** k) / factorial(k);

/** P(X ≤ k) for X ~ Po(λ). */
export function poissonCdf(lambda: number, k: number): number {
  let s = 0;
  for (let i = 0; i <= k; i++) s += poissonPmf(lambda, i);
  return s;
}
