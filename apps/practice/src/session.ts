// A practice session is fully described by its link: which statements, depths and numbers
// setting, how many questions and a seed. Nothing is stored, so the same link always gives the
// same questions, which is what lets a teacher hand one link to a class.
import {
  createRegistry,
  DEPTHS,
  NUMBERS,
  type Depth,
  type Generator,
  type Numbers,
  type StatementsFile,
} from "@mathsplanner/core";
import { generators, selectQuestions, type SelectedItem } from "@mathsplanner/generators";
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

/** How a printed worksheet looks; its questions come from a SessionSpec like a session's. */
export interface SheetOptions {
  title: string;
  answers: boolean;
  solutions: boolean;
  reducedInk: boolean;
}

export const DEFAULT_SHEET: SheetOptions = {
  title: "Maths practice",
  answers: true,
  solutions: true,
  reducedInk: false,
};

export type Route =
  | { page: "setup" }
  | { page: "session"; spec: SessionSpec }
  | { page: "worksheet"; spec: SessionSpec; sheet: SheetOptions };

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
  });
  if (route.page === "session") params.set("feedback", s.feedback);
  else {
    params.set("title", route.sheet.title);
    params.set("answers", route.sheet.answers ? "1" : "0");
    params.set("solutions", route.sheet.solutions ? "1" : "0");
    if (route.sheet.reducedInk) params.set("ink", "reduced");
  }
  return `#/${route.page}?${params.toString().replace(/%2C/g, ",")}`;
}

/** Reads a route, dropping anything invalid rather than failing. */
export function parseRoute(hash: string): Route {
  const [path = "", query = ""] = hash.replace(/^#/, "").split("?");
  if (path !== "/session" && path !== "/worksheet") return { page: "setup" };
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
  const spec: SessionSpec = {
    statements: [...new Set(ids)],
    depths: depths.length ? [...new Set(depths)].sort() : [...DEPTHS],
    numbers: NUMBERS.includes(numbers) ? numbers : "standard",
    count: count >= 1 && count <= MAX_QUESTIONS ? count : 10,
    seed: Number.isSafeInteger(seed) && seed >= 0 ? seed : 0,
    feedback: q.get("feedback") === "end" ? "end" : "each",
  };
  if (path === "/session") return { page: "session", spec };
  return {
    page: "worksheet",
    spec,
    sheet: {
      title: (q.get("title") ?? "").trim().slice(0, 120) || DEFAULT_SHEET.title,
      answers: q.get("answers") !== "0",
      solutions: q.get("solutions") !== "0",
      reducedInk: q.get("ink") === "reduced",
    },
  };
}

export type SessionItem = SelectedItem;

/** The questions in a session; see selectQuestions. */
export const sessionItems = (spec: SessionSpec): SessionItem[] => selectQuestions(generators, spec);
