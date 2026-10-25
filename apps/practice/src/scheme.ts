// A scheme of work: a class's year (or a key stage or two-year course) planned in half-terms, six
// a year, each an ordered list of statements and sub-statements. Each item takes a number of
// lessons, which with the lessons a week decides the week it falls in, and so each week's
// homework. Like a session, a scheme lives only in its link or in a file the teacher downloads, so
// nothing is stored on a server; the browser also keeps the last scheme as a convenience.
import type { Depth, Statement } from "@mathsplanner/core";
import { stageName } from "./papers.ts";
// session.ts imports this file for scheme links, so nothing here may use it at load time.
import {
  generatorFor,
  MAX_QUESTIONS,
  practisable,
  statementById,
  stepsOf,
  type SessionSpec,
} from "./session.ts";

export interface Course {
  id: string;
  name: string;
  /** The stages whose statements the course teaches. */
  stages: string[];
  /** One label per school year the course runs over. */
  years: string[];
  /** For a one-year course, its school year: -1 for Nursery, 0 for Reception, 1 to 13. */
  year?: number;
  /** For one year of a two-year qualification, which year it is: 0 or 1. */
  part?: number;
  /** Lessons a week to plan for by default. */
  lessons: number;
}

/** Usual maths lessons a week: daily in primary, three or four in secondary. */
const lessonsFor = (year: number) => (year <= 6 ? 5 : year <= 11 ? 3 : 4);

const STAGE_YEAR: Record<string, number> = { N: -1, R: 0 };
for (let y = 1; y <= 9; y++) STAGE_YEAR[`Y${y}`] = y;

const single = (stage: string): Course => ({
  id: stage,
  name: stageName(stage),
  stages: [stage],
  years: [stageName(stage)],
  year: STAGE_YEAR[stage] ?? 0,
  lessons: lessonsFor(STAGE_YEAR[stage] ?? 0),
});
/** One year of a two-year qualification, e.g. Year 10 of GCSE Higher. */
const oneYear = (id: string, name: string, stages: string[], year: number, part: number) => ({
  id: `${id}${year}`,
  name: `Year ${year} ${name}`,
  stages,
  years: [`Year ${year}`],
  year,
  part,
  lessons: lessonsFor(year),
});
const twoYears = (id: string, name: string, stages: string[], first: number): Course => ({
  id,
  name,
  stages,
  years: [`Year ${first}`, `Year ${first + 1}`],
  lessons: lessonsFor(first),
});

/** The qualifications taught over Years 10 and 11 or 12 and 13. */
export const QUALIFICATIONS: { id: string; name: string; stages: string[]; first: number }[] = [
  { id: "GF", name: "GCSE Foundation", stages: ["GF"], first: 10 },
  { id: "GH", name: "GCSE Higher", stages: ["GF", "GH"], first: 10 },
  { id: "AL", name: "A level Maths", stages: ["AL"], first: 12 },
  { id: "FM", name: "Further Maths", stages: ["FM"], first: 12 },
  { id: "CM", name: "Core Maths", stages: ["CM"], first: 12 },
];

