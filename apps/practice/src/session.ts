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
  type Statement,
  type StatementsFile,
} from "@mathsplanner/core";
import {
  generators,
  selectPaper,
  selectQuestions,
  type SelectedItem,
} from "@mathsplanner/generators";
import statementsFile from "../../../data/statements.json" with { type: "json" };
import { formatScheme, parseScheme, type Scheme } from "./scheme.ts";
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

/** Statements and sub-statements that have a generator, in curriculum order. */
export const practisable = statements.filter((s) => registry.get(s.id));

/** Each statement's sub-statements that have a generator. */
export const stepsOf = new Map<string, Statement[]>();
for (const s of practisable)
  if (s.parent) stepsOf.set(s.parent, [...(stepsOf.get(s.parent) ?? []), s]);

/** A chosen statement also brings in its sub-statements, so its questions cover every step. */
export const withSteps = (ids: readonly string[]): string[] => [
  ...new Set(ids.flatMap((id) => [id, ...(stepsOf.get(id) ?? []).map((s) => s.id)])),
];

export const generatorFor = (id: string): Generator | undefined => registry.get(id)?.generator;

export type FeedbackMode = "each" | "end";

/**
 * A test paper. A year test ramps from one depth to another over one year's statements; a unit
 * test covers one topic across several years at the depths chosen; a set paper ramps over the
 * statements listed, such as a half-term of a scheme of work. Any can aim at a mark total (0 for
 * any).
 */
export type Paper =
  | { kind: "year"; stage: string; start: Depth; end: Depth; marks: number }
  | { kind: "unit"; topic: TopicId; stages: string[]; marks: number }
  | { kind: "set"; start: Depth; end: Depth; marks: number };

export const MAX_MARKS = 200;

/**
 * Retrieval practice in a set: each group of earlier statements gives this many of the questions,
 * at the review's depths (the set's own depths if none are given).
 */
export interface Review {
  groups: { statements: string[]; count: number }[];
  depths?: Depth[];
}

export const reviewCount = (review: Review | undefined) =>
  review?.groups.reduce((sum, g) => sum + g.count, 0) ?? 0;

