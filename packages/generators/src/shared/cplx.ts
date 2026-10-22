// Complex number helpers for Further Maths: a + bi as LaTeX, modulus and argument.

/** a + bi as LaTeX, e.g. cx(3, -2) is 3 − 2i, cx(0, 1) is i. */
export function cx(re: number, im: number): string {
  if (im === 0) return String(re);
  const imPart = `${Math.abs(im) === 1 ? "" : Math.abs(im)}i`;
  if (re === 0) return im < 0 ? `-${imPart}` : imPart;
  return `${re} ${im < 0 ? "-" : "+"} ${imPart}`;
}

export const modulus = (re: number, im: number) => Math.hypot(re, im);

/** The principal argument in (−π, π]. */
export const argument = (re: number, im: number) => Math.atan2(im, re);