export const COURSES: Course[] = [
  ...["N", "R", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7", "Y8", "Y9"].map(single),
  ...QUALIFICATIONS.flatMap((q) => [
    oneYear(q.id, q.name, q.stages, q.first, 0),
    oneYear(q.id, q.name, q.stages, q.first + 1, 1),
  ]),
  ...QUALIFICATIONS.map((q) => twoYears(q.id, q.name, q.stages, q.first)),
  {
    id: "EYFS",
    name: "Early years (Nursery and Reception)",
    stages: ["N", "R"],
    years: ["Nursery", "Reception"],
    lessons: 5,
  },
  {
    id: "KS1",
    name: "Key Stage 1 (Years 1 and 2)",
    stages: ["Y1", "Y2"],
    years: ["Year 1", "Year 2"],
    lessons: 5,
  },
  {
    id: "KS2",
    name: "Key Stage 2 (Years 3 to 6)",
    stages: ["Y3", "Y4", "Y5", "Y6"],
    years: ["Year 3", "Year 4", "Year 5", "Year 6"],
    lessons: 5,
  },
  {
    id: "KS3",
    name: "Key Stage 3 (Years 7 to 9)",
    stages: ["Y7", "Y8", "Y9"],
    years: ["Year 7", "Year 8", "Year 9"],
    lessons: 3,
  },
];

export const courseById = new Map(COURSES.map((c) => [c.id, c]));

/**
 * The school years a statement is usually taught in, as [first, last]: its own year up to Year 9,
 * Years 10 to 11 for GCSE, and its recommended years (or 12 to 13) in KS5. Steps take their
 * parent's.
 */
export function statementYears(s: Statement): [number, number] {
  const year = STAGE_YEAR[s.stage];
  if (year !== undefined) return [year, year];
  if (s.stage === "GF" || s.stage === "GH") return [10, 11];
  const years = s.years ?? (s.parent ? statementById.get(s.parent)?.years : undefined) ?? [12, 13];
  return [Math.min(...years), Math.max(...years)];
}

/** Whether a statement belongs to a course's own year (any statement, for a multi-year course). */
export function inThisYear(course: Course, s: Statement): boolean {
  if (!course.stages.includes(s.stage)) return false;
  if (course.year === undefined) return true;
  const [first, last] = statementYears(s);
  return first <= course.year && course.year <= last;
}

export const TERMS = ["Autumn 1", "Autumn 2", "Spring 1", "Spring 2", "Summer 1", "Summer 2"];
/** A typical English school year: about 39 weeks, with shorter spring half-terms. */
export const DEFAULT_WEEKS = [7, 7, 6, 6, 6, 7];
export const MAX_WEEKS = 12;
export const MAX_TITLE = 120;
export const MAX_CLASS = 40;
export const MAX_LESSONS = 10;
const MAX_SEED = 999_999;

export interface HalfTerm {
  weeks: number;
  /** Statement and sub-statement IDs in teaching order. */
  items: string[];
}

export interface Scheme {
  title: string;
  course: string;
  /** The class it is for, e.g. "7X2"; shown on its homework and tests. */
  className: string;
  /** Maths lessons a week, which decides the week each item falls in. */
  lessonsPerWeek: number;
  /** Lessons for items that take other than their default; see defaultLessons. */
  lessons: Record<string, number>;
  /** Seeds every homework and check made from the scheme, so their links stay the same. */
  seed: number;
  halfTerms: HalfTerm[];
  /**
   * The class's lessons in each week of each half-term, when its timetable is known (see
   * workspace.ts); otherwise every week has lessonsPerWeek. Links and files leave it out, since the
   * timetable gives it again.
   */
  weekLessons?: number[][];
}

/** A half-term's name, with its year when the course runs over more than one. */
export function halfTermName(course: Course, index: number, short = false): string {
  const term = TERMS[index % 6] ?? "";
  const name = short ? term.replace(/^(\w{3})\w* /, "$1 ") : term;
  return course.years.length > 1 ? `${course.years[Math.floor(index / 6)]} ${name}` : name;
}

export const defaultTitle = (course: Course, className = "") =>
  className ? `${className} scheme of work` : `${course.name} scheme of work`;

export const randomSeed = () => Math.floor(Math.random() * (MAX_SEED + 1));

export function emptyScheme(
  course: Course,
  title?: string,
  className = "",
  seed = randomSeed(),
): Scheme {
  return {
    title: title || defaultTitle(course, className),
    course: course.id,
    className,
    lessonsPerWeek: course.lessons,
    lessons: {},
    seed,
    halfTerms: course.years.flatMap(() => DEFAULT_WEEKS.map((weeks) => ({ weeks, items: [] }))),
  };
}

/** The statements a course offers, top-level ones only (their steps come with them). */
export function coursePool(course: Course): Statement[] {
  return practisable.filter((s) => !s.parent && course.stages.includes(s.stage));
}

// --- links and files ------------------------------------------------------------------------

const clamp = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = Math.round(Number(v));
  return v !== "" && v !== null && Number.isFinite(n) && n >= lo && n <= hi ? n : fallback;
};
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

