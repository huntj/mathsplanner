// Matrix helpers for Further Maths: 2 × 2 and 3 × 3 matrices as LaTeX, products and determinants.

export type M2 = number[][];

/** A matrix as a LaTeX pmatrix. */
export const mat = (m: number[][]) =>
  `\\begin{pmatrix} ${m.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;

export function mul(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const k = b[0]?.length ?? 0;
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: k }, (_, j) =>
      (a[i] ?? []).reduce((s, x, r) => s + x * (b[r]?.[j] ?? 0), 0),
    ),
  );
}

export const det2 = (m: number[][]) =>
  (m[0]?.[0] ?? 0) * (m[1]?.[1] ?? 0) - (m[0]?.[1] ?? 0) * (m[1]?.[0] ?? 0);

export function det3(m: number[][]): number {
  const e = (i: number, j: number) => m[i]?.[j] ?? 0;
  return (
    e(0, 0) * (e(1, 1) * e(2, 2) - e(1, 2) * e(2, 1)) -
    e(0, 1) * (e(1, 0) * e(2, 2) - e(1, 2) * e(2, 0)) +
    e(0, 2) * (e(1, 0) * e(2, 1) - e(1, 1) * e(2, 0))
  );
}
