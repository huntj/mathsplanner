// Setting up the classes: add each class taught (its name and year group, or course from Year
// 10), choose one, then click the periods it is taught in. A period belongs to one class; clicking
// one another class has moves it, and clicking it again frees it.
import { useState } from "react";
import type { Navigate } from "./SchemeDialogs.tsx";
import { courseById, defaultTitle, MAX_CLASS } from "./scheme.ts";
import { shortName, YEARS } from "./SchemeStart.tsx";
import { SetupProgress } from "./SetupProgress.tsx";
import { className, Swatch, TimetableGrid, WeekSwitch } from "./TimetableGrid.tsx";
import {
  addClass,
  classAt,
  lessonsInWeek,
  removeClass,
  setupProgress,
  slotName,
  toggleSlot,
  updateClass,
  type SchoolClass,
  type Workspace,
} from "./workspace.ts";

/** "3 lessons a week", or with two weeks "3 lessons in Week A, 4 in Week B". */
function lessonCount(ws: Workspace, cls: SchoolClass): string {
  const plural = (n: number) => `${n} lesson${n === 1 ? "" : "s"}`;
  const a = lessonsInWeek(cls, 0);
  if (ws.timetable.weeks === 1) return `${plural(a)} a week`;
  const b = lessonsInWeek(cls, 1);
  return a === b ? `${plural(a)} a week` : `${plural(a)} in Week A, ${b} in Week B`;
}

export function TimetableView({
  ws,
  save,
  navigate,
}: {
  ws: Workspace;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}) {
  const [selected, setSelected] = useState(ws.classes[0]?.id);
  const [adding, setAdding] = useState(ws.classes.length === 0);
  const [week, setWeek] = useState<0 | 1>(0);
  const cls = ws.classes.find((c) => c.id === selected);
  const progress = setupProgress(ws);

  const rename = (c: SchoolClass, name: string) => {
    const course = courseById.get(c.scheme.course);
    const old = c.scheme.title === (course && defaultTitle(course, c.scheme.className.trim()));
    const title = old && course ? defaultTitle(course, name.trim()) : c.scheme.title;
    save(updateClass(ws, c.id, (x) => ({ ...x, scheme: { ...x.scheme, className: name, title } })));
  };

  return (
    <div className="setup-page">
      <SetupProgress ws={ws} current="classes" />
      <h1>Your classes and timetable</h1>
      <p className="lede">
        Add each class you teach, then click the lessons in your timetable where you teach it.
      </p>

      <div className="class-list" role="group" aria-label="Your classes">
        {ws.classes.map((c) => (
          <button
            key={c.id}
            type="button"
            className="class-chip"
            aria-pressed={c.id === selected && !adding}
            onClick={() => {
              setSelected(c.id);
              setAdding(false);
            }}
          >
            <Swatch cls={c} />
            <span>
              <strong>{className(c)}</strong>
              <span className="small">{lessonCount(ws, c)}</span>
            </span>
          </button>
        ))}
        <button
          type="button"
          className="class-chip add"
          aria-pressed={adding}
          onClick={() => setAdding(true)}
        >
          + Add a class
        </button>
      </div>

      {adding ? (
        <AddClass
          first={ws.classes.length === 0}
          onAdd={(course, name) => {
            const next = addClass(ws, course, name);
            save(next);
            setSelected(next.classes.at(-1)?.id);
            setAdding(false);
          }}
          onCancel={ws.classes.length ? () => setAdding(false) : undefined}
        />
      ) : (
        cls && (
          <div className="class-panel">
            <p className="banner">
              <Swatch cls={cls} /> Click the lessons you teach <strong>{className(cls)}</strong>.
              Click a lesson again to take it away.
            </p>
            <div className="controls">
              <label>
                Class name
                <input
                  value={cls.scheme.className}
                  maxLength={MAX_CLASS}
                  onChange={(e) => rename(cls, e.target.value)}
                  onBlur={() => rename(cls, cls.scheme.className.trim())}
                />
              </label>
              <span className="muted small">{courseById.get(cls.scheme.course)?.name}</span>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `Remove ${className(cls)}? Its lessons and scheme of work will be deleted.`,
                    )
                  ) {
                    const next = removeClass(ws, cls.id);
                    save(next);
                    setSelected(next.classes[0]?.id);
                    setAdding(next.classes.length === 0);
                  }
                }}
              >
                Remove this class
              </button>
            </div>
          </div>
        )
      )}

      <WeekSwitch timetable={ws.timetable} week={week} onChange={setWeek} />
      <TimetableGrid
        timetable={ws.timetable}
        week={week}
        label={ws.timetable.weeks === 2 ? `Timetable, Week ${"AB"[week]}` : "Timetable"}
        cell={(slot) => {
          const owner = classAt(ws, slot);
          const mine = !!cls && owner?.id === cls.id;
          const label = `${slotName(ws.timetable, slot)}: ${owner ? className(owner) : "free"}`;
          return (
            <button
              type="button"
              className={`slot${owner ? ` taken class-c${owner.colour}` : ""}`}
              aria-pressed={mine}
              aria-label={label}
              title={
                owner && !mine && cls ? `${label}. Click to give it to ${className(cls)}.` : label
              }
              disabled={!cls || adding}
              onClick={() => cls && save(toggleSlot(ws, cls.id, slot))}
            >
              {owner ? className(owner) : <span aria-hidden="true">+</span>}
            </button>
          );
        }}
      />

      <div className="welcome-nav">
        <button type="button" onClick={() => navigate({ page: "welcome", step: 1 })}>
          ← Timetable settings
        </button>
        <button
          type="button"
          className="primary big"
          disabled={!progress.classes}
          onClick={() => navigate({ page: "homework" })}
        >
          Next: homework →
        </button>
      </div>
      {!progress.classes && ws.classes.length > 0 && (
        <p className="muted small">Give a class at least one lesson to go on.</p>
      )}
    </div>
  );
}

/** Adding a class: its name, then its year group, and from Year 10 its course. */
function AddClass({
  first,
  onAdd,
  onCancel,
}: {
  first: boolean;
  onAdd: (course: string, name: string) => void;
  onCancel: (() => void) | undefined;
}) {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number>();
  const [course, setCourse] = useState<string>();
  const courses = year === undefined ? [] : (YEARS[year]?.courses ?? []);
  return (
    <form
      className="add-class"
      onSubmit={(e) => {
        e.preventDefault();
        if (course && name.trim()) onAdd(course, name);
      }}
    >
      <h2>{first ? "Add your first class" : "Add a class"}</h2>
      <label>
        What do you call the class?
        <input
          value={name}
          maxLength={MAX_CLASS}
          placeholder="e.g. 7X2"
          autoFocus
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <p className="muted small">
        Use the class&apos;s name or code, not students&apos; names. It goes on its homework and
        tests.
      </p>
      <fieldset className="plain">
        <legend>Which year group?</legend>
        <div className="year-grid">
          {YEARS.map((y, i) => (
            <button
              key={y.label}
              type="button"
              aria-pressed={year === i}
              onClick={() => {
                setYear(i);
                setCourse(y.courses.length === 1 ? y.courses[0] : undefined);
              }}
            >
              {y.label}
            </button>
          ))}
        </div>
      </fieldset>
      {courses.length > 1 && (
        <fieldset className="plain">
          <legend>Which course?</legend>
          <div className="course-choice">
            {courses.map((id) => {
              const c = courseById.get(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={course === id}
                  onClick={() => setCourse(id)}
                >
                  {c ? shortName(c) : id}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      <div className="session-buttons">
        <button type="submit" className="primary" disabled={!course || !name.trim()}>
          Add class
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
