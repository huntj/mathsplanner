// A teacher's own set-up, kept in this browser: their timetable (one week or two, periods a day,
// lesson length), the dates of the six half-terms, and their classes, each with the periods it is
// taught in, the lessons homework is set and handed in, and its scheme of work. From these the
// calendar gives every class's lessons with dates, so its scheme plans real lessons rather than a
// number a week. Nothing is sent anywhere: the set-up leaves the browser only as a backup file the
// teacher downloads. No student names or results are kept.
import {
  courseById,
  emptyScheme,
  MAX_CLASS,
  MAX_LESSONS,
  MAX_WEEKS,
  schemeFile,
  schemeFromData,
  type Course,
  type Scheme,
} from "./scheme.ts";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
export const MAX_PERIODS = 10;
export const MIN_MINUTES = 20;
export const MAX_MINUTES = 180;
/** The colours classes are shown in, by index; a stylesheet gives each its value. */
export const COLOURS = 8;

export interface Timetable {
  /** A one-week timetable, or two weeks (Week A and Week B) that alternate. */
  weeks: 1 | 2;
  /**
   * With two weeks: whether the first week back after a holiday follows on from the last week
   * before it (true), or every half-term starts again on the first week (false).
   */
  carryOn: boolean;
  /** With two weeks: the week (0 for A, 1 for B) the first half-term starts on. */
  firstWeek: 0 | 1;
  periods: number;
  /** Only sets how tall a lesson is drawn; it does not change what is planned. */
  lessonMinutes: number;
}

/** A period in the timetable: its week (0 for A, 1 for B), day (0 for Monday) and period (0, 1, …). */
export interface Slot {
  week: 0 | 1;
  day: number;
  period: number;
}

/** A half-term's first and last days, as YYYY-MM-DD; empty while not yet given. */
export interface HalfTermDates {
  start: string;
  end: string;
}

/** Homework set in one of the class's periods and handed in at the next lesson in another. */
export interface HomeworkSlots {
  set: Slot;
  due: Slot;
}

export interface SchoolClass {
  id: string;
  /** Which of the COLOURS the class is drawn in. */
  colour: number;
  /** The periods the class is taught in; two in a row are two lessons. */
  slots: Slot[];
  /** One a week: with a two-week timetable, one in each week. */
  homework: HomeworkSlots[];
  /**
   * For each half-term, the lesson (0, 1, …) its test is in, or null for the last lesson of the
   * half-term.
   */
  tests: (number | null)[];
  /** The class's scheme of work; its class name is the class's name. */
  scheme: Scheme;
}

export interface Workspace {
  timetable: Timetable;
  /** The six half-terms of the school year, in order. */
  terms: HalfTermDates[];
  classes: SchoolClass[];
}

export const DEFAULT_TIMETABLE: Timetable = {
  weeks: 1,
  carryOn: true,
  firstWeek: 0,
  periods: 5,
  lessonMinutes: 60,
};

// --- dates ----------------------------------------------------------------------------------
// Dates are counted in whole days from 1 January 1970 in UTC, so time zones and summer time
// cannot move a lesson to another day.

const DAY_MS = 86_400_000;

/** A YYYY-MM-DD date as a day number, or undefined if it is not a real date. */
export function dayNumber(date: string): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return undefined;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d)
    return undefined;
  return ms / DAY_MS;
}

export const dateOf = (day: number) => new Date(day * DAY_MS).toISOString().slice(0, 10);

/** The day of the week, 0 for Monday to 6 for Sunday. */
export const weekday = (day: number) => (((day + 3) % 7) + 7) % 7;

const mondayOf = (day: number) => day - weekday(day);

