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
