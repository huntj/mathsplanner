// Starting a scheme of work: choose the year group (and the course, from Year 10), then name the
// class and its lessons a week, then go on to choose topics for each half-term. A key stage or a
// whole two-year course can still be planned at once, and a downloaded scheme opened again.
import { useMemo, useState } from "react";
import type { Navigate } from "./SchemeDialogs.tsx";
import {
  COURSES,
  courseById,
  coursePool,
  defaultTitle,
  draftScheme,
  emptyScheme,
  formatScheme,
  inThisYear,
  MAX_CLASS,
  MAX_LESSONS,
  MAX_TITLE,
  parseScheme,
  QUALIFICATIONS,
  readSchemeFile,
  type Course,
  type Scheme,
} from "./scheme.ts";

const STORE = "mathsplanner:scheme";

/** The last scheme this browser edited, if any; storage can be blocked, so failures are ignored. */
export function stored(): Scheme | undefined {
  try {
    const hash = window.localStorage.getItem(STORE);
    return hash ? parseScheme(hash.split("?")[1] ?? "") : undefined;
  } catch {
    return undefined;
  }
}

export function remember(scheme: Scheme) {
  try {
    window.localStorage.setItem(STORE, formatScheme(scheme));
  } catch {
    // Private windows can refuse storage; the link still holds the scheme.
  }
}

/** Opens a downloaded scheme file chosen by the teacher. */
export function OpenFile({
  onOpen,
  onError,
}: {
  onOpen: (s: Scheme) => void;
  onError: (m: string) => void;
}) {
  return (
    <label className="file-button">
      <input
        type="file"
        accept=".json,application/json"
        className="visually-hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          try {
            onOpen(readSchemeFile(await file.text()));
          } catch (err) {
            onError(err instanceof Error ? err.message : String(err));
          }
        }}
      />
      Open a file
    </label>
  );
}

/** The year groups to choose from; from Year 10 a year has more than one course. */
const YEARS: { label: string; courses: string[] }[] = [
  { label: "Nursery", courses: ["N"] },
  { label: "Reception", courses: ["R"] },
  ...Array.from({ length: 9 }, (_, i) => ({ label: `Year ${i + 1}`, courses: [`Y${i + 1}`] })),
  ...[10, 11, 12, 13].map((year) => ({
    label: `Year ${year}`,
    courses: QUALIFICATIONS.filter((q) => q.first === year || q.first + 1 === year).map(
      (q) => `${q.id}${year}`,
    ),
  })),
];

const courseOf = (id: string) => courseById.get(id) ?? (COURSES[0] as Course);
/** "Year 10 GCSE Higher" → "GCSE Higher". */
const shortName = (course: Course) => course.name.replace(/^Year \d+ /, "");

