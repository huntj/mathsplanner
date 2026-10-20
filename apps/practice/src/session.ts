// A practice session is fully described by its link: which statements, depths and numbers
// setting, how many questions and a seed. Nothing is stored, so the same link always gives the
// same questions, which is what lets a teacher hand one link to a class.
import {
  createRegistry,
  createRng,
  DEPTHS,
  NUMBERS,
  type Depth,
  type Generator,
  type Numbers,
  type StatementsFile,
} from "@mathsplanner/core";
import { generators } from "@mathsplanner/generators";
import statementsFile from "../../../data/statements.json" with { type: "json" };

export const statements = (statementsFile as StatementsFile).statements;
export const statementById = new Map(statements.map((s) => [s.id, s]));
const registry = createRegistry(generators, statements);

/** Statements that have a generator, in curriculum order. */
export const practisable = statements.filter((s) => registry.get(s.id));

export const generatorFor = (id: string): Generator | undefined => registry.get(id)?.generator;

export type FeedbackMode = "each" | "end";

export interface SessionSpec {
  statements: string[];
  depths: Depth[];
  numbers: Numbers;
  count: number;
  seed: number;
  /** Feedback after each question, or only on the results page. */
  feedback: FeedbackMode;
}

export type Route = { page: "setup" } | { page: "session"; spec: SessionSpec };

export const MAX_QUESTIONS = 40;

export function formatRoute(route: Route): string {
  if (route.page === "setup") return "#/";
  const s = route.spec;
  const params = new URLSearchParams({
    statements: s.statements.join(","),
    depths: s.depths.join(","),
    numbers: s.numbers,
    count: String(s.count),
    seed: String(s.seed),
    feedback: s.feedback,
  });
  return `#/session?${params.toString().replace(/%2C/g, ",")}`;
}

/** Reads a route, dropping anything invalid rather than failing. */
export function parseRoute(hash: string): Route {
  const [path = "", query = ""] = hash.replace(/^#/, "").split("?");
  if (path !== "/session") return { page: "setup" };
  const q = new URLSearchParams(query);
  const ids = (q.get("statements") ?? "").split(",").filter((id) => generatorFor(id));
  const depths = (q.get("depths") ?? "")
    .split(",")
    .map(Number)
    .filter((d): d is Depth => (DEPTHS as readonly number[]).includes(d));
  const numbers = q.get("numbers") as Numbers;
  const count = Math.round(Number(q.get("count")));
  const seed = Number(q.get("seed"));
  if (ids.length === 0) return { page: "setup" };
  return {
    page: "session",
    spec: {
      statements: [...new Set(ids)],
      depths: depths.length ? [...new Set(depths)].sort() : [...DEPTHS],
      numbers: NUMBERS.includes(numbers) ? numbers : "standard",
      count: count >= 1 && count <= MAX_QUESTIONS ? count : 10,
      seed: Number.isSafeInteger(seed) && seed >= 0 ? seed : 0,
      feedback: q.get("feedback") === "end" ? "end" : "each",
    },
  };
}

export interface SessionItem {
  statementId: string;
  depth: Depth;
  seed: number;
}

/**
 * The questions in a session: every statement and depth asked for that the generator supports,
 * shuffled from the seed and repeated until there are enough, each with its own question seed.
 * They are then ordered by depth.
 */
export function sessionItems(spec: SessionSpec): SessionItem[] {
  const pairs = spec.statements.flatMap((id) => {
    const supported = generatorFor(id)?.depths ?? [];
    return spec.depths
      .filter((d) => supported.includes(d))
      .map((depth) => ({ statementId: id, depth }));
  });
  if (pairs.length === 0) return [];
  const rng = createRng(`session/${spec.seed}`);
  const items: SessionItem[] = [];
  while (items.length < spec.count) {
    for (const pair of rng.shuffle(pairs)) {
      if (items.length < spec.count) items.push({ ...pair, seed: rng.int(0, 999_999) });
    }
  }
  // Easier depths first, so a session builds up from fluency to reasoning.
  return items.sort((a, b) => a.depth - b.depth);
}
