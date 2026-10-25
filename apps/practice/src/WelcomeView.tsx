// The first visit: what MathsPlanner does, then the timetable a question at a time: one week or
// two, lessons a day, lesson length and the half-term dates, and with two weeks, which week this
// one is. The answers are a draft (kept for this tab, so a reload does not lose them) until the
// last step saves them and goes on to the classes. Opened again later, it changes the settings.
import { useState, type ReactNode } from "react";
import type { Navigate } from "./SchemeDialogs.tsx";
import { TERMS } from "./scheme.ts";
import { SetupProgress } from "./SetupProgress.tsx";
import {
  dayNumber,
  emptyWorkspace,
  longDate,
  MAX_MINUTES,
  MAX_PERIODS,
  MIN_MINUTES,
  readWorkspaceFile,
  settle,
  startWeekFor,
  suggestedTerms,
  teachingWeeks,
  termProblems,
  today,
  WEEK_NAMES,
  weekFor,
  whereWeAre,
  type HalfTermDates,
  type Timetable,
  type Workspace,
} from "./workspace.ts";

const DRAFT = "mathsplanner:welcome";

type Draft = Pick<Workspace, "timetable" | "terms">;

function storedDraft(): Draft | undefined {
  try {
    const text = window.sessionStorage.getItem(DRAFT);
    return text ? (JSON.parse(text) as Draft) : undefined;
  } catch {
    return undefined;
  }
}

function keepDraft(draft: Draft | undefined) {
  try {
    if (draft) window.sessionStorage.setItem(DRAFT, JSON.stringify(draft));
    else window.sessionStorage.removeItem(DRAFT);
  } catch {
    // Without storage, a reload starts the questions again; nothing else is lost.
  }
}

type Step = "welcome" | "weeks" | "periods" | "minutes" | "dates" | "this-week" | "done";

