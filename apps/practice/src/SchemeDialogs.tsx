// The dialogs a scheme opens over itself: a half-term's weekly homework, its test, and a quick
// check of the prerequisites a topic or half-term relies on. Each makes ordinary session links,
// seeded from the scheme so the same scheme always gives the same questions.
import { DEPTHS, NUMBERS, type Depth, type Numbers } from "@mathsplanner/core";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CommonControls, DepthSelect, PaperActions, useCommon } from "./PaperViews.tsx";
import {
  classLabel,
  halfTermName,
  prerequisiteCheck,
  randomSeed,
  TERMS,
  weekHomework,
  weekPlan,
  yearSoFar,
  type Course,
  type Scheme,
} from "./scheme.ts";
import {
  DEFAULT_SHEET,
  formatRoute,
  MAX_QUESTIONS,
  statementById,
  type FeedbackMode,
  type Route,
  type SessionSpec,
} from "./session.ts";

export type Navigate = (route: Route, replace?: boolean) => void;

/** A modal dialog that opens when it mounts and reports when it is closed. */
export function Dialog({ close, children }: { close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    <dialog ref={ref} className="scheme-dialog" onClose={close}>
      <form method="dialog" className="dialog-close">
        <button type="submit" aria-label="Close">
          ×
        </button>
      </form>
      {children}
    </dialog>
  );
}

const linkTo = (spec: SessionSpec) =>
  `${window.location.href.split("#")[0]}${formatRoute({ page: "session", spec })}`;

function useCopy(): [string, (key: string, text: string) => void] {
  const [copied, setCopied] = useState("");
  return [
    copied,
    (key, text) => {
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        window.setTimeout(() => setCopied(""), 1500);
      });
    },
  ];
}

const listIds = (ids: string[]) => {
  const shown = ids.slice(0, 4).map((id) => statementById.get(id)?.text ?? id);
  return `${shown.join("; ")}${ids.length > 4 ? `; and ${ids.length - 4} more` : ""}`;
};

/**
 * A half-term's homework, one set a week. Each week practises what was first taught that week and
 * calls back to the weeks before it; the last week reviews the whole half-term.
 */