interface SchemeParts {
  title?: unknown;
  course?: unknown;
  className?: unknown;
  lessonsPerWeek?: unknown;
  lessons?: unknown;
  seed?: unknown;
  halfTerms: readonly { weeks?: unknown; items?: unknown }[];
}

/**
 * Builds a scheme from untrusted parts, dropping anything invalid: an unknown course gives
 * undefined, unknown IDs and repeats are dropped, and the half-terms are padded or cut to six a
 * year.
 */
function cleanScheme(parts: SchemeParts): Scheme | undefined {
  const course = courseById.get(String(parts.course));
  if (!course) return undefined;
  const seen = new Set<string>();
  const terms = course.years.flatMap((_, y) =>
    DEFAULT_WEEKS.map((weeks, t) => {
      const raw = parts.halfTerms[y * 6 + t];
      const items = (Array.isArray(raw?.items) ? raw.items : [])
        .map(String)
        .filter((id) => generatorFor(id) && !seen.has(id) && seen.add(id));
      return { weeks: clamp(raw?.weeks, 1, MAX_WEEKS, weeks), items };
    }),
  );
  const given = (typeof parts.lessons === "object" && parts.lessons) || {};
  const lessons: Record<string, number> = {};
  for (const id of seen) {
    const n = clamp((given as Record<string, unknown>)[id], 1, MAX_LESSONS, 0);
    if (n && n !== defaultLessons(id)) lessons[id] = n;
  }
  const className = text(parts.className, MAX_CLASS);
  return {
    title: text(parts.title, MAX_TITLE) || defaultTitle(course, className),
    course: course.id,
    className,
    lessonsPerWeek: clamp(parts.lessonsPerWeek, 1, MAX_LESSONS, course.lessons),
    lessons,
    seed: clamp(parts.seed, 0, MAX_SEED, 0),
    halfTerms: terms,
  };
}

/**
 * The scheme's link: `#/scheme?course=Y7&class=7X2&title=…&lpw=3&seed=…&weeks=7,7,6,6,6,7&h1=…`,
 * each half-term's items in order, with `*n` after an item that takes n lessons other than its
 * default. `extra` adds page settings such as the guided set-up's half-term.
 */
export function formatScheme(scheme: Scheme, extra: Record<string, string> = {}): string {
  const params = new URLSearchParams();
  params.set("course", scheme.course);
  if (scheme.className) params.set("class", scheme.className);
  params.set("title", scheme.title);
  params.set("lpw", String(scheme.lessonsPerWeek));
  params.set("seed", String(scheme.seed));
  params.set("weeks", scheme.halfTerms.map((h) => h.weeks).join(","));
  scheme.halfTerms.forEach((h, i) => {
    const items = h.items.map((id) => (scheme.lessons[id] ? `${id}*${scheme.lessons[id]}` : id));
    if (items.length) params.set(`h${i + 1}`, items.join(","));
  });
  for (const [key, value] of Object.entries(extra)) params.set(key, value);
  return `#/scheme?${params.toString().replace(/%2C/g, ",")}`;
}

/** Reads a scheme from a link's query, or undefined when there is no valid course. */
export function parseScheme(query: string): Scheme | undefined {
  const q = new URLSearchParams(query);
  const weeks = (q.get("weeks") ?? "").split(",");
  const course = courseById.get(q.get("course") ?? "");
  const count = (course?.years.length ?? 0) * 6;
  const lessons: Record<string, string> = {};
  const halfTerms = Array.from({ length: count }, (_, i) => ({
    weeks: weeks[i],
    items: (q.get(`h${i + 1}`) ?? "")
      .split(",")
      .filter(Boolean)
      .map((item) => {
        const [id = "", n] = item.split("*");
        if (n) lessons[id] = n;
        return id;
      }),
  }));
  return cleanScheme({
    title: q.get("title"),
    course: q.get("course"),
    className: q.get("class"),
    lessonsPerWeek: q.get("lpw"),
    seed: q.get("seed"),
    lessons,
    halfTerms,
  });
}