export function WelcomeView({
  ws,
  step,
  save,
  navigate,
}: {
  ws: Workspace | undefined;
  step: number;
  save: (ws: Workspace) => void;
  navigate: Navigate;
}) {
  const [draft, setDraft] = useState<Draft>(() => {
    const kept = storedDraft();
    // A draft from an unfinished first visit; otherwise the saved settings or the defaults.
    if (kept && !ws) return { ...emptyWorkspace(), ...kept };
    const from = ws ?? emptyWorkspace();
    return { timetable: from.timetable, terms: from.terms };
  });
  const [error, setError] = useState("");
  const change = (next: Draft) => {
    setDraft(next);
    if (!ws) keepDraft(next);
  };
  const setTimetable = (t: Partial<Timetable>) =>
    change({ ...draft, timetable: { ...draft.timetable, ...t } });

  const steps: Step[] = [
    "welcome",
    "weeks",
    "periods",
    "minutes",
    "dates",
    ...(draft.timetable.weeks === 2 ? (["this-week"] as const) : []),
    "done",
  ];
  const at = Math.min(Math.max(0, step), steps.length - 1);
  const go = (i: number) => navigate({ page: "welcome", step: i });
  const stepOf = (s: Step) => steps.indexOf(s);
  const problems = termProblems(draft.terms, TERMS);
  const full: Workspace = settle({ ...draft, classes: ws?.classes ?? [] });

  const finish = () => {
    save(full);
    keepDraft(undefined);
    navigate({ page: ws?.classes.length ? "home" : "timetable" });
  };

  const nav = (next: ReactNode = undefined, disabled = false) => (
    <div className="welcome-nav">
      {at > 1 && (
        <button type="button" onClick={() => go(at - 1)}>
          ← Back
        </button>
      )}
      {next ?? (
        <button type="button" className="primary" disabled={disabled} onClick={() => go(at + 1)}>
          Next →
        </button>
      )}
    </div>
  );
  const question = (n: number) => (
    <p className="welcome-count">
      Question {n} of {steps.length - 2}
    </p>
  );

  const body = (() => {
    switch (steps[at]) {
      case "welcome":
        return (
          <>
            <h1>Welcome to MathsPlanner</h1>
            <p className="lede">
              Plan your maths lessons, homework and tests around your own timetable, with questions
              ready for every lesson.
            </p>
            <p>Setting up takes about five minutes:</p>
            <ol className="welcome-list">
              <li>Tell us about your school&apos;s timetable and term dates.</li>
              <li>Add your classes, and click the lessons you teach them.</li>
              <li>Choose the lessons homework is set and handed in.</li>
              <li>Plan what each class learns, from the whole year down to each lesson.</li>
            </ol>
            <p className="muted">
              Everything is kept in this browser, on this computer. Nothing is sent anywhere, and
              you don&apos;t need any students&apos; names. You can download a backup to use on
              another computer.
            </p>
            <div className="welcome-nav">
              <button type="button" className="primary big" onClick={() => go(1)}>
                {ws ? "Change your timetable settings" : "Get started"}
              </button>
              {!ws && (
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
                        save(readWorkspaceFile(await file.text()));
                        keepDraft(undefined);
                        navigate({ page: "home" });
                      } catch (err) {
                        setError(err instanceof Error ? err.message : String(err));
                      }
                    }}
                  />
                  Open a backup
                </label>
              )}
            </div>
            {error && <p className="banner error">{error}</p>}
            <p className="small">
              <a href="#/practice">Or just make some questions</a>, without setting anything up.
            </p>
          </>
        );

      case "weeks":
        return (
          <>
            {question(1)}
            <h1>Does your timetable repeat every week, or every two weeks?</h1>
            <div className="choice-cards">
              <Choice
                on={draft.timetable.weeks === 1}
                title="Every week"
                text="The same lessons each week."
                onClick={() => setTimetable({ weeks: 1 })}
              />
              <Choice
                on={draft.timetable.weeks === 2}
                title="Every two weeks"
                text="A Week A and a Week B."
                onClick={() => setTimetable({ weeks: 2 })}
              />
            </div>
            {draft.timetable.weeks === 2 && (
              <>
                <h2>After a holiday, which week do you go back to?</h2>
                <div className="choice-cards">
                  <Choice
                    on={draft.timetable.carryOn}
                    title="The next week in turn"
                    text="If you broke up on Week A, you come back on Week B."
                    onClick={() => setTimetable({ carryOn: true })}
                  />
                  <Choice
                    on={!draft.timetable.carryOn}
                    title="Always the same week"
                    text="Every half-term starts again on the same week."
                    onClick={() => setTimetable({ carryOn: false })}
                  />
                </div>
              </>
            )}
            {nav()}
          </>
        );

      case "periods":
        return (
          <>
            {question(2)}
            <h1>How many lessons are there in a school day?</h1>
            <p className="lede">Count the teaching periods, not registration, break or lunch.</p>
            <Stepper
              value={draft.timetable.periods}
              min={1}
              max={MAX_PERIODS}
              label="Lessons a day"
              onChange={(periods) => setTimetable({ periods })}
            />
            <ol className="day-preview" aria-hidden="true">
              {Array.from({ length: draft.timetable.periods }, (_, i) => (
                <li key={i}>Period {i + 1}</li>
              ))}
            </ol>
            {nav()}
          </>
        );

      case "minutes":
        return (
          <>
            {question(3)}
            <h1>How long is a lesson?</h1>
            <p className="lede">
              In minutes. This only changes how big lessons look on your timetable. It doesn&apos;t
              change what you plan.
            </p>
            <div className="minute-choices" role="group" aria-label="Lesson length">
              {[45, 50, 55, 60, 75, 100].map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={draft.timetable.lessonMinutes === m}
                  onClick={() => setTimetable({ lessonMinutes: m })}
                >
                  {m} minutes
                </button>
              ))}
            </div>
            <label className="inline-field">
              Or another length
              <span>
                <input
                  type="number"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  value={draft.timetable.lessonMinutes}
                  onChange={(e) => {
                    const n = Math.round(Number(e.target.value));
                    if (n >= MIN_MINUTES && n <= MAX_MINUTES) setTimetable({ lessonMinutes: n });
                  }}
                />{" "}
                minutes
              </span>
            </label>
            {nav()}
          </>
        );

      case "dates":
        return (
          <>
            {question(4)}
            <h1>When are your half-terms?</h1>
            <p className="lede">
              Give the first and last day of teaching in each half-term. We&apos;ve filled in
              typical dates to start you off: change them to your school&apos;s.
            </p>
            <TermDates terms={draft.terms} onChange={(terms) => change({ ...draft, terms })} />
            {problems.length > 0 && (
              <ul className="banner warning problems">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            {nav(undefined, problems.length > 0)}
          </>
        );

      case "this-week":
        return (
          <>
            {question(5)}
            <ThisWeek draft={full} onChange={(firstWeek) => setTimetable({ firstWeek })} />
            {nav()}
          </>
        );

      default:
        return (
          <>
            <h1>{ws ? "Your timetable settings" : "Your timetable is set up"}</h1>
            <p className="lede">{whereWeAre(full, today())}</p>
            <dl className="summary">
              <SummaryRow name="Timetable" onChange={() => go(stepOf("weeks"))}>
                {draft.timetable.weeks === 1
                  ? "Repeats every week"
                  : `Repeats every two weeks; after a holiday, ${
                      draft.timetable.carryOn ? "the next week in turn" : "the same week again"
                    }`}
              </SummaryRow>
              <SummaryRow name="Lessons a day" onChange={() => go(stepOf("periods"))}>
                {draft.timetable.periods}
              </SummaryRow>
              <SummaryRow name="Lesson length" onChange={() => go(stepOf("minutes"))}>
                {draft.timetable.lessonMinutes} minutes
              </SummaryRow>
              <SummaryRow name="Half-terms" onChange={() => go(stepOf("dates"))}>
                <ul className="term-summary">
                  {draft.terms.map((t, i) => (
                    <li key={TERMS[i]}>
                      <strong>{TERMS[i]}</strong>: {longDate(t.start)} to {longDate(t.end, true)}
                    </li>
                  ))}
                </ul>
              </SummaryRow>
            </dl>
            {problems.length > 0 && (
              <p className="banner warning">Some half-term dates need fixing first.</p>
            )}
            {nav(
              <button
                type="button"
                className="primary big"
                disabled={problems.length > 0}
                onClick={finish}
              >
                {ws ? "Save changes" : "Save, and add your classes →"}
              </button>,
            )}
          </>
        );
    }
  })();

  return (
    <div className="welcome">
      {at > 0 && <SetupProgress ws={ws} current="timetable" />}
      {body}
    </div>
  );
}