export function WeeklyHomework({
  scheme,
  course,
  term,
  navigate,
  update,
}: {
  scheme: Scheme;
  course: Course;
  term: number;
  navigate: Navigate;
  update: (s: Scheme) => void;
}) {
  const [count, setCount] = useState(10);
  const [earlierTerms, setEarlierTerms] = useState(false);
  const [numbers, setNumbers] = useState<Numbers>("standard");
  const [feedback, setFeedback] = useState<FeedbackMode>("each");
  const [copied, copy] = useCopy();
  const plan = weekPlan(scheme, term);
  const options = { count, earlierTerms, numbers, feedback };
  const weeks = plan.weeks.map((_, w) => weekHomework(scheme, term, w, options));
  const name = halfTermName(course, term);
  const all = weeks
    .map((hw, w) => (hw ? `Week ${w + 1}: ${linkTo(hw.spec)}` : ""))
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <h2>
        {name} homework{scheme.className ? ` for ${scheme.className}` : ""}
      </h2>
      <p className="muted">
        One set a week. About half of each set practises what was first taught that week, and the
        rest calls back to the earlier weeks of {name}, recent ones most. The last week reviews the
        whole half-term, with a question on everything in it. Each link stays the same, so you can
        set them in advance.
      </p>
      <div className="controls">
        <label>
          Questions a week
          <input
            type="number"
            min={2}
            max={MAX_QUESTIONS}
            value={count}
            onChange={(e) =>
              setCount(
                Math.min(MAX_QUESTIONS, Math.max(2, Math.round(Number(e.target.value)) || 2)),
              )
            }
          />
        </label>
        <label>
          Numbers
          <select value={numbers} onChange={(e) => setNumbers(e.target.value as Numbers)}>
            {NUMBERS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="radio">
          <legend>On screen</legend>
          <label className="check">
            <input
              type="radio"
              name="hw-feedback"
              checked={feedback === "each"}
              onChange={() => setFeedback("each")}
            />
            Feedback after each question
          </label>
          <label className="check">
            <input
              type="radio"
              name="hw-feedback"
              checked={feedback === "end"}
              onChange={() => setFeedback("end")}
            />
            Marks only at the end
          </label>
        </fieldset>
        {term > 0 && (
          <label className="check">
            <input
              type="checkbox"
              checked={earlierTerms}
              onChange={(e) => setEarlierTerms(e.target.checked)}
            />
            Also call back to earlier half-terms
          </label>
        )}
      </div>
      <ol className="homework-weeks">
        {weeks.map((hw, w) => (
          <li key={w}>
            <div>
              <strong>Week {w + 1}</strong>
              {!hw ? (
                <span className="muted"> · nothing taught yet</span>
              ) : hw.kind === "review" ? (
                <span>
                  {" "}
                  · Half-term review: {hw.spec.count} questions covering all of {name}
                </span>
              ) : (
                <>
                  <span className="muted">
                    {" "}
                    · {hw.spec.count - hw.recall} new, {hw.recall} call-back
                    {hw.recall === 1 ? "" : "s"}
                  </span>
                  <div className="small">
                    {hw.taught.length ? listIds(hw.taught) : "No new content: call-backs only"}
                  </div>
                </>
              )}
            </div>
            {hw && (
              <div className="buttons">
                <button type="button" onClick={() => copy(`w${w}`, linkTo(hw.spec))}>
                  {copied === `w${w}` ? "Copied" : "Copy link"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      page: "worksheet",
                      spec: hw.spec,
                      sheet: { ...DEFAULT_SHEET, title: hw.spec.title ?? DEFAULT_SHEET.title },
                    })
                  }
                >
                  Print
                </button>
                <button type="button" onClick={() => navigate({ page: "session", spec: hw.spec })}>
                  Open
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="session-buttons">
        <button type="button" className="primary" disabled={!all} onClick={() => copy("all", all)}>
          {copied === "all" ? "All links copied" : "Copy every week's link"}
        </button>
        <button
          type="button"
          onClick={() => update({ ...scheme, seed: randomSeed() })}
          title="Every homework and check in this scheme gets new questions and new links"
        >
          New questions
        </button>
      </div>
      <p className="muted small">
        {scheme.weekLessons
          ? "Weeks come from each item's lessons and the class's lessons in your timetable. "
          : `Weeks come from each item's lessons and the ${scheme.lessonsPerWeek} lessons a week set for this scheme; change them in the plan. `}
        Paste the links into Google Classroom or Teams.
      </p>
    </>
  );
}

/** A test on a half-term, or on the school year so far. */
export function HalfTermTest({
  scheme,
  course,
  term,
  navigate,
}: {
  scheme: Scheme;
  course: Course;
  term: number;
  navigate: Navigate;
}) {
  const c = useCommon({ count: 15, feedback: "end" });
  const [start, setStart] = useState<Depth>(1);
  const [end, setEnd] = useState<Depth>(4);
  const [cumulative, setCumulative] = useState(false);
  const first = term - (term % 6);
  const name = halfTermName(course, term);
  const items = cumulative ? yearSoFar(scheme, term) : (scheme.halfTerms[term]?.items ?? []);
  const label = scheme.className ? `${scheme.className}: ` : "";
  const title =
    cumulative && first < term
      ? `${label}${halfTermName(course, first)} to ${TERMS[term % 6]} test`
      : `${label}${name} test`;
  const spec: SessionSpec = {
    statements: items,
    depths: DEPTHS.filter((d) => d >= Math.min(start, end) && d <= Math.max(start, end)),
    numbers: c.numbers,
    count: c.count,
    seed: c.seed,
    feedback: c.feedback,
    title,
    paper: { kind: "set", start, end, marks: c.marks },
  };
  return (
    <>
      <h2>{title}</h2>
      <p className="muted">
        A test paper that builds from one depth to another, and can aim at a total number of marks.
      </p>
      {first < term && (
        <fieldset className="radio">
          <legend>Covers</legend>
          <label className="check">
            <input
              type="radio"
              name="covers"
              checked={!cumulative}
              onChange={() => setCumulative(false)}
            />
            {name} only
          </label>
          <label className="check">
            <input
              type="radio"
              name="covers"
              checked={cumulative}
              onChange={() => setCumulative(true)}
            />
            The year so far, from {halfTermName(course, first)}
          </label>
        </fieldset>
      )}
      <div className="controls">
        <DepthSelect label="Start at depth" value={start} onChange={setStart} />
        <DepthSelect label="End at depth" value={end} onChange={setEnd} />
        <CommonControls c={c} />
      </div>
      <PaperActions spec={spec} navigate={navigate} />
    </>
  );
}

/**
 * A short quiz on what a topic or half-term builds on, to run before teaching it, so you can see
 * whether the class needs those statements taught again.
 */
export function PrerequisiteCheck({
  scheme,
  ids,
  name,
  seedOffset,
  navigate,
}: {
  scheme: Scheme;
  ids: string[];
  name: string;
  seedOffset: number;
  navigate: Navigate;
}) {
  const spec = ids.length
    ? prerequisiteCheck(
        ids,
        `${classLabel(scheme)}: before ${name}`,
        scheme.seed * 1000 + 900 + seedOffset,
      )
    : undefined;
  return (
    <>
      <h2>Check prerequisites: {name}</h2>
      {spec ? (
        <>
          <p className="muted">
            A short quiz on what {name} builds on, at depths 1 and 2, to run before you teach it. If
            the class finds some of it hard, add those statements to the half-term first.
          </p>
          <ul className="check-list small">
            {ids.map((id) => (
              <li key={id}>
                <code>{id}</code> {statementById.get(id)?.text}
              </li>
            ))}
          </ul>
          <PaperActions spec={spec} navigate={navigate} print="Print the check" />
        </>
      ) : (
        <p className="banner">
          Nothing to check: everything {name} needs is taught earlier in this scheme.
        </p>
      )}
    </>
  );
}