export const FILE_FORMAT = "mathsplanner-scheme";

/** The downloadable file: readable JSON with each half-term named and each item's wording. */
export function schemeFile(scheme: Scheme): string {
  const course = courseById.get(scheme.course);
  return `${JSON.stringify(
    {
      format: FILE_FORMAT,
      version: 2,
      title: scheme.title,
      course: scheme.course,
      className: scheme.className,
      lessonsPerWeek: scheme.lessonsPerWeek,
      lessons: scheme.lessons,
      seed: scheme.seed,
      halfTerms: scheme.halfTerms.map((h, i) => ({
        name: course ? halfTermName(course, i) : `Half-term ${i + 1}`,
        weeks: h.weeks,
        items: h.items,
        wording: h.items.map((id) => statementById.get(id)?.text ?? ""),
      })),
    },
    null,
    2,
  )}\n`;
}

/** Reads a downloaded file back, or throws with a message a teacher can act on. */
export function readSchemeFile(contents: string): Scheme {
  let data: unknown;
  try {
    data = JSON.parse(contents);
  } catch {
    throw new Error("This file is not a MathsPlanner scheme of work (it is not JSON).");
  }
  return schemeFromData(data);
}

/** Reads a scheme from a file's parsed JSON, such as one inside a workspace backup, or throws. */
export function schemeFromData(data: unknown): Scheme {
  const file = data as Omit<SchemeParts, "halfTerms"> & { format?: unknown; halfTerms?: unknown };
  if (file?.format !== FILE_FORMAT || !Array.isArray(file.halfTerms))
    throw new Error("This file is not a MathsPlanner scheme of work.");
  const scheme = cleanScheme({ ...file, halfTerms: file.halfTerms });
  if (!scheme)
    throw new Error(`The file's course, ${String(file.course)}, is not one MathsPlanner knows.`);
  return scheme;
}

/** A file name from the title: "Year 7 maths" → "year-7-maths.json". */
export const fileName = (scheme: Scheme) =>
  `${
    scheme.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "scheme"
  }.json`;

// --- prerequisites --------------------------------------------------------------------------

export interface Place {
  term: number;
  index: number;
}

const before = (a: Place, b: Place) => a.term < b.term || (a.term === b.term && a.index < b.index);

/**
 * Where each statement is taught. A placed statement also teaches its steps; a statement whose
 * steps are all placed is taught once the last of them is.
 */
export function placesOf(scheme: Scheme): Map<string, Place> {
  const places = new Map<string, Place>();
  scheme.halfTerms.forEach((h, term) =>
    h.items.forEach((id, index) => places.set(id, { term, index })),
  );
  for (const [id, place] of [...places]) {
    for (const step of stepsOf.get(id) ?? []) {
      const own = places.get(step.id);
      if (!own || before(place, own)) places.set(step.id, place);
    }
  }
  for (const [parent, steps] of stepsOf) {
    const at = steps.map((s) => places.get(s.id));
    if (places.has(parent) || at.some((p) => !p)) continue;
    places.set(parent, at.reduce((a, b) => (b && a && before(a, b) ? b : a)) as Place);
  }
  return places;
}

/**
 * How one prerequisite stands: taught earlier; taught later (a warning); in the course but not in
 * the scheme (a warning); or from an earlier year or course, which students should already know.
 */
export type NeedStatus = "earlier" | "later" | "missing" | "prior";

export interface Need {
  id: string;
  status: NeedStatus;
  /** Where it is taught, if it is in the scheme. */
  place?: Place;
}

/** Whether an unplanned prerequisite is one students should have met before this scheme. */
function priorTo(course: Course | undefined, need: Statement): boolean {
  if (!course?.stages.includes(need.stage)) return true;
  // In the second year of a qualification, what is not planned this year was taught last year.
  return course.year !== undefined && statementYears(need)[0] < course.year;
}

