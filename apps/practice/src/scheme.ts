// A scheme of work: a course (one year, or a key stage or qualification spread over several years)
// planned in half-terms, six a year, each an ordered list of statements and sub-statements. Like a
// session, a scheme lives only in its link or in a file the teacher downloads, so nothing is stored
// on a server; the browser also keeps the last scheme as a convenience.
import type { Statement } from "@mathsplanner/core";
import { stageName } from "./papers.ts";
// session.ts imports this file for scheme links, so nothing here may use it at load time.
import { generatorFor, practisable, statementById, stepsOf } from "./session.ts";

export interface Course {
  id: string;
  name: string;
  /** The stages whose statements the course teaches. */
  stages: string[];
  /** One label per school year the course runs over. */
  years: string[];
}

const single = (stage: string): Course => ({
  id: stage,
  name: stageName(stage),
  stages: [stage],
  years: [stageName(stage)],
});
const twoYears = (id: string, name: string, stages: string[], first: number): Course => ({
  id,
  name,
  stages,
  years: [`Year ${first}`, `Year ${first + 1}`],
});

export const COURSES: Course[] = [
  ...["N", "R", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6", "Y7", "Y8", "Y9"].map(single),
  twoYears("GF", "GCSE Foundation", ["GF"], 10),
  twoYears("GH", "GCSE Higher", ["GF", "GH"], 10),
  twoYears("AL", "A level Maths", ["AL"], 12),
  twoYears("FM", "Further Maths", ["FM"], 12),
  twoYears("CM", "Core Maths", ["CM"], 12),
  {
    id: "EYFS",
    name: "Early years (Nursery and Reception)",
    stages: ["N", "R"],
    years: ["Nursery", "Reception"],
  },
  {
    id: "KS1",
    name: "Key Stage 1 (Years 1 and 2)",
    stages: ["Y1", "Y2"],
    years: ["Year 1", "Year 2"],
  },
  {
    id: "KS2",
    name: "Key Stage 2 (Years 3 to 6)",
    stages: ["Y3", "Y4", "Y5", "Y6"],
    years: ["Year 3", "Year 4", "Year 5", "Year 6"],
  },
  {
    id: "KS3",
    name: "Key Stage 3 (Years 7 to 9)",
    stages: ["Y7", "Y8", "Y9"],
    years: ["Year 7", "Year 8", "Year 9"],
  },
];

export const courseById = new Map(COURSES.map((c) => [c.id, c]));

export const TERMS = ["Autumn 1", "Autumn 2", "Spring 1", "Spring 2", "Summer 1", "Summer 2"];
/** A typical English school year: about 39 weeks, with shorter spring half-terms. */
export const DEFAULT_WEEKS = [7, 7, 6, 6, 6, 7];
export const MAX_WEEKS = 12;
export const MAX_TITLE = 120;

export interface HalfTerm {
  weeks: number;
  /** Statement and sub-statement IDs in teaching order. */
  items: string[];
}

export interface Scheme {
  title: string;
  course: string;
  halfTerms: HalfTerm[];
}

/** A half-term's name, with its year when the course runs over more than one. */
export function halfTermName(course: Course, index: number, short = false): string {
  const term = TERMS[index % 6] ?? "";
  const name = short ? term.replace(/^(\w{3})\w* /, "$1 ") : term;
  return course.years.length > 1 ? `${course.years[Math.floor(index / 6)]} ${name}` : name;
}

export function emptyScheme(course: Course, title = `${course.name} scheme of work`): Scheme {
  return {
    title,
    course: course.id,
    halfTerms: course.years.flatMap(() => DEFAULT_WEEKS.map((weeks) => ({ weeks, items: [] }))),
  };
}

/** The statements a course offers, top-level ones only (their steps come with them). */
export function coursePool(course: Course): Statement[] {
  return practisable.filter((s) => !s.parent && course.stages.includes(s.stage));
}

// --- links and files ------------------------------------------------------------------------

const clampWeeks = (v: unknown, fallback: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 1 && n <= MAX_WEEKS ? n : fallback;
};

/**
 * Builds a scheme from untrusted parts, dropping anything invalid: an unknown course gives
 * undefined, unknown IDs and repeats are dropped, and the half-terms are padded or cut to six a
 * year.
 */
function cleanScheme(
  title: unknown,
  courseId: unknown,
  halfTerms: readonly { weeks?: unknown; items?: unknown }[],
): Scheme | undefined {
  const course = courseById.get(String(courseId));
  if (!course) return undefined;
  const seen = new Set<string>();
  const terms = course.years.flatMap((_, y) =>
    DEFAULT_WEEKS.map((weeks, t) => {
      const raw = halfTerms[y * 6 + t];
      const items = (Array.isArray(raw?.items) ? raw.items : [])
        .map(String)
        .filter((id) => generatorFor(id) && !seen.has(id) && seen.add(id));
      return { weeks: clampWeeks(raw?.weeks, weeks), items };
    }),
  );
  const name = typeof title === "string" ? title.trim().slice(0, MAX_TITLE) : "";
  return { title: name || `${course.name} scheme of work`, course: course.id, halfTerms: terms };
}

/** The scheme's link: `#/scheme?course=Y7&title=…&weeks=7,7,6,6,6,7&h1=…&h2=…`. */
export function formatScheme(scheme: Scheme): string {
  const params = new URLSearchParams();
  params.set("course", scheme.course);
  params.set("title", scheme.title);
  params.set("weeks", scheme.halfTerms.map((h) => h.weeks).join(","));
  scheme.halfTerms.forEach((h, i) => {
    if (h.items.length) params.set(`h${i + 1}`, h.items.join(","));
  });
  return `#/scheme?${params.toString().replace(/%2C/g, ",")}`;
}

/** Reads a scheme from a link's query, or undefined when there is no valid course. */
export function parseScheme(query: string): Scheme | undefined {
  const q = new URLSearchParams(query);
  const weeks = (q.get("weeks") ?? "").split(",");
  const course = courseById.get(q.get("course") ?? "");
  const count = (course?.years.length ?? 0) * 6;
  const halfTerms = Array.from({ length: count }, (_, i) => ({
    weeks: weeks[i],
    items: (q.get(`h${i + 1}`) ?? "").split(",").filter(Boolean),
  }));
  return cleanScheme(q.get("title"), q.get("course"), halfTerms);
}

export const FILE_FORMAT = "mathsplanner-scheme";

/** The downloadable file: readable JSON with each half-term named and each item's wording. */
export function schemeFile(scheme: Scheme): string {
  const course = courseById.get(scheme.course);
  return `${JSON.stringify(
    {
      format: FILE_FORMAT,
      version: 1,
      title: scheme.title,
      course: scheme.course,
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
export function readSchemeFile(text: string): Scheme {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This file is not a MathsPlanner scheme of work (it is not JSON).");
  }
  const file = data as { format?: unknown; title?: unknown; course?: unknown; halfTerms?: unknown };
  if (file?.format !== FILE_FORMAT || !Array.isArray(file.halfTerms))
    throw new Error("This file is not a MathsPlanner scheme of work.");
  const scheme = cleanScheme(file.title, file.course, file.halfTerms);
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

export function needsOf(scheme: Scheme, places: Map<string, Place>, id: string): Need[] {
  const course = courseById.get(scheme.course);
  const here = places.get(id);
  return (statementById.get(id)?.needs ?? []).map((need) => {
    const place = places.get(need);
    const stage = statementById.get(need)?.stage ?? "";
    if (!place) return { id: need, status: course?.stages.includes(stage) ? "missing" : "prior" };
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

// --- editing --------------------------------------------------------------------------------

/** Removes an item from wherever it is. */
export function removeItem(scheme: Scheme, id: string): Scheme {
  return {
    ...scheme,
    halfTerms: scheme.halfTerms.map((h) => ({ ...h, items: h.items.filter((x) => x !== id) })),
  };
}

/** Puts an item into a half-term at an index (the end by default), moving it if it was placed. */
export function placeItem(scheme: Scheme, id: string, term: number, index?: number): Scheme {
  const from = scheme.halfTerms.findIndex((h) => h.items.includes(id));
  const fromIndex = from >= 0 ? (scheme.halfTerms[from]?.items.indexOf(id) ?? -1) : -1;
  let at = index ?? Infinity;
  if (from === term && fromIndex < at) at -= 1;
  const removed = removeItem(scheme, id);
  return {
    ...removed,
    halfTerms: removed.halfTerms.map((h, i) => {
      if (i !== term) return h;
      const items = [...h.items];
      items.splice(Math.min(at, items.length), 0, id);
      return { ...h, items };
    }),
  };
}

// --- drafts ---------------------------------------------------------------------------------

/** The school year (0, 1, …) of the course a statement is usually taught in. */
function yearOf(course: Course, s: Statement): number {
  const parent = s.parent ? statementById.get(s.parent) : undefined;
  const years = s.years ?? parent?.years;
  if (years) return Math.min(course.years.length - 1, Math.max(0, Math.min(...years) - 12));
  // Key stages run one stage a year; a GCSE Higher course teaches both tiers over both years.
  return course.years.indexOf(stageName(s.stage));
}

/**
 * A first draft from the curriculum: every statement in the course, each split into its steps
 * where it has them, put in prerequisite order (otherwise curriculum order, so strands stay
 * together) and shared across the half-terms in proportion to their weeks. Statements with a
 * recommended year go in that year; the rest (GCSE, Core Maths) are spread over the whole course.
 */
export function draftScheme(course: Course, title?: string): Scheme {
  const scheme = emptyScheme(course, title);
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
  const byYear = course.years.map((_, y) => sorted.filter((s) => yearOf(course, s) === y));
  const spread = sorted.filter((s) => yearOf(course, s) < 0);
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
  byYear.forEach((list, y) => share(list, scheme.halfTerms.slice(y * 6, y * 6 + 6)));
  share(spread, scheme.halfTerms);
  return scheme;
}

/** Every item placed before a half-term, for retrieval practice. */
export const earlierItems = (scheme: Scheme, term: number): string[] =>
  scheme.halfTerms.slice(0, term).flatMap((h) => h.items);

/** The items of a half-term's school year up to and including it, for a cumulative test. */
export const yearSoFar = (scheme: Scheme, term: number): string[] =>
  scheme.halfTerms.slice(term - (term % 6), term + 1).flatMap((h) => h.items);