/** Today's date in the browser's own time zone, as YYYY-MM-DD. */
export function today(): string {
  const now = new Date();
  return dateOf(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
}

/** Usual half-term lengths in weeks (the first counting its part week), and the holidays after. */
const TERM_WEEKS = [8, 7, 6, 6, 6, 7];
const HOLIDAY_WEEKS = [1, 2, 1, 2, 1];

/**
 * Suggested half-term dates for the school year a date falls in (from August, the year starting
 * that September): from 2 September, or the Monday after if it is a weekend, in the usual lengths.
 * They are a starting point for the teacher to change to their school's.
 */
export function suggestedTerms(date: string): HalfTermDates[] {
  const day = dayNumber(date) ?? 0;
  const at = new Date(day * DAY_MS);
  const year = at.getUTCMonth() >= 7 ? at.getUTCFullYear() : at.getUTCFullYear() - 1;
  let start = dayNumber(`${year}-09-02`) ?? 0;
  if (weekday(start) > 4) start = mondayOf(start) + 7;
  return TERM_WEEKS.map((weeks, i) => {
    const end = mondayOf(start) + (weeks - 1) * 7 + 4;
    const term = { start: dateOf(start), end: dateOf(end) };
    start = mondayOf(start) + (weeks + (HOLIDAY_WEEKS[i] ?? 0)) * 7;
    return term;
  });
}

/** What is wrong with the half-term dates, one message per problem, for the set-up to show. */
export function termProblems(terms: readonly HalfTermDates[], names: readonly string[]): string[] {
  const problems: string[] = [];
  let previous: number | undefined;
  terms.forEach((t, i) => {
    const name = names[i] ?? `Half-term ${i + 1}`;
    const start = dayNumber(t.start);
    const end = dayNumber(t.end);
    if (start === undefined || end === undefined) {
      problems.push(`${name} needs a start and an end date.`);
      return;
    }
    if (end < start) problems.push(`${name} ends before it starts.`);
    else if (end - start > MAX_WEEKS * 7)
      problems.push(
        `${name} is longer than ${MAX_WEEKS} weeks. Is it a whole term? Give each half-term its own dates.`,
      );
    if (previous !== undefined && start <= previous)
      problems.push(`${name} starts before the half-term before it ends.`);
    previous = end;
  });
  return problems;
}

// --- the calendar ---------------------------------------------------------------------------

export interface TeachingWeek {
  /** The half-term (0 to 5) and the week of it (0, 1, …). */
  term: number;
  week: number;
  /** The Monday of the week, as YYYY-MM-DD, even when the half-term starts later in it. */
  monday: string;
  /** Which of Monday to Friday are in the half-term. */
  days: boolean[];
  /** Week A (0) or Week B (1); always 0 with a one-week timetable. */
  label: 0 | 1;
}

/** Every teaching week of the year in order: each week with a weekday in a half-term. */
export function teachingWeeks(ws: Workspace): TeachingWeek[] {
  const { weeks: cycle, carryOn, firstWeek } = ws.timetable;
  const result: TeachingWeek[] = [];
  // Weeks taught so far; a week split between two half-terms counts once.
  let count = 0;
  let lastMonday: number | undefined;
  ws.terms.forEach((t, term) => {
    const start = dayNumber(t.start);
    const end = dayNumber(t.end);
    if (start === undefined || end === undefined || end < start) return;
    let week = 0;
    for (let monday = mondayOf(start); monday <= end; monday += 7) {
      const days = DAYS.map((_, d) => monday + d >= start && monday + d <= end);
      if (!days.some(Boolean)) continue;
      if (monday !== lastMonday) count += 1;
      lastMonday = monday;
      const n = carryOn ? count - 1 : week;
      const label = cycle === 1 ? 0 : (((firstWeek + n) % 2) as 0 | 1);
      result.push({ term, week, monday: dateOf(monday), days, label });
      week += 1;
    }
  });
  return result;
}

/**
 * The teaching week a date is in, or if it is in a holiday, the next one; undefined after the
 * last. A weekend looks ahead to the week after it.
 */
export function weekFor(weeks: readonly TeachingWeek[], date: string): number | undefined {
  const monday = mondayOf((dayNumber(date) ?? 0) + 2);
  const i = weeks.findIndex((w) => (dayNumber(w.monday) ?? 0) >= monday);
  return i < 0 ? undefined : i;
}

export interface Lesson {
  term: number;
  week: number;
  /** The lesson of the half-term (0, 1, …), which the scheme's lesson plan fills in order. */
  index: number;
  date: string;
  day: number;
  period: number;
  label: 0 | 1;
}

const sameSlot = (a: Slot, b: Slot) =>
  a.week === b.week && a.day === b.day && a.period === b.period;
const bySlot = (a: Slot, b: Slot) => a.week - b.week || a.day - b.day || a.period - b.period;

/** A class's lessons through the year, in order, from its periods and the teaching weeks. */
export function classLessons(
  ws: Workspace,
  cls: SchoolClass,
  weeks: readonly TeachingWeek[] = teachingWeeks(ws),
): Lesson[] {
  const slots = [...cls.slots].sort(bySlot);
  const lessons: Lesson[] = [];
  const counts: number[] = [];
  for (const w of weeks) {
    const monday = dayNumber(w.monday) ?? 0;
    for (const s of slots) {
      if (s.week !== w.label || !w.days[s.day]) continue;
      const index = counts[w.term] ?? 0;
      counts[w.term] = index + 1;
      const date = dateOf(monday + s.day);
      const { day, period } = s;
      lessons.push({ term: w.term, week: w.week, index, date, day, period, label: w.label });
    }
  }
  return lessons;
}

/** Whether a lesson is in one of these periods. */
const inSlot = (lesson: Lesson, slot: Slot) =>
  lesson.label === slot.week && lesson.day === slot.day && lesson.period === slot.period;

export interface HomeworkDate {
  /** The lesson it is set in, which decides the scheme week whose homework it is. */
  set: Lesson;
  /** The lesson it is handed in, or undefined when there is none left in the year. */
  due: Lesson | undefined;
}

/** Every homework a class is set through the year: one in each lesson chosen for setting it. */
export function homeworkDates(lessons: readonly Lesson[], cls: SchoolClass): HomeworkDate[] {
  return lessons.flatMap((lesson, i) => {
    const hw = cls.homework.find((h) => inSlot(lesson, h.set));
    if (!hw) return [];
    return [{ set: lesson, due: lessons.slice(i + 1).find((l) => inSlot(l, hw.due)) }];
  });
}

/** Each half-term's test lesson: the one chosen, or the last; undefined with no lessons. */
export function testLessons(lessons: readonly Lesson[], cls: SchoolClass): (Lesson | undefined)[] {
  return cls.tests.map((chosen, term) => {
    const own = lessons.filter((l) => l.term === term);
    return own[Math.min(chosen ?? Infinity, own.length - 1)];
  });
}

/**
 * The class's scheme with its weeks and lessons a week from the calendar: each half-term has its
 * teaching weeks, each holding the class's lessons that week, so a week with fewer lessons (or a
 * Week B with more) holds less or more. Half-terms without dates keep what the scheme has.
 */
export function withCalendar(
  scheme: Scheme,
  weeks: readonly TeachingWeek[],
  lessons: readonly Lesson[],
): Scheme {
  const weekLessons = scheme.halfTerms.map((_, term) =>
    weeks
      .filter((w) => w.term === term)
      .map((w) => lessons.filter((l) => l.term === term && l.week === w.week).length),
  );
  const counted = weekLessons.flat();
  const average = counted.length
    ? Math.round(counted.reduce((a, b) => a + b, 0) / counted.length)
    : scheme.lessonsPerWeek;
  return {
    ...scheme,
    lessonsPerWeek: Math.min(MAX_LESSONS, Math.max(1, average)),
    halfTerms: scheme.halfTerms.map((h, term) => {
      const n = weekLessons[term]?.length ?? 0;
      return n ? { ...h, weeks: Math.min(MAX_WEEKS, n) } : h;
    }),
    weekLessons,
  };
}

// --- editing --------------------------------------------------------------------------------

const TERM_COUNT = 6;

const inRange = (tt: Timetable, s: Slot) =>
  s.week < tt.weeks && s.day >= 0 && s.day < DAYS.length && s.period >= 0 && s.period < tt.periods;

/**
 * Makes a workspace consistent after any change: periods outside the timetable go, a period
 * belongs to one class at most (the first to have it), homework is only in the class's own
 * periods, every class has a test choice for each half-term, and each scheme takes its weeks and
 * lessons from the calendar.
 */
export function settle(ws: Workspace): Workspace {
  const taken: Slot[] = [];
  const classes = ws.classes.map((cls) => {
    const slots: Slot[] = [];
    for (const s of cls.slots) {
      if (!inRange(ws.timetable, s) || taken.some((t) => sameSlot(s, t))) continue;
      slots.push(s);
      taken.push(s);
    }
    const own = (s: Slot) => slots.some((x) => sameSlot(x, s));
    const homework = cls.homework
      .filter((h) => own(h.set) && own(h.due))
      .filter((h, i, all) => all.findIndex((x) => sameSlot(x.set, h.set)) === i);
    const tests = Array.from({ length: TERM_COUNT }, (_, t) => cls.tests[t] ?? null);
    return { ...cls, slots, homework, tests };
  });
  const weeks = teachingWeeks({ ...ws, classes });
  return {
    ...ws,
    classes: classes.map((cls) => ({
      ...cls,
      scheme: withCalendar(cls.scheme, weeks, classLessons(ws, cls, weeks)),
    })),
  };
}

export function emptyWorkspace(date = today()): Workspace {
  return { timetable: { ...DEFAULT_TIMETABLE }, terms: suggestedTerms(date), classes: [] };
}

/** The courses a class can follow: one school year each, since the half-terms are one year's. */
export const classCourse = (id: string): Course | undefined => {
  const course = courseById.get(id);
  return course && course.years.length === 1 ? course : undefined;
};

const newId = () => Math.random().toString(36).slice(2, 10);

/** Adds a class following a one-year course, in the first colour not yet used. */
export function addClass(ws: Workspace, courseId: string, name: string): Workspace {
  const course = classCourse(courseId);
  if (!course) return ws;
  const used = new Set(ws.classes.map((c) => c.colour));
  const colour = Array.from({ length: COLOURS }, (_, i) => i).find((i) => !used.has(i));
  const cls: SchoolClass = {
    id: newId(),
    colour: colour ?? ws.classes.length % COLOURS,
    slots: [],
    homework: [],
    tests: [],
    scheme: emptyScheme(course, undefined, name.trim().slice(0, MAX_CLASS)),
  };
  return settle({ ...ws, classes: [...ws.classes, cls] });
}

export const removeClass = (ws: Workspace, id: string): Workspace =>
  settle({ ...ws, classes: ws.classes.filter((c) => c.id !== id) });

/** Changes one class, then settles the workspace. */
export const updateClass = (
  ws: Workspace,
  id: string,
  change: (cls: SchoolClass) => SchoolClass,
): Workspace => settle({ ...ws, classes: ws.classes.map((c) => (c.id === id ? change(c) : c)) });

/** Gives a period to a class, taking it from any other; a period it already has is freed. */
export function toggleSlot(ws: Workspace, id: string, slot: Slot): Workspace {
  const has = ws.classes.find((c) => c.id === id)?.slots.some((s) => sameSlot(s, slot));
  return settle({
    ...ws,
    classes: ws.classes.map((c) => {
      const slots = c.slots.filter((s) => !sameSlot(s, slot));
      return { ...c, slots: c.id === id && !has ? [...slots, slot] : slots };
    }),
  });
}

/** The class taught in a period, if any. */
export const classAt = (ws: Workspace, slot: Slot): SchoolClass | undefined =>
  ws.classes.find((c) => c.slots.some((s) => sameSlot(s, slot)));

// --- storage and backups --------------------------------------------------------------------

export const WORKSPACE_FORMAT = "mathsplanner-workspace";
const STORE = "mathsplanner:workspace";

const int = (v: unknown, lo: number, hi: number, fallback: number) => {
  const n = Math.round(Number(v));
  return v !== "" && v !== null && Number.isFinite(n) && n >= lo && n <= hi ? n : fallback;
};
const record = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function cleanSlot(v: unknown): Slot | undefined {
  const r = record(v);
  const week = int(r.week, 0, 1, -1);
  const day = int(r.day, 0, DAYS.length - 1, -1);
  const period = int(r.period, 0, MAX_PERIODS - 1, -1);
  return week < 0 || day < 0 || period < 0 ? undefined : { week: week as 0 | 1, day, period };
}

function cleanClass(v: unknown): SchoolClass | undefined {
  const r = record(v);
  let scheme: Scheme;
  try {
    scheme = schemeFromData(r.scheme);
  } catch {
    return undefined;
  }
  if (!classCourse(scheme.course)) return undefined;
  const homework = list(r.homework).flatMap((h) => {
    const set = cleanSlot(record(h).set);
    const due = cleanSlot(record(h).due);
    return set && due ? [{ set, due }] : [];
  });
  return {
    id: typeof r.id === "string" && r.id ? r.id.slice(0, 20) : newId(),
    colour: int(r.colour, 0, COLOURS - 1, 0),
    slots: list(r.slots).flatMap((s) => cleanSlot(s) ?? []),
    homework,
    tests: list(r.tests).map((t) => {
      const lesson = int(t, 0, 999, -1);
      return lesson < 0 ? null : lesson;
    }),
    scheme,
  };
}

/**
 * Builds a workspace from untrusted data (local storage or a backup file), keeping what is valid:
 * a class whose scheme cannot be read is dropped, and bad settings fall back to the defaults.
 */
export function cleanWorkspace(data: unknown): Workspace | undefined {
  const r = record(data);
  if (r.format !== WORKSPACE_FORMAT) return undefined;
  const t = record(r.timetable);
  const timetable: Timetable = {
    weeks: int(t.weeks, 1, 2, 1) as 1 | 2,
    carryOn: typeof t.carryOn === "boolean" ? t.carryOn : DEFAULT_TIMETABLE.carryOn,
    firstWeek: int(t.firstWeek, 0, 1, 0) as 0 | 1,
    periods: int(t.periods, 1, MAX_PERIODS, DEFAULT_TIMETABLE.periods),
    lessonMinutes: int(t.lessonMinutes, MIN_MINUTES, MAX_MINUTES, DEFAULT_TIMETABLE.lessonMinutes),
  };
  const date = (v: unknown) => (typeof v === "string" && dayNumber(v) !== undefined ? v : "");
  const terms = Array.from({ length: TERM_COUNT }, (_, i) => {
    const term = record(list(r.terms)[i]);
    return { start: date(term.start), end: date(term.end) };
  });
  const classes = list(r.classes).flatMap((c) => cleanClass(c) ?? []);
  const ids = new Set<string>();
  for (const c of classes) {
    if (ids.has(c.id)) c.id = newId();
    ids.add(c.id);
  }
  return settle({ timetable, terms, classes });
}

/** The backup file: readable JSON, each class's scheme in the scheme file's own format. */
export function workspaceFile(ws: Workspace): string {
  return `${JSON.stringify(
    {
      format: WORKSPACE_FORMAT,
      version: 1,
      timetable: ws.timetable,
      terms: ws.terms,
      classes: ws.classes.map((c) => ({
        id: c.id,
        colour: c.colour,
        slots: c.slots,
        homework: c.homework,
        tests: c.tests,
        scheme: JSON.parse(schemeFile(c.scheme)) as unknown,
      })),
    },
    null,
    2,
  )}\n`;
}

/** Reads a backup file, or throws with a message a teacher can act on. */
export function readWorkspaceFile(contents: string): Workspace {
  let data: unknown;
  try {
    data = JSON.parse(contents);
  } catch {
    throw new Error("This file is not a MathsPlanner backup (it is not JSON).");
  }
  const ws = cleanWorkspace(data);
  if (!ws) throw new Error("This file is not a MathsPlanner backup.");
  return ws;
}

/** The workspace this browser keeps, if any; storage can be blocked, so failures are ignored. */
export function loadWorkspace(): Workspace | undefined {
  try {
    const text = window.localStorage.getItem(STORE);
    return text ? cleanWorkspace(JSON.parse(text)) : undefined;
  } catch {
    return undefined;
  }
}

/** Keeps the workspace in this browser; false if the browser refused (a private window, say). */
export function saveWorkspace(ws: Workspace): boolean {
  try {
    window.localStorage.setItem(STORE, workspaceFile(ws));
    return true;
  } catch {
    return false;
  }
}