export function needsOf(scheme: Scheme, places: Map<string, Place>, id: string): Need[] {
  const course = courseById.get(scheme.course);
  const here = places.get(id);
  return (statementById.get(id)?.needs ?? []).map((need) => {
    const place = places.get(need);
    const s = statementById.get(need);
    if (!place) return { id: need, status: !s || priorTo(course, s) ? "prior" : "missing" };
    return { id: need, status: !here || before(place, here) ? "earlier" : "later", place };
  });
}

/** How many items in each half-term are taught before one of their prerequisites, or without it. */
export function warningsPerTerm(scheme: Scheme): number[] {
  const places = placesOf(scheme);
  return scheme.halfTerms.map(
    (h) =>
      h.items.filter((id) =>
        needsOf(scheme, places, id).some((n) => n.status === "later" || n.status === "missing"),
      ).length,
  );
}

/**
 * The prerequisites a half-term relies on from before it: those from earlier years, and any not
 * yet in the scheme, which a quick check before teaching can test.
 */
export function prerequisitesOf(scheme: Scheme, term: number): string[] {
  const places = placesOf(scheme);
  const ids = (scheme.halfTerms[term]?.items ?? []).flatMap((id) =>
    needsOf(scheme, places, id)
      .filter((n) => n.status === "prior" || n.status === "missing")
      .map((n) => n.id),
  );
  return [...new Set(ids)].filter((id) => generatorFor(id));
}

// --- lessons and weeks ----------------------------------------------------------------------

/** About one lesson a step: a statement split into steps takes one lesson for each. */
export const defaultLessons = (id: string) => Math.max(1, stepsOf.get(id)?.length ?? 0);

export const lessonsOf = (scheme: Scheme, id: string) => scheme.lessons[id] ?? defaultLessons(id);

export interface WeekPlan {
  /** The week (0, 1, …) each item starts in; an item past the end starts in the last week. */
  starts: number[];
  /**
   * The statements taught each week, for homework. A statement with steps and the default
   * lessons is taught a step a lesson, so its steps fall in the weeks they are taught.
   */
  weeks: string[][];
  lessons: number;
  capacity: number;
}

/** The lessons in each week of a half-term: the class's timetable if known, else lessonsPerWeek. */
export function weekLessonsOf(scheme: Scheme, term: number): number[] {
  const given = scheme.weekLessons?.[term];
  if (given?.length) return given;
  const weeks = Math.max(1, scheme.halfTerms[term]?.weeks ?? 1);
  return Array.from({ length: weeks }, () => Math.max(1, scheme.lessonsPerWeek));
}

export function weekPlan(scheme: Scheme, term: number): WeekPlan {
  const h = scheme.halfTerms[term] ?? { weeks: 1, items: [] };
  const pattern = weekLessonsOf(scheme, term);
  const weeks: string[][] = pattern.map(() => []);
  // The lesson each week ends before; a lesson past the last falls in the last week.
  let total = 0;
  const ends = pattern.map((n) => (total += n));
  const weekAt = (lesson: number) => {
    const week = ends.findIndex((end) => lesson < end);
    return week < 0 ? pattern.length - 1 : week;
  };
  let lesson = 0;
  const starts = h.items.map((id) => {
    const start = weekAt(lesson);
    const steps = stepsOf.get(id) ?? [];
    if (steps.length && scheme.lessons[id] === undefined) {
      steps.forEach((step, i) => weeks[weekAt(lesson + i)]?.push(step.id));
    } else {
      weeks[start]?.push(id);
    }
    lesson += lessonsOf(scheme, id);
    return start;
  });
  return { starts, weeks, lessons: lesson, capacity: total };
}

/**
 * What each lesson of a half-term teaches, in order: an item taking n lessons fills n of them, and
 * a statement with steps and its default lessons teaches a step a lesson. The list runs past the
 * half-term's lessons when too much is planned, and stops short when too little is.
 */
export function lessonPlan(scheme: Scheme, term: number): string[] {
  return (scheme.halfTerms[term]?.items ?? []).flatMap((id) => {
    const steps = stepsOf.get(id) ?? [];
    if (steps.length && scheme.lessons[id] === undefined) return steps.map((s) => s.id);
    return Array.from({ length: lessonsOf(scheme, id) }, () => id);
  });
}