function Choice({
  on,
  title,
  text,
  onClick,
}: {
  on: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="choice-card" aria-pressed={on} onClick={onClick}>
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

function Stepper({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="One fewer"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        aria-label="One more"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

/** The six half-terms' dates, each with its number of weeks, and typical dates to start from. */
function TermDates({
  terms,
  onChange,
}: {
  terms: HalfTermDates[];
  onChange: (terms: HalfTermDates[]) => void;
}) {
  const weeks = teachingWeeks(settle({ ...emptyWorkspace(), terms }));
  const thisYear = Number(today().slice(0, 4)) - (Number(today().slice(5, 7)) < 8 ? 1 : 0);
  const set = (i: number, key: keyof HalfTermDates, value: string) =>
    onChange(terms.map((t, j) => (j === i ? { ...t, [key]: value } : t)));
  return (
    <>
      <table className="term-dates">
        <thead>
          <tr>
            <th scope="col">Half-term</th>
            <th scope="col">First day</th>
            <th scope="col">Last day</th>
            <th scope="col">Weeks</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((t, i) => {
            const n = weeks.filter((w) => w.term === i).length;
            return (
              <tr key={TERMS[i]}>
                <th scope="row">{TERMS[i]}</th>
                <td>
                  <input
                    type="date"
                    value={t.start}
                    aria-label={`${TERMS[i]} first day`}
                    onChange={(e) => set(i, "start", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={t.end}
                    aria-label={`${TERMS[i]} last day`}
                    onChange={(e) => set(i, "end", e.target.value)}
                  />
                </td>
                <td>{n || "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="small">
        Fill in typical dates for{" "}
        {[thisYear, thisYear + 1].map((y, i) => (
          <span key={y}>
            {i > 0 && " or "}
            <button
              type="button"
              className="link"
              onClick={() => onChange(suggestedTerms(`${y}-09-01`))}
            >
              {y} to {y + 1}
            </button>
          </span>
        ))}
        .
      </p>
    </>
  );
}

/**
 * Which week this one is, for a two-week timetable: asked of this week, or in a holiday of the
 * first week back, and saved as the week the year starts on.
 */
function ThisWeek({ draft, onChange }: { draft: Workspace; onChange: (first: 0 | 1) => void }) {
  const weeks = teachingWeeks(draft);
  const date = today();
  const i = weekFor(weeks, date) ?? 0;
  const week = weeks[i];
  const monday = dayNumber(week?.monday ?? "") ?? 0;
  const current = (dayNumber(date) ?? 0) >= monday;
  const whichWeek = current
    ? "this week"
    : i === 0
      ? `the first week of the year (from ${longDate(week?.monday ?? "")})`
      : `the week of ${longDate(week?.monday ?? "")}`;
  return (
    <>
      <h1>Is {whichWeek} Week A or Week B?</h1>
      <p className="lede">From this, MathsPlanner works out the week for every date in the year.</p>
      <div className="choice-cards">
        {WEEK_NAMES.map((name, label) => (
          <Choice
            key={name}
            on={week?.label === label}
            title={name}
            text={`${current ? "This week" : "That week"} is ${name}.`}
            onClick={() => onChange(startWeekFor(draft, i, label as 0 | 1))}
          />
        ))}
      </div>
    </>
  );
}

function SummaryRow({
  name,
  onChange,
  children,
}: {
  name: string;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <dt>{name}</dt>
      <dd>
        <div>{children}</div>
        <button type="button" className="link" onClick={onChange}>
          Change<span className="visually-hidden"> {name.toLowerCase()}</span>
        </button>
      </dd>
    </div>
  );
}
