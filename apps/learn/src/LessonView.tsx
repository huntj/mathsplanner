// A lesson, full screen: a worked example for a new skill, then each question with its answer
// widgets and a Check button. Checking marks the answer and slides up a panel: a cheer, or what went
// wrong (the misconception, the right answer and the worked solution on request). The lesson ends
// on a summary of XP, accuracy, the streak and any new level.
import type { DiagramSpec, Question, Rich } from "@mathsplanner/core";
import {
  markQuestion,
  prepareMarking,
  type MarkResult,
  type QuestionMark,
} from "@mathsplanner/marking";
import { renderAnswer, renderRich, renderSolution } from "@mathsplanner/render";
import {
  canvasIndex,
  emptyDraft,
  isComplete,
  PartInput,
  toResponse,
  type Draft,
} from "@mathsplanner/ui";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import catalogueFile from "../../../data/misconceptions.json" with { type: "json" };
import { skillText } from "./course.ts";
import { Dot } from "./Dot.tsx";
import { StarIcon, StreakIcon } from "./Icons.tsx";
import {
  answer,
  drop,
  finished,
  lessonProgress,
  startLesson,
  summarise,
  type LessonItem,
  type LessonPlan,
  type LessonSummary,
} from "./lesson.ts";
import { questionFor, type LessonQuestion } from "./skills.ts";

const catalogue = new Map(
  (catalogueFile as { misconceptions: { code: string; description: string }[] }).misconceptions.map(
    (m) => [m.code, m.description],
  ),
);

const CHEERS = ["Brilliant!", "Nice one!", "Spot on!", "Great work!", "You got it!", "Yes!"];

const html = (rich: Rich, diagrams: readonly DiagramSpec[]) => ({
  __html: renderRich(rich, diagrams),
});

/** What the end screen shows beyond the lesson itself, worked out once progress is saved. */
export interface LessonEnding {
  summary: LessonSummary;
  message: string;
  streak: number;
  /** Lessons done today, and the daily goal. */
  today: number;
  goal: number;
}