// --- editing --------------------------------------------------------------------------------

const without = (lessons: Record<string, number>, id: string) =>
  Object.fromEntries(Object.entries(lessons).filter(([key]) => key !== id));

/** Removes an item from wherever it is. */
export function removeItem(scheme: Scheme, id: string): Scheme {
  const lessons = without(scheme.lessons, id);
  return {
    ...scheme,
    lessons,
    halfTerms: scheme.halfTerms.map((h) => ({ ...h, items: h.items.filter((x) => x !== id) })),
  };
}

/** Puts an item into a half-term at an index (the end by default), moving it if it was placed. */
export function placeItem(scheme: Scheme, id: string, term: number, index?: number): Scheme {
  const from = scheme.halfTerms.findIndex((h) => h.items.includes(id));
  const fromIndex = from >= 0 ? (scheme.halfTerms[from]?.items.indexOf(id) ?? -1) : -1;
  let at = index ?? Infinity;
  if (from === term && fromIndex < at) at -= 1;
  return {
    ...scheme,
    halfTerms: scheme.halfTerms.map((h, i) => {
      const items = h.items.filter((x) => x !== id);
      if (i === term) items.splice(Math.min(at, items.length), 0, id);
      return { ...h, items };
    }),
  };
}

/** Sets how many lessons an item takes. */
export function setLessons(scheme: Scheme, id: string, n: number): Scheme {
  const lessons = without(scheme.lessons, id);
  if (n !== defaultLessons(id)) lessons[id] = Math.min(MAX_LESSONS, Math.max(1, Math.round(n)));
  return { ...scheme, lessons };
}

// --- drafts ---------------------------------------------------------------------------------

/**
 * The school year (0, 1, …) of the scheme a statement goes in, or -1 to spread it over the whole
 * course, or undefined to leave it out (it belongs to another year of a one-year course).
 */
function yearOf(course: Course, s: Statement, half: Set<string>): number | undefined {
  if (course.year !== undefined) {
    if (!inThisYear(course, s)) return undefined;
    // GCSE and Core Maths have no recommended year: Year 10 takes the first half of each strand.
    const [first, last] = statementYears(s);
    if (course.part !== undefined && first < last)
      return half.has(s.id) === (course.part === 0) ? 0 : undefined;
    return 0;
  }
  const [first, last] = statementYears(s);
  const y = course.years.indexOf(stageName(s.stage));
  if (y >= 0) return y;
  if (first === last || course.stages.some((st) => st === "AL" || st === "FM"))
    return Math.min(course.years.length - 1, Math.max(0, first - 12));
  // A GCSE or Core Maths course teaches everything across both years.
  return -1;
}

/**
 * A first draft from the curriculum: every statement in the course's year, each split into its
 * steps where it has them, put in prerequisite order (otherwise curriculum order, so strands stay
 * together) and shared across the half-terms in proportion to their weeks.
 */
