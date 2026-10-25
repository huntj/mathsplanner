// A class's plan, from the year down to the lesson. The year shows each half-term with its dates,
// topics and how full it is (and, with nothing planned, how to start: topics a half-term at a
// time, a draft of the year, or another class's plan). A half-term shows its weeks and every
// dated lesson with what it teaches, the homework set and due, and the half-term test, whose
// lesson can be moved. Each item's lessons can be changed here; topics are chosen in the guided
// set-up, and the full editor changes the order.
import type { Navigate } from "./SchemeDialogs.tsx";
import {
  courseById,
  lessonSlots,
  MAX_LESSONS,
  setLessons,
  TERMS,
  weekPlan,
  type Scheme,
} from "./scheme.ts";
import { statementById } from "./session.ts";
import { className, Swatch } from "./TimetableGrid.tsx";
import { mainTopic, topicById } from "./topics.ts";
import {
  classLessons,
  copyPlan,
  draftFor,
  homeworkDates,
  longDate,
  shortDate,
  teachingWeeks,
  testLessons,
  today,
  updateClass,
  WEEK_NAMES,
  weekFor,
  whereWeAre,
  type Lesson,
  type SchoolClass,
  type Workspace,
} from "./workspace.ts";

interface Props {
  ws: Workspace;
  cls: SchoolClass;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}

/** The topics of a half-term's items, in the order first taught. */
const topicsIn = (scheme: Scheme, term: number) => [
  ...new Set(
    (scheme.halfTerms[term]?.items ?? []).map(
      (id) => topicById.get(mainTopic(id) ?? "")?.name ?? "Other",
    ),
  ),
];

