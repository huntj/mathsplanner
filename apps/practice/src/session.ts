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
import {
  generators,
  selectPaper,
  selectQuestions,
  type SelectedItem,
} from "@mathsplanner/generators";
import statementsFile from "../../../data/statements.json" with { type: "json" };
import {
  stageName,
  STAGE_NAMES,
  TOPICS,
  topicName,
  unitPool,
  yearPool,
  type TopicId,
} from "./papers.ts";

export const statements = (statementsFile as StatementsFile).statements;
export const statementById = new Map(statements.map((s) => [s.id, s]));
const registry = createRegistry(generators, statements);

/** Statements that have a generator, in curriculum order. */
export const practisable = statements.filter((s) => registry.get(s.id));

export const generatorFor = (id: string): Generator | undefined => registry.get(id)?.generator;

export type FeedbackMode = "each" | "end";

/**
 * A test paper. A year test ramps from one depth to another over one year's statements; a unit
 * test covers one topic across several years at the depths chosen. Either can aim at a mark total
 * (0 for any).
 */
export type Paper =
  | { kind: "year"; stage: string; start: Depth; end: Depth; marks: number }
  | { kind: "unit"; topic: TopicId; stages: string[]; marks: number };

export const MAX_MARKS = 200;

export interface SessionSpec {
  statements: string[];
  depths: Depth[];
  numbers: Numbers;
  count: number;
  seed: number;
  /** Feedback after each question, or only on the results page. */
  feedback: FeedbackMode;
  /** Set for a year or unit test; its statements are then the paper's pool. */
  paper?: Paper;
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
  | { page: "year" }
  | { page: "unit" }
  | { page: "session"; spec: SessionSpec }
  | { page: "worksheet"; spec: SessionSpec; sheet: SheetOptions };

export const MAX_QUESTIONS = 40;

export function formatRoute(route: Route): string {
  if (route.page === "setup") return "#/";
  if (route.page === "year" || route.page === "unit") return `#/${route.page}`;
  const s = route.spec;
  const params = new URLSearchParams();
  const p = s.paper;
  if (p?.kind === "year") {
    params.set("paper", "year");
    params.set("stage", p.stage);
    params.set("start", String(p.start));
    params.set("end", String(p.end));
  } else if (p?.kind === "unit") {
    params.set("paper", "unit");
    params.set("topic", p.topic);
    params.set("stages", p.stages.join(","));
    params.set("depths", s.depths.join(","));
  } else {
    params.set("statements", s.statements.join(","));
    params.set("depths", s.depths.join(","));
  }
  if (p && p.marks > 0) params.set("marks", String(p.marks));
  params.set("numbers", s.numbers);
  params.set("count", String(s.count));
  params.set("seed", String(s.seed));
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
  if (path === "/year") return { page: "year" };
  if (path === "/unit") return { page: "unit" };
  if (path !== "/session" && path !== "/worksheet") return { page: "setup" };
  const q = new URLSearchParams(query);
  const toDepth = (v: string | null) => {
    const d = Number(v);
    return (DEPTHS as readonly number[]).includes(d) ? (d as Depth) : undefined;
  };
  let depths = (q.get("depths") ?? "")
    .split(",")
    .map(Number)
    .filter((d): d is Depth => (DEPTHS as readonly number[]).includes(d));
  const marks = Math.round(Number(q.get("marks")));
  const target = marks >= 1 && marks <= MAX_MARKS ? marks : 0;
  let paper: Paper | undefined;
  let ids: string[];
  if (q.get("paper") === "year") {
    const stage = q.get("stage") ?? "";
    const start = toDepth(q.get("start")) ?? 1;
    const end = toDepth(q.get("end")) ?? 4;
    paper = { kind: "year", stage, start, end, marks: target };
    depths = [...DEPTHS].filter((d) => d >= Math.min(start, end) && d <= Math.max(start, end));
    ids = stage in STAGE_NAMES ? yearPool(statements, stage) : [];
  } else if (q.get("paper") === "unit") {
    const topic = TOPICS.find((t) => t.id === q.get("topic"))?.id;
    const stages = (q.get("stages") ?? "").split(",").filter((st) => st in STAGE_NAMES);
    paper = topic
      ? { kind: "unit", topic, stages: [...new Set(stages)], marks: target }
      : undefined;
    ids = topic ? unitPool(statements, topic, stages) : [];
  } else {
    ids = (q.get("statements") ?? "").split(",");
  }
  ids = ids.filter((id) => generatorFor(id));
  const numbers = q.get("numbers") as Numbers;
  const count = Math.round(Number(q.get("count")));
  const seed = Number(q.get("seed"));
  const kind = q.get("paper");
  if (ids.length === 0) return { page: kind === "year" || kind === "unit" ? kind : "setup" };
  const spec: SessionSpec = {
    statements: [...new Set(ids)],
    depths: depths.length ? [...new Set(depths)].sort() : [...DEPTHS],
    numbers: NUMBERS.includes(numbers) ? numbers : "standard",
    count: count >= 1 && count <= MAX_QUESTIONS ? count : 10,
    seed: Number.isSafeInteger(seed) && seed >= 0 ? seed : 0,
    feedback: q.get("feedback") === "end" ? "end" : "each",
    ...(paper ? { paper } : {}),
  };
  if (path === "/session") return { page: "session", spec };
  return {
    page: "worksheet",
    spec,
    sheet: {
      title:
        (q.get("title") ?? "").trim().slice(0, 120) || paperTitle(paper) || DEFAULT_SHEET.title,
      answers: q.get("answers") !== "0",
      solutions: q.get("solutions") !== "0",
      reducedInk: q.get("ink") === "reduced",
    },
  };
}

export type SessionItem = SelectedItem;

/** The total marks of one selected question. */
export function itemMarks(item: SelectedItem, numbers: Numbers): number {
  const question = generatorFor(item.statementId)?.generate({ ...item, numbers });
  return question?.parts.reduce((sum, p) => sum + p.marks, 0) ?? 0;
}

/** The questions in a session or paper; see selectQuestions and selectPaper. */
export function sessionItems(spec: SessionSpec): SessionItem[] {
  const paper = spec.paper;
  if (!paper) return selectQuestions(generators, spec);
  const sorted = [...spec.depths].sort();
  const [start, end] =
    paper.kind === "year" ? [paper.start, paper.end] : [sorted[0] ?? 1, sorted.at(-1) ?? 4];
  return selectPaper(
    generators,
    {
      statements: spec.statements,
      depths: spec.depths,
      start,
      end,
      count: spec.count,
      marks: paper.marks,
      seed: spec.seed,
    },
    (item) => itemMarks(item, spec.numbers),
  );
}

/** A short title for a paper, or undefined for an ordinary session. */
export function paperTitle(paper: Paper | undefined): string | undefined {
  if (paper?.kind === "year") return `${stageName(paper.stage)} test`;
  if (paper?.kind === "unit") return `${topicName(paper.topic)} unit test`;
  return undefined;
}

/** The line under a worksheet's title: what it covers, the numbers setting and its size. */
export function describeSpec(spec: SessionSpec, questions: number): string {
  const size = `${questions} question${questions === 1 ? "" : "s"}`;
  const p = spec.paper;
  if (p?.kind === "year")
    return `${stageName(p.stage)} · depths ${p.start} to ${p.end} · ${spec.numbers} numbers · ${size}`;
  if (p?.kind === "unit")
    return `${topicName(p.topic)} · ${p.stages.map(stageName).join(", ")} · depths ${spec.depths.join(", ")} · ${spec.numbers} numbers · ${size}`;
  return `${spec.statements.join(", ")} · ${spec.numbers} numbers · ${size}`;
}