export function draftScheme(course: Course, title?: string, className = ""): Scheme {
  const scheme = emptyScheme(course, title, className);
  const items = coursePool(course).flatMap((s) => {
    const steps = stepsOf.get(s.id) ?? [];
    return steps.length ? steps : [s];
  });
  const order = new Map(items.map((s, i) => [s.id, i]));
  // A prerequisite on a statement that is split means all of its steps.
  const expand = (id: string) => (order.has(id) ? [id] : (stepsOf.get(id) ?? []).map((s) => s.id));
  const needs = new Map(
    items.map((s) => [s.id, s.needs.flatMap(expand).filter((n) => order.has(n) && n !== s.id)]),
  );
  // Strands in the order they first appear, so a Higher course keeps each tier's number together.
  const strands = [...new Set(items.map((s) => s.strand))];
  const strand = (s: Statement) => strands.indexOf(s.strand);
  // Kahn's algorithm, always taking the earliest ready item by strand, then curriculum order.
  const sorted: Statement[] = [];
  const done = new Set<string>();
  let rest = [...items].sort(
    (a, b) => strand(a) - strand(b) || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );
  while (rest.length) {
    const ready = rest.find((s) => needs.get(s.id)?.every((n) => done.has(n))) ?? rest[0];
    if (!ready) break;
    sorted.push(ready);
    done.add(ready.id);
    rest = rest.filter((s) => s !== ready);
  }
  // The first half of each strand, for the first year of a qualification with no recommended year.
  const half = new Set<string>();
  for (const st of strands) {
    const list = sorted.filter((s) => s.strand === st);
    list.slice(0, Math.ceil(list.length / 2)).forEach((s) => half.add(s.id));
  }
  const year = (s: Statement) => yearOf(course, s, half);
  const share = (list: Statement[], terms: HalfTerm[]) => {
    const total = terms.reduce((sum, h) => sum + h.weeks, 0);
    let weeks = 0;
    let start = 0;
    for (const h of terms) {
      weeks += h.weeks;
      const end = Math.round((list.length * weeks) / total);
      h.items.push(...list.slice(start, end).map((s) => s.id));
      start = end;
    }
  };
  course.years.forEach((_, y) =>
    share(
      sorted.filter((s) => year(s) === y),
      scheme.halfTerms.slice(y * 6, y * 6 + 6),
    ),
  );
  share(
    sorted.filter((s) => year(s) === -1),
    scheme.halfTerms,
  );
  return scheme;
}

/** Every item placed before a half-term, for retrieval practice. */
export const earlierItems = (scheme: Scheme, term: number): string[] =>
  scheme.halfTerms.slice(0, term).flatMap((h) => h.items);

/** The items of a half-term's school year up to and including it, for a cumulative test. */
export const yearSoFar = (scheme: Scheme, term: number): string[] =>
  scheme.halfTerms.slice(term - (term % 6), term + 1).flatMap((h) => h.items);

// --- coverage -------------------------------------------------------------------------------

export interface Coverage {
  /** The statements of the course's year (or the whole course), top-level ones. */
  all: Statement[];
  unplanned: Statement[];
  /** Statements with some but not all of their steps planned. */
  partly: Statement[];
}

export function coverage(scheme: Scheme): Coverage | undefined {
  const course = courseById.get(scheme.course);
  if (!course) return undefined;
  const places = placesOf(scheme);
  const all = coursePool(course).filter((s) => inThisYear(course, s));
  const unplanned = all.filter((s) => !places.has(s.id));
  return {
    all,
    unplanned: unplanned.filter((s) => !(stepsOf.get(s.id) ?? []).some((x) => places.has(x.id))),
    partly: unplanned.filter((s) => (stepsOf.get(s.id) ?? []).some((x) => places.has(x.id))),
  };
}

// --- homework and checks --------------------------------------------------------------------

/** New content is practised for fluency; call-backs, once students have had time, go deeper. */
export const NEW_DEPTHS: Depth[] = [1, 2];
export const RECALL_DEPTHS: Depth[] = [2, 3, 4];

/**
 * Shares `total` questions over groups of statements, so that every group gets at least one. With
 * `recent`, later groups get more of the rest; with fewer questions than groups, the earliest
 * groups are merged until there are few enough.
 */