/** The half-term the year is in now, if any. */
function termNow(ws: Workspace): number | undefined {
  const weeks = teachingWeeks(ws);
  return weeks[weekFor(weeks, today()) ?? -1]?.term;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function ClassYear({ ws, cls, save, navigate }: Props) {
  const scheme = cls.scheme;
  const course = courseById.get(scheme.course);
  const lessons = classLessons(ws, cls);
  const tests = testLessons(lessons, cls);
  const now = termNow(ws);
  const empty = scheme.halfTerms.every((h) => h.items.length === 0);
  const others = ws.classes.filter(
    (c) =>
      c.id !== cls.id &&
      c.scheme.course === scheme.course &&
      c.scheme.halfTerms.some((h) => h.items.length > 0),
  );
  const change = (next: Scheme) => save(updateClass(ws, cls.id, (c) => ({ ...c, scheme: next })));

  return (
    <div className="class-plan">
      <p className="breadcrumb">
        <a href="#/">Home</a> / {className(cls)}
      </p>
      <h1>
        <Swatch cls={cls} /> {className(cls)}: scheme of work
      </h1>
      <p className="lede">
        {course?.name} · {plural(lessons.length, "lesson")} this year. {whereWeAre(ws, today())}
      </p>

      {empty && (
        <section className="next-step">
          <h2>How would you like to start?</h2>
          <div className="choice-cards">
            <button
              type="button"
              className="choice-card"
              onClick={() => navigate({ page: "class", id: cls.id, guide: now ?? 0 })}
            >
              <strong>Choose topics, a half-term at a time</strong>
              <span>
                Pick the topics, and MathsPlanner suggests the learning objectives, including what
                the class needs from earlier years.
              </span>
            </button>
            <button type="button" className="choice-card" onClick={() => change(draftFor(scheme))}>
              <strong>Start from a draft of the year</strong>
              <span>
                Every learning objective for {course?.name}, in a sensible order, shared across the
                half-terms. Then change it to suit your school.
              </span>
            </button>
            {others.map((o) => (
              <button
                key={o.id}
                type="button"
                className="choice-card"
                onClick={() => change(copyPlan(scheme, o.scheme))}
              >
                <strong>Copy {className(o)}&apos;s plan</strong>
                <span>
                  Start from the plan you made for {className(o)}, and change it from there.
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="term-grid">
        {scheme.halfTerms.map((h, term) => {
          const plan = weekPlan(scheme, term);
          const topics = topicsIn(scheme, term);
          const dates = ws.terms[term];
          const over = plan.lessons - plan.capacity;
          return (
            <section
              key={term}
              className={`term-card${term === now ? " now" : ""}`}
              aria-label={TERMS[term]}
            >
              <header>
                <h2>{TERMS[term]}</h2>
                {term === now && <span className="badge now">Now</span>}
              </header>
              <p className="small muted">
                {dates && `${shortDate(dates.start)} to ${shortDate(dates.end)} · `}
                {plural(h.weeks, "week")} · {plural(plan.capacity, "lesson")}
              </p>
              {topics.length ? (
                <ul className="topic-tags">
                  {topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">Nothing planned yet.</p>
              )}
              <progress
                className="lesson-bar"
                max={Math.max(plan.capacity, plan.lessons, 1)}
                value={plan.lessons}
                aria-label={`${TERMS[term]}: lessons planned`}
              />
              <p className="small">
                {plan.lessons} of {plan.capacity} lessons planned
                {over > 0 && <span className="warn-count"> · ⚠ {over} too many</span>}
                {tests[term] && <> · Test {shortDate(tests[term].date, true)}</>}
              </p>
              <div className="buttons">
                <button
                  type="button"
                  className={h.items.length ? "primary" : undefined}
                  onClick={() => navigate({ page: "class", id: cls.id, term })}
                >
                  Lessons
                </button>
                <button
                  type="button"
                  className={h.items.length ? undefined : "primary"}
                  onClick={() => navigate({ page: "class", id: cls.id, guide: term })}
                >
                  Choose topics
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <p className="muted small">
        To move learning objectives between half-terms, change their order, or get each
        half-term&apos;s homework links and tests,{" "}
        <button
          type="button"
          className="link"
          onClick={() => navigate({ page: "class", id: cls.id, edit: true })}
        >
          open the full editor
        </button>
        .
      </p>
    </div>
  );
}

export function ClassTerm({ ws, cls, term, save, navigate }: Props & { term: number }) {
  const scheme = cls.scheme;
  const weeks = teachingWeeks(ws).filter((w) => w.term === term);
  const lessons = classLessons(ws, cls);
  const own = lessons.filter((l) => l.term === term);
  const slots = lessonSlots(scheme, term);
  const plan = weekPlan(scheme, term);
  const test = testLessons(lessons, cls)[term];
  const homework = homeworkDates(lessons, cls);
  const dates = ws.terms[term];
  const date = today();
  const allWeeks = teachingWeeks(ws);
  const thisMonday = allWeeks[weekFor(allWeeks, date) ?? -1]?.monday;
  const two = ws.timetable.weeks === 2;
  const at = (a: Lesson, b: Lesson | undefined) =>
    !!b && a.date === b.date && a.period === b.period;
  const change = (next: SchoolClass) => save(updateClass(ws, cls.id, () => next));
  const overflow = slots.slice(own.length);

  return (
    <div className="class-plan">
      <p className="breadcrumb">
        <a href="#/">Home</a> /{" "}
        <button
          type="button"
          className="link"
          onClick={() => navigate({ page: "class", id: cls.id })}
        >
          {className(cls)}
        </button>{" "}
        / {TERMS[term]}
      </p>
      <h1>
        <Swatch cls={cls} /> {className(cls)}: {TERMS[term]}
      </h1>
      <p className="lede">
        {dates && `${longDate(dates.start)} to ${longDate(dates.end)} · `}
        {plural(weeks.length, "week")} · {plural(own.length, "lesson")} ·{" "}
        <strong>{Math.min(plan.lessons, own.length)} planned</strong>
      </p>
      <nav className="term-steps" aria-label="Half-terms">
        {TERMS.map((name, t) => (
          <button
            key={name}
            type="button"
            aria-current={t === term ? "step" : undefined}
            onClick={() => navigate({ page: "class", id: cls.id, term: t })}
          >
            {name}
          </button>
        ))}
      </nav>
      <div className="controls">
        <button
          type="button"
          className="primary"
          onClick={() => navigate({ page: "class", id: cls.id, guide: term })}
        >
          Choose topics
        </button>
        {own.length > 0 && (
          <label>
            Half-term test
            <select
              value={test?.index ?? ""}
              onChange={(e) =>
                change({
                  ...cls,
                  tests: cls.tests.map((x, t) => (t === term ? Number(e.target.value) : x)),
                })
              }
            >
              {own.map((l) => (
                <option key={l.index} value={l.index}>
                  {shortDate(l.date, true)}, period {l.period + 1}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {own.length === 0 && (
        <p className="banner">
          {className(cls)} has no lessons in {TERMS[term]}.{" "}
          <a href="#/timetable">Check the timetable</a> and the half-term dates.
        </p>
      )}
      {weeks.map((w) => {
        const inWeek = own.filter((l) => l.week === w.week);
        const first = inWeek[0]?.date ?? w.monday;
        const isNow = w.monday === thisMonday;
        return (
          <section key={w.week} className={`week-block${isNow ? " now" : ""}`}>
            <h2>
              Week {w.week + 1}
              <span className="muted">
                {" "}
                · {shortDate(first, true)}
                {two ? ` · ${WEEK_NAMES[w.label]}` : ""}
              </span>
              {isNow && (
                <span className="badge now">{date < w.monday ? "Up next" : "This week"}</span>
              )}
            </h2>
            {inWeek.length === 0 ? (
              <p className="muted small">No lessons with {className(cls)} this week.</p>
            ) : (
              <ol className="lesson-list">
                {inWeek.map((l) => {
                  const slot = slots[l.index];
                  const text = slot ? statementById.get(slot.objective)?.text : undefined;
                  const topic = slot && topicById.get(mainTopic(slot.item) ?? "")?.name;
                  const set = homework.find((h) => at(l, h.set));
                  const due = homework.find((h) => at(l, h.due));
                  return (
                    <li key={l.index} className={l.date === date ? "today" : undefined}>
                      <span className="lesson-when">
                        <strong>{shortDate(l.date, true)}</strong>
                        <span className="muted">Period {l.period + 1}</span>
                      </span>
                      <span className="lesson-what">
                        {slot ? (
                          <>
                            <span>{text}</span>
                            <span className="muted small">
                              {topic}
                              {slot.parts > 1 &&
                                ` · ${slot.stepped ? "step" : "lesson"} ${slot.part + 1} of ${slot.parts}`}
                            </span>
                          </>
                        ) : (
                          <span className="muted">Nothing planned</span>
                        )}
                        <span className="lesson-tags">
                          {at(l, test) && <span className="badge test">Half-term test</span>}
                          {due && <span className="badge">Homework due</span>}
                          {set && <span className="badge">Homework set</span>}
                        </span>
                      </span>
                      {slot && slot.part === 0 && (
                        <LessonCount
                          scheme={scheme}
                          item={slot.item}
                          parts={slot.parts}
                          onChange={(next) => change({ ...cls, scheme: next })}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        );
      })}

      {overflow.length > 0 && (
        <section className="banner warning">
          <p>
            <strong>
              {plural(overflow.length, "lesson")} more than {TERMS[term]} has.
            </strong>{" "}
            Give some learning objectives fewer lessons, or move them to another half-term in the{" "}
            <button
              type="button"
              className="link"
              onClick={() => navigate({ page: "class", id: cls.id, edit: true })}
            >
              full editor
            </button>
            :
          </p>
          <ul className="small">
            {[...new Set(overflow.map((s) => s.item))].map((id) => (
              <li key={id}>{statementById.get(id)?.text}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="session-buttons guide-nav">
        <button
          type="button"
          disabled={term === 0}
          onClick={() => navigate({ page: "class", id: cls.id, term: term - 1 })}
        >
          ← {TERMS[term - 1] ?? "Previous"}
        </button>
        {term < TERMS.length - 1 && (
          <button
            type="button"
            onClick={() => navigate({ page: "class", id: cls.id, term: term + 1 })}
          >
            {TERMS[term + 1]} →
          </button>
        )}
        <button type="button" onClick={() => navigate({ page: "class", id: cls.id })}>
          The whole year
        </button>
      </div>
    </div>
  );
}

/**
 * How many lessons a learning objective takes. One taught a step a lesson takes one lesson per
 * step; giving it another number teaches it as a whole over those lessons.
 */
function LessonCount({
  scheme,
  item,
  parts,
  onChange,
}: {
  scheme: Scheme;
  item: string;
  parts: number;
  onChange: (s: Scheme) => void;
}) {
  const text = statementById.get(item)?.text ?? item;
  return (
    <span className="lesson-count" role="group" aria-label={`Lessons for ${text}`}>
      <button
        type="button"
        aria-label="One lesson fewer"
        disabled={parts <= 1}
        onClick={() => onChange(setLessons(scheme, item, parts - 1))}
      >
        −
      </button>
      <span>{plural(parts, "lesson")}</span>
      <button
        type="button"
        aria-label="One lesson more"
        disabled={parts >= MAX_LESSONS}
        onClick={() => onChange(setLessons(scheme, item, parts + 1))}
      >
        +
      </button>
    </span>
  );
}