export function SchemeStart({ navigate }: { navigate: Navigate }) {
  const [year, setYear] = useState<number>();
  const [courseId, setCourseId] = useState<string>();
  const [className, setClassName] = useState("");
  const [lessons, setLessons] = useState<number>();
  const [title, setTitle] = useState("");
  const [wholeCourse, setWholeCourse] = useState("KS3");
  const [error, setError] = useState("");
  const last = useMemo(stored, []);
  const open = (scheme: Scheme, guide?: number) =>
    navigate(guide === undefined ? { page: "scheme", scheme } : { page: "scheme", scheme, guide });

  const course = courseId ? courseOf(courseId) : undefined;
  const make = (build: typeof emptyScheme | typeof draftScheme) => {
    if (!course) return emptyScheme(courseOf("Y7"));
    const name = className.trim().slice(0, MAX_CLASS);
    const scheme = build(course, title.trim().slice(0, MAX_TITLE) || undefined, name);
    return { ...scheme, lessonsPerWeek: lessons ?? course.lessons };
  };
  const statements = course ? coursePool(course).filter((s) => inThisYear(course, s)).length : 0;

  return (
    <>
      <h1>Plan a scheme of work</h1>
      <p className="lede">
        Plan a class&apos;s year in half-terms: choose topics for each one, and MathsPlanner
        suggests the statements to teach, including what the class needs from earlier years. Each
        week gets homework that builds through the half-term. The scheme lives in its link: share
        it, or download it as a file. Nothing is stored on a server.
      </p>
      {last && (
        <p className="banner">
          This browser remembers <strong>{last.title}</strong>.{" "}
          <button type="button" className="link" onClick={() => open(last)}>
            Carry on with it
          </button>
        </p>
      )}

      <section className="start-step" aria-labelledby="step-year">
        <h2 id="step-year">
          <span className="step-number">1</span> Which year group?
        </h2>
        <div className="year-grid" role="group" aria-label="Year group">
          {YEARS.map((y, i) => (
            <button
              key={y.label}
              type="button"
              aria-pressed={year === i}
              onClick={() => {
                setYear(i);
                setCourseId(y.courses.length === 1 ? y.courses[0] : undefined);
                setLessons(undefined);
              }}
            >
              {y.label}
            </button>
          ))}
        </div>
        {year !== undefined && (YEARS[year]?.courses.length ?? 0) > 1 && (
          <div className="course-choice" role="group" aria-label="Course">
            {YEARS[year]?.courses.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={courseId === id}
                onClick={() => {
                  setCourseId(id);
                  setLessons(undefined);
                }}
              >
                {shortName(courseOf(id))}
              </button>
            ))}
          </div>
        )}
      </section>

      {course && (
        <section className="start-step" aria-labelledby="step-class">
          <h2 id="step-class">
            <span className="step-number">2</span> About the class
          </h2>
          <div className="controls">
            <label>
              Class name
              <input
                value={className}
                maxLength={MAX_CLASS}
                placeholder="e.g. 7X2"
                onChange={(e) => setClassName(e.target.value)}
              />
            </label>
            <label>
              Lessons a week
              <input
                type="number"
                min={1}
                max={MAX_LESSONS}
                value={lessons ?? course.lessons}
                onChange={(e) =>
                  setLessons(
                    Math.min(MAX_LESSONS, Math.max(1, Math.round(Number(e.target.value)) || 1)),
                  )
                }
              />
            </label>
            <label className="title-field">
              Title
              <input
                value={title}
                maxLength={MAX_TITLE}
                placeholder={defaultTitle(course, className.trim())}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <p className="muted small">
            The class name goes on the homework and tests. Use the class&apos;s name or code, not
            students&apos; names. {course.name} has {statements} statements.
          </p>
          <div className="session-buttons">
            <button type="button" className="primary" onClick={() => open(make(emptyScheme), 0)}>
              Choose topics for Autumn 1
            </button>
            <button type="button" onClick={() => open(make(draftScheme))}>
              Start from a draft of the whole year
            </button>
          </div>
        </section>
      )}

      <details className="start-more">
        <summary>Open a file, or plan a key stage or a two-year course</summary>
        <div className="session-buttons">
          <OpenFile onOpen={(s) => open(s)} onError={setError} />
        </div>
        <div className="controls">
          <label>
            Key stage or course
            <select value={wholeCourse} onChange={(e) => setWholeCourse(e.target.value)}>
              {COURSES.filter((c) => c.years.length > 1).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.years.length} years
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="session-buttons">
          <button type="button" onClick={() => open(draftScheme(courseOf(wholeCourse)))}>
            Start from a draft
          </button>
          <button type="button" onClick={() => open(emptyScheme(courseOf(wholeCourse)))}>
            Start empty
          </button>
        </div>
        <p className="muted small">
          A draft puts every statement in prerequisite order, split into its steps, and shares them
          across the half-terms by their weeks. Move things to suit your school.
        </p>
      </details>
      {error && <p className="banner error">{error}</p>}
    </>
  );
}