export interface SessionSpec {
  statements: string[];
  depths: Depth[];
  numbers: Numbers;
  count: number;
  seed: number;
  /** Feedback after each question, or only on the results page. */
  feedback: FeedbackMode;
  /** Set for a test; its statements are then the paper's pool. */
  paper?: Paper;
  /** A name for the set, e.g. "Autumn 1 homework", shown to students and on the worksheet. */
  title?: string;
  /** Retrieval practice: this many of the questions come from these (earlier) statements. */
  review?: Review;
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
  | { page: "worksheet"; spec: SessionSpec; sheet: SheetOptions }
  /** `guide` is the half-term open in the guided set-up, if it is open. */
  | { page: "scheme"; scheme: Scheme | undefined; guide?: number };

export const MAX_QUESTIONS = 40;

export function formatRoute(route: Route): string {
  if (route.page === "setup") return "#/";
  if (route.page === "year" || route.page === "unit") return `#/${route.page}`;
  if (route.page === "scheme") {
    if (!route.scheme) return "#/scheme";
    const guide = route.guide === undefined ? {} : { guide: String(route.guide + 1) };
    return formatScheme(route.scheme, guide);
  }
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
    if (p?.kind === "set") {
      params.set("paper", "set");
      params.set("start", String(p.start));
      params.set("end", String(p.end));
    }
    params.set("statements", s.statements.join(","));
    if (!p) params.set("depths", s.depths.join(","));
  }
  if (p && p.marks > 0) params.set("marks", String(p.marks));
  if (s.title) params.set("name", s.title);
  if (s.review && !p) {
    // Groups are separated by "~": review=A,B~C&recall=2,1.
    params.set("review", s.review.groups.map((g) => g.statements.join(",")).join("~"));
    params.set("recall", s.review.groups.map((g) => g.count).join(","));
    if (s.review.depths) params.set("rdepths", s.review.depths.join(","));
  }
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
  if (path === "/scheme") {
    const scheme = parseScheme(query);
    const guide = Math.round(Number(new URLSearchParams(query).get("guide"))) - 1;
    return scheme && guide >= 0 && guide < scheme.halfTerms.length
      ? { page: "scheme", scheme, guide }
      : { page: "scheme", scheme };
  }
  if (path !== "/session" && path !== "/worksheet") return { page: "setup" };
  const q = new URLSearchParams(query);
  const toDepth = (v: string | null) => {
    const d = Number(v);
    return (DEPTHS as readonly number[]).includes(d) ? (d as Depth) : undefined;
  };
  const toDepths = (v: string | null) => [
    ...new Set(
      (v ?? "")
        .split(",")
        .map(Number)
        .filter((d): d is Depth => (DEPTHS as readonly number[]).includes(d)),
    ),
  ];
  let depths = toDepths(q.get("depths"));
  const marks = Math.round(Number(q.get("marks")));
  const target = marks >= 1 && marks <= MAX_MARKS ? marks : 0;
  let paper: Paper | undefined;
  let ids: string[];
  // A year or set paper ramps between two depths and allows every depth between them.
  const ramp = () => {
    const start = toDepth(q.get("start")) ?? 1;
    const end = toDepth(q.get("end")) ?? 4;
    depths = [...DEPTHS].filter((d) => d >= Math.min(start, end) && d <= Math.max(start, end));
    return { start, end };
  };
  if (q.get("paper") === "year") {
    const stage = q.get("stage") ?? "";
    paper = { kind: "year", stage, ...ramp(), marks: target };
    ids = stage in STAGE_NAMES ? yearPool(statements, stage) : [];
  } else if (q.get("paper") === "unit") {
    const topic = TOPICS.find((t) => t.id === q.get("topic"))?.id;
    const stages = (q.get("stages") ?? "").split(",").filter((st) => st in STAGE_NAMES);
    paper = topic
      ? { kind: "unit", topic, stages: [...new Set(stages)], marks: target }
      : undefined;
    ids = topic ? unitPool(statements, topic, stages) : [];
  } else {
    if (q.get("paper") === "set") paper = { kind: "set", ...ramp(), marks: target };
    ids = (q.get("statements") ?? "").split(",");
  }
  ids = ids.filter((id) => generatorFor(id));
  const numbers = q.get("numbers") as Numbers;
  const count = Math.round(Number(q.get("count")));
  const seed = Number(q.get("seed"));
  const kind = q.get("paper");
  if (ids.length === 0) return { page: kind === "year" || kind === "unit" ? kind : "setup" };
  const size = count >= 1 && count <= MAX_QUESTIONS ? count : 10;
  const title = (q.get("name") ?? "").trim().slice(0, 120);
  const recalls = (q.get("recall") ?? "").split(",");
  const groups = (q.get("review") ?? "")
    .split("~")
    .map((list, i) => ({
      statements: [...new Set(list.split(",").filter((id) => generatorFor(id)))],
      count: Math.round(Number(recalls[i])),
    }))
    .filter((g) => g.statements.length > 0 && g.count >= 1 && g.count <= MAX_QUESTIONS);
  const reviewDepths = toDepths(q.get("rdepths"));
  const review: Review | undefined =
    groups.length && reviewCount({ groups }) <= size
      ? { groups, ...(reviewDepths.length ? { depths: reviewDepths } : {}) }
      : undefined;
  const spec: SessionSpec = {
    statements: [...new Set(ids)],
    depths: depths.length ? [...new Set(depths)].sort() : [...DEPTHS],
    numbers: NUMBERS.includes(numbers) ? numbers : "standard",
    count: size,
    seed: Number.isSafeInteger(seed) && seed >= 0 ? seed : 0,
    feedback: q.get("feedback") === "end" ? "end" : "each",
    ...(paper ? { paper } : {}),
    ...(title ? { title } : {}),
    ...(!paper && review ? { review } : {}),
  };
  if (path === "/session") return { page: "session", spec };
  return {
    page: "worksheet",
    spec,
    sheet: {
      title: (q.get("title") ?? "").trim().slice(0, 120) || specTitle(spec, DEFAULT_SHEET.title),
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

/**
 * The questions in a session or paper; see selectQuestions and selectPaper. Retrieval questions
 * are chosen on their own, so their share of the set does not depend on how many statements each
 * side has; the two are then ordered by depth together.
 */
export function sessionItems(spec: SessionSpec): SessionItem[] {
  const paper = spec.paper;
  if (!paper) {
    // A group whose statements have no questions at the depths asked for uses any depth.
    const pick = (statements: string[], depths: readonly Depth[], count: number, seed: number) => {
      const selection = { statements: withSteps(statements), count, seed };
      const items = selectQuestions(generators, { ...selection, depths });
      return items.length || count < 1
        ? items
        : selectQuestions(generators, { ...selection, depths: DEPTHS });
    };
    const groups = spec.review?.groups ?? [];
    const main = pick(
      spec.statements,
      spec.depths,
      spec.count - reviewCount(spec.review),
      spec.seed,
    );
    const review = groups.flatMap((g, i) =>
      pick(
        g.statements,
        spec.review?.depths ?? spec.depths,
        g.count,
        spec.seed + 1_000_003 * (i + 1),
      ),
    );
    return [...main, ...review].sort((a, b) => a.depth - b.depth);
  }
  const sorted = [...spec.depths].sort();
  const [start, end] =
    paper.kind === "unit" ? [sorted[0] ?? 1, sorted.at(-1) ?? 4] : [paper.start, paper.end];
  return selectPaper(
    generators,
    {
      // A set paper lists statements as a teacher chose them, so a statement brings its steps.
      statements: paper.kind === "set" ? withSteps(spec.statements) : spec.statements,
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

/** A short title for a year or unit paper, or undefined for anything else. */
export function paperTitle(paper: Paper | undefined): string | undefined {
  if (paper?.kind === "year") return `${stageName(paper.stage)} test`;
  if (paper?.kind === "unit") return `${topicName(paper.topic)} unit test`;
  return undefined;
}

/** A session's own name, else its paper's, else the fallback. */
export const specTitle = (spec: SessionSpec, fallback: string): string =>
  spec.title || paperTitle(spec.paper) || fallback;

/** The line under a worksheet's title: what it covers, the numbers setting and its size. */
export function describeSpec(spec: SessionSpec, questions: number): string {
  const size = `${questions} question${questions === 1 ? "" : "s"}`;
  const p = spec.paper;
  if (p?.kind === "year")
    return `${stageName(p.stage)} · depths ${p.start} to ${p.end} · ${spec.numbers} numbers · ${size}`;
  if (p?.kind === "unit")
    return `${topicName(p.topic)} · ${p.stages.map(stageName).join(", ")} · depths ${spec.depths.join(", ")} · ${spec.numbers} numbers · ${size}`;
  // A half-term can list dozens of statements, which would crowd a worksheet's heading.
  const covers =
    spec.statements.length > 8
      ? `${spec.statements.length} statements`
      : spec.statements.join(", ");
  if (p?.kind === "set")
    return `${covers} · depths ${p.start} to ${p.end} · ${spec.numbers} numbers · ${size}`;
  const recall = reviewCount(spec.review);
  const review = recall ? ` (${recall} from earlier topics)` : "";
  return `${covers} · ${spec.numbers} numbers · ${size}${review}`;
}