export function LessonView({
  plan,
  ending,
  onComplete,
  onClose,
}: {
  plan: LessonPlan;
  ending: LessonEnding | undefined;
  onComplete: (summary: LessonSummary) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState(() => startLesson(plan));
  const [example, setExample] = useState(plan.example);
  const [leaving, setLeaving] = useState(false);
  const item = state.queue[0];
  const done = finished(state);
  // Effects can run twice (React's strict mode does so on purpose); the lesson is saved once.
  const reported = useRef(false);

  useEffect(() => {
    if (done && !reported.current) {
      reported.current = true;
      onComplete(summarise(state));
    }
  }, [done, onComplete, state]);

  if (ending) return <EndStep ending={ending} skill={plan.skill} onClose={onClose} />;

  return (
    <div className="lesson">
      <header className="lesson-bar">
        <button
          type="button"
          className="icon-button"
          aria-label="Leave the lesson"
          onClick={() => setLeaving(true)}
        >
          <span aria-hidden="true">✕</span>
        </button>
        <div
          className="lesson-progress"
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(lessonProgress(state) * 100)}
        >
          <span style={{ width: `${lessonProgress(state) * 100}%` }} />
        </div>
      </header>

      {example ? (
        <ExampleStep item={example} onDone={() => setExample(undefined)} />
      ) : item ? (
        <QuestionStep
          key={`${item.slot}/${item.attempt}`}
          item={item}
          onAnswered={(correct, misconception) =>
            setState((s) => answer(s, correct, misconception))
          }
          onUnavailable={() => setState((s) => drop(s))}
        />
      ) : (
        <div className="lesson-main">
          <Dot size={96} mood="cheer" />
        </div>
      )}

      {leaving && (
        <div className="leave" role="alertdialog" aria-labelledby="leave-title">
          <div className="leave-card">
            <Dot size={64} />
            <h2 id="leave-title">Leave this lesson?</h2>
            <p className="muted">You will lose your progress in it.</p>
            <button type="button" className="button primary big" onClick={() => setLeaving(false)}>
              Keep going
            </button>
            <button type="button" className="button big" onClick={onClose}>
              Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** The question's stem, with the drawing area for a plot part taken out (the widget draws it). */
function Stem({ question }: { question: Question }) {
  const canvas = canvasIndex(question);
  const stem =
    canvas === undefined
      ? question.stem
      : question.stem.filter((n) => !(n.t === "diagram" && n.i === canvas));
  return <div className="mp-stem" dangerouslySetInnerHTML={html(stem, question.diagrams)} />;
}

function ExampleStep({ item, onDone }: { item: LessonItem; onDone: () => void }) {
  const lq = useMemo(() => questionFor(item), [item]);
  useEffect(() => {
    if (!lq) onDone();
  }, [lq, onDone]);
  if (!lq) return null;
  const { question } = lq;
  return (
    <>
      <main className="lesson-main">
        <div className="lesson-intro">
          <Dot size={56} />
          <div>
            <p className="eyebrow">New skill</p>
            <h1 className="lesson-skill">{skillText(item.skill)}</h1>
          </div>
        </div>
        <p className="lesson-lead">Here is one worked through. Read it, then try one yourself.</p>
        <article className="mp-question lesson-card">
          <Stem question={question} />
          {question.parts.map((part, i) => (
            <div key={i} className="example-part">
              {question.parts.length > 1 && (
                <span className="mp-label">{part.label ?? `(${String.fromCharCode(97 + i)})`}</span>
              )}{" "}
              <span dangerouslySetInnerHTML={html(part.prompt, question.diagrams)} />
            </div>
          ))}
          <div
            className="example-solution"
            dangerouslySetInnerHTML={{
              __html: renderSolution(question.solution, question.diagrams),
            }}
          />
          {question.parts.map(
            (part, i) =>
              part.answer.type !== "plot" && (
                <p key={i} className="example-answer">
                  <strong>Answer:</strong>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderAnswer(part.answer, question.diagrams),
                    }}
                  />
                </p>
              ),
          )}
        </article>
      </main>
      <footer className="lesson-foot">
        <div className="lesson-foot-inner">
          <button type="button" className="button primary big" onClick={onDone} autoFocus>
            Try one yourself
          </button>
        </div>
      </footer>
    </>
  );
}

function QuestionStep({
  item,
  onAnswered,
  onUnavailable,
}: {
  item: LessonItem;
  onAnswered: (correct: boolean, misconception?: string) => void;
  onUnavailable: () => void;
}) {
  const lq = useMemo<LessonQuestion | undefined>(() => questionFor(item), [item]);
  const [drafts, setDrafts] = useState<Draft[]>(
    () => lq?.question.parts.map((p) => emptyDraft(p.answer)) ?? [],
  );
  const [mark, setMark] = useState<QuestionMark>();
  const [checking, setChecking] = useState(false);
  const [solution, setSolution] = useState(false);
  const continueRef = useRef<HTMLButtonElement>(null);
  const dropped = useRef(false);

  useEffect(() => {
    if (!lq && !dropped.current) {
      dropped.current = true;
      onUnavailable();
    }
  }, [lq, onUnavailable]);
  useEffect(() => {
    if (mark) continueRef.current?.focus();
  }, [mark]);
  if (!lq) return null;
  const { question, validators } = lq;
  const { diagrams } = question;
  const canvas = canvasIndex(question);
  const ready = question.parts.every((p, i) => {
    const d = drafts[i];
    return d !== undefined && isComplete(p.answer, d);
  });

  const check = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!ready || mark || checking) return;
    setChecking(true);
    await prepareMarking(question);
    const responses = question.parts.map((p, i) => {
      const d = drafts[i];
      return d ? toResponse(p.answer, d) : undefined;
    });
    setMark(markQuestion(question, responses, validators));
    setChecking(false);
  };

  const stuck = () => {
    setMark(markQuestion(question, [], validators));
    setSolution(true);
  };

  const correct = mark?.parts.every((p) => p.status === "correct") ?? false;
  const nearly = mark !== undefined && !correct && mark.score > 0;
  const misconception = mark?.parts.find((p) => p.misconception)?.misconception?.code;

  return (
    <form className="lesson-form" onSubmit={check}>
      <main className="lesson-main">
        {item.review && (
          <p className="review-tag">
            <span>Review</span> {skillText(item.skill)}
          </p>
        )}
        {item.attempt > 0 && (
          <p className="retry-tag">Let’s try that one again, with new numbers.</p>
        )}
        <article className="mp-question lesson-card">
          <Stem question={question} />
          <ol className="parts">
            {question.parts.map((part, i) => {
              const draft = drafts[i];
              return (
                <li key={i} className="part">
                  <div className="prompt">
                    {question.parts.length > 1 && (
                      <span className="mp-label">
                        {part.label ?? `(${String.fromCharCode(97 + i)})`}
                      </span>
                    )}{" "}
                    <span dangerouslySetInnerHTML={html(part.prompt, diagrams)} />
                  </div>
                  {draft && (
                    <PartInput
                      part={part}
                      diagrams={diagrams}
                      draft={draft}
                      setDraft={(d) => setDrafts((all) => all.map((x, k) => (k === i ? d : x)))}
                      locked={mark !== undefined}
                      reveal={mark !== undefined}
                      {...(canvas !== undefined && part.answer.type === "plot" && diagrams[canvas]
                        ? { canvas: diagrams[canvas] }
                        : {})}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </article>
        {solution && question.solution.length > 0 && (
          <div
            className="lesson-card solution-card"
            dangerouslySetInnerHTML={{ __html: renderSolution(question.solution, diagrams) }}
          />
        )}
      </main>

      <footer
        className={`lesson-foot${mark ? (correct ? " right" : nearly ? " nearly" : " wrong") : ""}`}
      >
        <div className="lesson-foot-inner">
          {mark ? (
            <div className="verdict" role="status">
              <div className="verdict-head">
                <Dot size={44} mood={correct ? "cheer" : "happy"} />
                <h2>
                  {correct
                    ? CHEERS[item.seed % CHEERS.length]
                    : nearly
                      ? "Nearly there"
                      : mark.parts.every((p) => p.status === "unanswered")
                        ? "Here’s how it goes"
                        : "Not quite"}
                </h2>
              </div>
              {!correct &&
                question.parts.map((part, i) => {
                  const result = mark.parts[i];
                  return result ? (
                    <PartFeedback key={i} part={part} result={result} diagrams={diagrams} />
                  ) : null;
                })}
              <div className="verdict-actions">
                {!correct && question.solution.length > 0 && (
                  <button type="button" className="button" onClick={() => setSolution(!solution)}>
                    {solution ? "Hide the working" : "Show me how"}
                  </button>
                )}
                <button
                  type="button"
                  ref={continueRef}
                  className="button primary big"
                  onClick={() => onAnswered(correct, misconception)}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="check-row">
              <button type="button" className="button" onClick={stuck}>
                Show me
              </button>
              <button type="submit" className="button primary big" disabled={!ready || checking}>
                {checking ? "Checking…" : "Check"}
              </button>
            </div>
          )}
        </div>
      </footer>
    </form>
  );
}

function PartFeedback({
  part,
  result,
  diagrams,
}: {
  part: Question["parts"][number];
  result: MarkResult;
  diagrams: readonly DiagramSpec[];
}) {
  if (result.status === "correct") return null;
  const m = result.misconception;
  const why = m && m.feedback.length > 0 ? m.feedback : undefined;
  return (
    <div className="part-feedback">
      {result.message && <p>{result.message}</p>}
      {m && (
        <p>
          {why ? <span dangerouslySetInnerHTML={html(why, diagrams)} /> : catalogue.get(m.code)}
        </p>
      )}
      {m?.remediate && (
        <p className="muted">It may help to look back at “{skillText(m.remediate)}”.</p>
      )}
      {part.answer.type !== "plot" && part.answer.type !== "free-text" && (
        <p>
          <strong>Answer:</strong>{" "}
          <span dangerouslySetInnerHTML={{ __html: renderAnswer(part.answer, diagrams) }} />
        </p>
      )}
    </div>
  );
}

function EndStep({
  ending,
  skill,
  onClose,
}: {
  ending: LessonEnding;
  skill: string;
  onClose: () => void;
}) {
  const { summary, message, streak, today, goal } = ending;
  const goalMet = today >= goal;
  return (
    <div className="lesson">
      <main className="lesson-main lesson-end">
        <Dot size={140} mood="cheer" />
        <h1>{summary.perfect ? "A perfect lesson!" : "Lesson complete!"}</h1>
        <p className="lesson-lead">{skillText(skill)}</p>
        <p className="end-message">{message}</p>
        <dl className="end-stats">
          <div>
            <dt>XP</dt>
            <dd>
              <StarIcon size={22} /> +{summary.xp}
            </dd>
          </div>
          <div>
            <dt>Right first time</dt>
            <dd>
              {summary.firstTime}/{summary.total}
            </dd>
          </div>
          {goalMet ? (
            <div>
              <dt>Streak</dt>
              <dd>
                <StreakIcon size={22} /> {streak}
              </dd>
            </div>
          ) : (
            <div>
              <dt>Today</dt>
              <dd>
                {today}/{goal}
              </dd>
            </div>
          )}
        </dl>
        {today === goal && <p className="goal-met">Daily goal met. See you tomorrow!</p>}
      </main>
      <footer className="lesson-foot">
        <div className="lesson-foot-inner">
          <button type="button" className="button primary big" onClick={onClose} autoFocus>
            Continue
          </button>
        </div>
      </footer>
    </div>
  );
}
