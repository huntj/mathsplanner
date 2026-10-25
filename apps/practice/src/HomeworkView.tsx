// Choosing when each class's homework is set and handed in: a lesson to set it in each week of
// the timetable, and the lesson it comes back in (by default about a week later). Each week's
// homework is the one its scheme makes from what was taught that week.
import type { Navigate } from "./SchemeDialogs.tsx";
import { SetupProgress } from "./SetupProgress.tsx";
import { className, Swatch } from "./TimetableGrid.tsx";
import {
  classLessons,
  defaultDue,
  homeworkDates,
  longDate,
  setupProgress,
  slotName,
  today,
  updateClass,
  WEEK_NAMES,
  type SchoolClass,
  type Slot,
  type Workspace,
} from "./workspace.ts";

const same = (a: Slot, b: Slot) => a.week === b.week && a.day === b.day && a.period === b.period;
const bySlot = (a: Slot, b: Slot) => a.week - b.week || a.day - b.day || a.period - b.period;

export function HomeworkView({
  ws,
  save,
  navigate,
}: {
  ws: Workspace;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}) {
  const taught = ws.classes.filter((c) => c.slots.length > 0);
  const untaught = ws.classes.filter((c) => c.slots.length === 0);
  const progress = setupProgress(ws);
  return (
    <div className="setup-page">
      <SetupProgress ws={ws} current="homework" />
      <h1>When do you set homework?</h1>
      <p className="lede">
        For each class, choose the lesson you set homework in each week, and the lesson it&apos;s
        handed in. Each week&apos;s homework practises what the class learned that week, with
        questions on earlier weeks to keep it fresh.
      </p>
      {taught.map((cls) => (
        <ClassHomework
          key={cls.id}
          ws={ws}
          cls={cls}
          update={(change) => save(updateClass(ws, cls.id, change))}
        />
      ))}
      {untaught.length > 0 && (
        <p className="muted">
          {untaught.map(className).join(", ")} {untaught.length === 1 ? "has" : "have"} no lessons
          yet. <a href="#/timetable">Add them to your timetable</a> to choose homework.
        </p>
      )}
      <div className="welcome-nav">
        <button type="button" onClick={() => navigate({ page: "timetable" })}>
          ← Classes
        </button>
        <button
          type="button"
          className="primary big"
          disabled={!progress.homework}
          onClick={() => navigate({ page: "home" })}
        >
          Next: plan your lessons →
        </button>
      </div>
      {!progress.homework && (
        <p className="muted small">
          Choose a homework lesson for every class, or tick &ldquo;No homework&rdquo;, to go on.
        </p>
      )}
    </div>
  );
}

function ClassHomework({
  ws,
  cls,
  update,
}: {
  ws: Workspace;
  cls: SchoolClass;
  update: (change: (c: SchoolClass) => SchoolClass) => void;
}) {
  const tt = ws.timetable;
  const slots = [...cls.slots].sort(bySlot);
  const weeks = Array.from({ length: tt.weeks }, (_, w) => w as 0 | 1).filter((w) =>
    slots.some((s) => s.week === w),
  );
  const next = homeworkDates(classLessons(ws, cls), cls).find((h) => h.set.date >= today());
  const choose = (week: 0 | 1, set: Slot | undefined) =>
    update((c) => ({
      ...c,
      noHomework: false,
      homework: [
        ...c.homework.filter((h) => h.set.week !== week),
        ...(set ? [{ set, due: defaultDue(tt, c, set) }] : []),
      ],
    }));
  const setDue = (set: Slot, due: Slot) =>
    update((c) => ({
      ...c,
      homework: c.homework.map((h) => (same(h.set, set) ? { set, due } : h)),
    }));

  return (
    <section className="homework-class" aria-label={className(cls)}>
      <h2>
        <Swatch cls={cls} /> {className(cls)}
      </h2>
      <label className="check">
        <input
          type="checkbox"
          checked={cls.noHomework}
          onChange={(e) => update((c) => ({ ...c, noHomework: e.target.checked, homework: [] }))}
        />
        No homework for this class
      </label>
      {!cls.noHomework &&
        weeks.map((week) => {
          const hw = cls.homework.find((h) => h.set.week === week);
          const own = slots.filter((s) => s.week === week);
          const prefix = tt.weeks === 2 ? `${WEEK_NAMES[week]}: ` : "";
          return (
            <div key={week} className="homework-week">
              <fieldset className="plain">
                <legend>{prefix}set homework in</legend>
                <div className="lesson-choices">
                  {own.map((s) => (
                    <button
                      key={slotName(tt, s)}
                      type="button"
                      aria-pressed={!!hw && same(hw.set, s)}
                      aria-label={slotName(tt, s)}
                      onClick={() => choose(week, s)}
                    >
                      {slotName(tt, s, true)}
                    </button>
                  ))}
                  {tt.weeks === 2 && (
                    <button
                      type="button"
                      aria-pressed={!hw}
                      onClick={() => choose(week, undefined)}
                    >
                      None in {WEEK_NAMES[week]}
                    </button>
                  )}
                </div>
              </fieldset>
              {hw && (
                <fieldset className="plain">
                  <legend>and hand it in at the next</legend>
                  <div className="lesson-choices">
                    {slots.map((s) => (
                      <button
                        key={slotName(tt, s)}
                        type="button"
                        aria-pressed={same(hw.due, s)}
                        aria-label={slotName(tt, s)}
                        onClick={() => setDue(hw.set, s)}
                      >
                        {slotName(tt, s, true)}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
              {hw && (
                <p className="small">
                  Set in {slotName(tt, hw.set)}, handed in at the next {slotName(tt, hw.due)}.
                </p>
              )}
            </div>
          );
        })}
      {next && (
        <p className="banner small">
          Next homework: set on {longDate(next.set.date)}
          {next.due ? `, handed in on ${longDate(next.due.date)}` : ""}.
        </p>
      )}
    </section>
  );
}
