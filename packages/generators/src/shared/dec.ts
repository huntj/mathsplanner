// Decision maths helpers: small weighted networks as edge lists, with Kruskal's and Dijkstra's
// algorithms and a greedy "nearest edge" walk for misconceptions.
import type { Rng } from "@mathsplanner/core";

export type Edge = [number, number, number];

export const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];
export const name = (i: number) => LETTERS[i] ?? "?";

/** A connected network on n vertices: a random spanning path plus extra edges, distinct weights. */
export function network(rng: Rng, n: number, extra: number, lo = 2, hi = 20): Edge[] {
  const order = rng.shuffle(Array.from({ length: n }, (_, i) => i));
  const pairs: [number, number][] = order.slice(1).map((v, i) => [order[i] ?? 0, v]);
  const key = ([a, b]: [number, number]) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  const seen = new Set(pairs.map(key));
  for (let tries = 0; pairs.length < n - 1 + extra && tries < 100; tries++) {
    const a = rng.int(0, n - 1);
    const b = rng.int(0, n - 1);
    if (a === b || seen.has(key([a, b]))) continue;
    seen.add(key([a, b]));
    pairs.push([a, b]);
  }
  const weights = rng
    .shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => lo + i))
    .slice(0, pairs.length);
  return pairs.map(([a, b], i) => [Math.min(a, b), Math.max(a, b), weights[i] ?? lo]);
}

/** The edges as "AB 7, AC 12, …", sorted by name. */
export const edgeList = (edges: Edge[]) =>
  [...edges]
    .sort((x, y) => x[0] - y[0] || x[1] - y[1])
    .map(([a, b, w]) => `${name(a)}${name(b)} ${w}`)
    .join(", ");

/** The total weight of a minimum spanning tree, by Kruskal's algorithm. */
export function kruskal(n: number, edges: Edge[]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : find(parent[x] ?? x));
  let total = 0;
  for (const [a, b, w] of [...edges].sort((x, y) => x[2] - y[2])) {
    const [ra, rb] = [find(a), find(b)];
    if (ra === rb) continue;
    parent[ra] = rb;
    total += w;
  }
  return total;
}

/** Shortest distances from `from` to every vertex, by Dijkstra's algorithm. */
export function dijkstra(n: number, edges: Edge[], from: number): number[] {
  const dist = Array.from({ length: n }, () => Infinity);
  const done = new Set<number>();
  dist[from] = 0;
  while (done.size < n) {
    let u = -1;
    dist.forEach((d, i) => {
      if (!done.has(i) && (u < 0 || d < (dist[u] ?? Infinity))) u = i;
    });
    if (u < 0 || dist[u] === Infinity) break;
    done.add(u);
    for (const [a, b, w] of edges) {
      const v = a === u ? b : b === u ? a : -1;
      if (v >= 0 && (dist[u] ?? 0) + w < (dist[v] ?? Infinity)) dist[v] = (dist[u] ?? 0) + w;
    }
  }
  return dist;
}

/** The length of the walk that always takes the shortest unused edge to an unvisited vertex, or undefined if it gets stuck. */
export function greedyWalk(edges: Edge[], from: number, to: number): number | undefined {
  const visited = new Set([from]);
  let at = from;
  let total = 0;
  while (at !== to) {
    const next = edges
      .map(([a, b, w]) => (a === at ? [b, w] : b === at ? [a, w] : undefined))
      .filter((x): x is number[] => !!x && !visited.has(x[0] ?? -1))
      .sort((x, y) => (x[1] ?? 0) - (y[1] ?? 0))[0];
    if (!next) return undefined;
    at = next[0] ?? to;
    total += next[1] ?? 0;
    visited.add(at);
  }
  return total;
}