export function allocate(
  groups: readonly string[][],
  total: number,
  weighting: "recent" | "even",
): { statements: string[]; count: number }[] {
  const list = groups.filter((g) => g.length > 0).map((g) => [...g]);
  if (total < 1 || list.length === 0) return [];
  while (list.length > total) {
    const [a = [], b = []] = list.splice(0, 2);
    list.unshift([...a, ...b]);
  }
  const weights = list.map((_, i) => (weighting === "recent" ? i + 1 : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  const spare = total - list.length;
  const exact = weights.map((w) => (spare * w) / sum);
  const counts = exact.map((x) => 1 + Math.floor(x));
  let left = total - counts.reduce((a, b) => a + b, 0);
  // Largest remainders first, the most recent winning ties.
  const order = exact
    .map((x, i) => ({ r: x - Math.floor(x), i }))
    .sort((a, b) => b.r - a.r || b.i - a.i);
  for (const { i } of order) if (left-- > 0) counts[i] = (counts[i] ?? 1) + 1;
  return list.map((statements, i) => ({ statements, count: counts[i] ?? 1 }));
}

export interface HomeworkOptions {
  count: number;
  /** Also call back to earlier half-terms. */
  earlierTerms: boolean;
  numbers: SessionSpec["numbers"];
  feedback: SessionSpec["feedback"];
}

export interface Homework {
  spec: SessionSpec;
  /** "week" is new content with call-backs; "review" is the last week, covering everything. */
  kind: "week" | "review";
  /** The statements first taught that week. */
  taught: string[];
  /** How many questions call back to earlier weeks and half-terms. */
  recall: number;
}

/** What the class is called on homework: its name, or the course. */
export const classLabel = (scheme: Scheme) =>
  scheme.className || courseById.get(scheme.course)?.name || "";

/**
 * One week's homework. About half the questions are on that week's new content and the rest call
 * back to earlier weeks of the half-term, every earlier week at least once and recent ones more
 * (and, if asked, a couple to earlier half-terms). The last week reviews the whole half-term, with
 * a question on every item, so by the end of the half-term the homework has covered it all.
 */
export function weekHomework(
  scheme: Scheme,
  term: number,
  week: number,
  options: HomeworkOptions,
): Homework | undefined {
  const course = courseById.get(scheme.course);
  const plan = weekPlan(scheme, term);
  if (!course || week >= plan.weeks.length) return undefined;
  const name = halfTermName(course, term);
  const seed = scheme.seed * 1000 + term * 40 + week;
  const base = {
    numbers: options.numbers,
    feedback: options.feedback,
    seed,
  };
  const taught = plan.weeks[week] ?? [];
  const earlier = plan.weeks.slice(0, week);

  if (week === plan.weeks.length - 1) {
    const units = plan.weeks.flat().map((id) => [id]);
    if (units.length === 0) return undefined;
    const count = Math.min(MAX_QUESTIONS, Math.max(options.count, units.length));
    const groups = allocate(units, count, "even");
    return {
      kind: "review",
      taught,
      recall: count,
      spec: {
        ...base,
        statements: units.flat(),
        depths: RECALL_DEPTHS,
        count,
        title: `${classLabel(scheme)}: ${name} review homework`,
        review: { groups, depths: RECALL_DEPTHS },
      },
    };
  }

  const before = earlier.flat();
  if (taught.length === 0 && before.length === 0) return undefined;
  const fresh =
    taught.length === 0 ? 0 : before.length ? Math.ceil(options.count / 2) : options.count;
  let recall = options.count - fresh;
  const termItems = earlierItems(scheme, term);
  const fromTerms =
    options.earlierTerms && termItems.length ? (recall >= 4 ? 2 : recall >= 2 ? 1 : 0) : 0;
  recall -= fromTerms;
  const groups = [
    ...(fromTerms ? [{ statements: termItems, count: fromTerms }] : []),
    ...allocate(earlier, recall, "recent"),
  ];
  return {
    kind: "week",
    taught,
    recall: groups.reduce((sum, g) => sum + g.count, 0),
    spec: {
      ...base,
      statements: taught.length ? taught : before,
      depths: NEW_DEPTHS,
      count: options.count,
      title: `${classLabel(scheme)}: ${name} week ${week + 1} homework`,
      ...(groups.length ? { review: { groups, depths: RECALL_DEPTHS } } : {}),
    },
  };
}

/**
 * A short quiz on prerequisites, to run before teaching a topic or half-term: one question per
 * statement, five to eight in all, at the first two depths.
 */
export function prerequisiteCheck(ids: string[], title: string, seed: number): SessionSpec {
  return {
    statements: ids,
    depths: [1, 2],
    numbers: "standard",
    count: Math.min(8, Math.max(5, ids.length)),
    seed,
    feedback: "end",
    title,
    paper: { kind: "set", start: 1, end: 2, marks: 0 },
  };
}
