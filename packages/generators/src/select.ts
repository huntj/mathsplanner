// Choosing the questions for a practice session or a worksheet. Both are described only by their
// settings and a seed, so the same settings always give the same questions, on screen or on paper.
import { createRng, type Depth, type Generator } from "@mathsplanner/core";

export interface Selection {
  /** Statement IDs to draw from. */
  statements: readonly string[];
  depths: readonly Depth[];
  count: number;
  seed: number;
}

export interface SelectedItem {
  statementId: string;
  depth: Depth;
  /** The question's own seed, drawn from the selection's seed. */
  seed: number;
}

/**
 * Every statement and depth asked for that has a generator supporting it, shuffled from the seed
 * and repeated until there are enough, each with its own question seed; then ordered by depth so
 * a set builds up from fluency to reasoning.
 */
export function selectQuestions(
  generators: readonly Generator[],
  selection: Selection,
): SelectedItem[] {
  const byId = new Map(generators.map((g) => [g.id, g]));
  const pairs = selection.statements.flatMap((id) => {
    const supported = byId.get(id)?.depths ?? [];
    return selection.depths
      .filter((d) => supported.includes(d))
      .map((depth) => ({ statementId: id, depth }));
  });
  if (pairs.length === 0) return [];
  const rng = createRng(`session/${selection.seed}`);
  const items: SelectedItem[] = [];
  while (items.length < selection.count) {
    for (const pair of rng.shuffle(pairs)) {
      if (items.length < selection.count) items.push({ ...pair, seed: rng.int(0, 999_999) });
    }
  }
  return items.sort((a, b) => a.depth - b.depth);
}

export interface PaperSelection {
  /** Statement IDs to draw from, e.g. a whole year or one topic across several years. */
  statements: readonly string[];
  /** The depths allowed on the paper. */
  depths: readonly Depth[];
  /** The depth of the first and last questions; the ones between ramp evenly from one to the other. */
  start: Depth;
  end: Depth;
  count: number;
  /** The total marks to aim for, or 0 for any total. */
  marks: number;
  seed: number;
}

/** How many candidate questions to weigh for each place on a paper when aiming at a mark total. */
const CANDIDATES = 6;

/**
 * A test paper: `count` questions whose depths ramp from `start` to `end` (each snapped to the
 * nearest allowed depth that some statement supports), spread across as many statements as
 * possible. With a mark total, each place takes whichever of a few candidates (at the ramp's depth
 * or one either side) keeps the running total closest to an even share of the marks still to
 * come, so the paper lands on or near the target; the questions are then ordered by depth.
 * `marksOf` gives a candidate's marks (by generating it).
 */
export function selectPaper(
  generators: readonly Generator[],
  paper: PaperSelection,
  marksOf: (item: SelectedItem) => number,
): SelectedItem[] {
  const byId = new Map(generators.map((g) => [g.id, g]));
  const pool = [...new Set(paper.statements)].filter((id) => byId.has(id));
  const supports = (id: string, d: Depth) => byId.get(id)?.depths.includes(d) ?? false;
  const usable = paper.depths.filter((d) => pool.some((id) => supports(id, d)));
  if (usable.length === 0 || paper.count < 1) return [];

  const rng = createRng(`paper/${paper.seed}`);
  // A random order to break ties, so least-used statements are taken in a varied order.
  const order = new Map(rng.shuffle(pool).map((id, i) => [id, i]));
  const used = new Map<string, number>();
  const items: SelectedItem[] = [];
  let total = 0;

  const aiming = paper.marks > 0;
  for (let i = 0; i < paper.count; i++) {
    const t = paper.count === 1 ? 0 : i / (paper.count - 1);
    const want = paper.start + (paper.end - paper.start) * t;
    const nearest = [...usable].sort((a, b) => Math.abs(a - want) - Math.abs(b - want) || a - b)[0];
    // Marks follow depth (depths 1 and 2 are usually worth 1 mark, depth 4 two), so to reach a
    // total a place may move one depth either side of the ramp.
    const window = aiming ? usable.filter((d) => Math.abs(d - want) <= 1) : [nearest as Depth];
    const candidates = window.flatMap((depth) =>
      pool
        .filter((id) => supports(id, depth))
        .sort(
          (a, b) =>
            (used.get(a) ?? 0) - (used.get(b) ?? 0) || (order.get(a) ?? 0) - (order.get(b) ?? 0),
        )
        .slice(0, aiming ? CANDIDATES : 1)
        .map((statementId) => ({ statementId, depth, seed: rng.int(0, 999_999) })),
    );
    let pick = candidates[0] as SelectedItem;
    if (aiming) {
      const share = (paper.marks - total) / (paper.count - i);
      let best = Infinity;
      for (const c of candidates) {
        const miss = Math.abs(marksOf(c) - share) * 10 + Math.abs(c.depth - want);
        if (miss < best) [best, pick] = [miss, c];
      }
      total += marksOf(pick);
    }
    used.set(pick.statementId, (used.get(pick.statementId) ?? 0) + 1);
    items.push(pick);
  }
  // Keep the paper building from the start depth to the end depth.
  const direction = paper.end >= paper.start ? 1 : -1;
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => direction * (a.item.depth - b.item.depth) || a.i - b.i)
    .map(({ item }) => item);
}
