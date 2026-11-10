// A lesson, full screen: a worked example for a new skill, then each question with its answer
// widgets and a Check button. Checking marks the answer and slides up a panel: a cheer, or what went
// wrong (the misconception, the right answer and the worked solution on request). In challenge mode
// the bar shows hearts, and running out ends the lesson with nothing lost; a speed round shows a
// countdown and moves straight on. The lesson ends on a summary of XP, accuracy, the streak, any new
// level and any badge or streak freeze earned. Dot takes the shape of the topic.
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
import { skillText, unitOf } from "@mathsplanner/learning";
import { Dot } from "./Dot.tsx";
import { familyOf, type Family } from "@mathsplanner/learning";
import { HeartIcon, SnowflakeIcon, StarIcon, StreakIcon } from "./Icons.tsx";
import {
  answer,
  drop,
  finished,
  HEARTS,
  heartsLeft,
  lessonProgress,
  SPEED_SECONDS,
  startLesson,
  summarise,
  timeUp,
  type LessonItem,
  type LessonPlan,
  type LessonSummary,
} from "@mathsplanner/learning";
import { describeMisconception } from "@mathsplanner/learning";
import type { Badge } from "@mathsplanner/learning";
import { BadgeMark } from "./BadgeMark.tsx";
import { formOf, questionFor, type LessonQuestion } from "@mathsplanner/learning";
import { play } from "./sounds.ts";

/** The family of a skill's unit, for Dot's shape. */
const familyOfSkill = (skill: string): Family => familyOf(unitOf(skill)?.topic ?? "");

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
  badges: Badge[];
  freeze: boolean;
}

export function LessonView({
  plan,
  ending,
  challenge,
  sound,
  recent,
  onComplete,
  onRetry,
  onClose,
}: {
  plan: LessonPlan;
  ending: LessonEnding | undefined;
  /** Forms of question the pupil saw lately for these skills, newest first. */
  recent: readonly string[];
  /** Hearts, for pupils who chose challenge mode; never in a speed round. */
  challenge: boolean;
  sound: boolean;
  /** With the forms of question shown for each skill. */
  onComplete: (summary: LessonSummary, shown: Record<string, string[]>) => void;
  /** The same kind of lesson again, after running out of hearts. */
  onRetry: () => void;
  onClose: () => void;
}) {
  const [state, setState] = useState(() => startLesson(plan));
  const [example, setExample] = useState(plan.example);
  const [leaving, setLeaving] = useState(false);
  const speed = plan.kind === "speed";
  const hearts = challenge && !speed;
  const [seconds, setSeconds] = useState(SPEED_SECONDS);
  const item = state.queue[0];
  const done = finished(state);
  const out = hearts && heartsLeft(state) === 0 && !done;
  // Effects can run twice (React's strict mode does so on purpose); the lesson is saved once.
  const reported = useRef(false);
  // When each form of question was last seen (higher is more recent: earlier lessons below 0,
  // this one counting up), and the forms this lesson showed, by skill.
  const lastSeen = useRef(new Map(recent.map((form, i) => [form, -1 - i] as const)));
  const shown = useRef<Record<string, string[]>>({});
  const shownCount = useRef(0);
  const onShown = (skill: string, form: string) => {
    lastSeen.current.set(form, ++shownCount.current);
    // Kept in the order each form was last shown, as progress remembers them newest first.
    const forms = (shown.current[skill] ??= []);
    const at = forms.indexOf(form);
    if (at >= 0) forms.splice(at, 1);
    forms.push(form);
  };

  useEffect(() => {
    if (done && !reported.current) {
      reported.current = true;
      onComplete(summarise(state, hearts), shown.current);
    }
  }, [done, onComplete, state, hearts]);

  // The speed round's clock: a tick a second, and the round ends at zero.
  useEffect(() => {
    if (!speed || done) return;
    const tick = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(tick);
  }, [speed, done]);
  useEffect(() => {
    if (speed && seconds === 0) setState((s) => timeUp(s));
  }, [speed, seconds]);

  useEffect(() => {
    if (out) play("out", sound);
  }, [out, sound]);

  if (ending) return <EndStep ending={ending} plan={plan} sound={sound} onClose={onClose} />;
  if (out) return <OutOfHearts onRetry={onRetry} onClose={onClose} />;

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
          <span
            style={{
              width: `${(speed ? seconds / SPEED_SECONDS : lessonProgress(state)) * 100}%`,
            }}
          />
        </div>
        {speed && (
          <span className="clock" aria-live="off">
            {seconds}s<span className="visually-hidden"> left</span>
          </span>
        )}
        {hearts && (
          <span className="hearts" aria-label={`${heartsLeft(state)} of ${HEARTS} hearts left`}>
            {Array.from({ length: HEARTS }, (_, i) => (
              <HeartIcon key={i} size={22} full={i < heartsLeft(state)} />
            ))}
          </span>
        )}
      </header>

      {example ? (
        <ExampleStep item={example} onDone={() => setExample(undefined)} />
      ) : item ? (
        <QuestionStep
          key={`${item.slot}/${item.attempt}`}
          item={item}
          quick={speed}
          sound={sound}
          // A question put wrong comes back in the same form; a new one in a fresh form.
          lastSeen={item.attempt > 0 ? NONE : lastSeen.current}
          onShown={onShown}
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
          <Dot size={56} family={familyOfSkill(item.skill)} />
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

const NONE: ReadonlyMap<string, number> = new Map();

function QuestionStep({
  item,
  quick,
  sound,
  lastSeen,
  onShown,
  onAnswered,
  onUnavailable,
}: {
  item: LessonItem;
  /** A speed round: move on by itself soon after checking. */
  quick: boolean;
  sound: boolean;
  /** When each form of question was last seen, and where to say which form was shown. */
  lastSeen: ReadonlyMap<string, number>;
  onShown: (skill: string, form: string) => void;
  onAnswered: (correct: boolean, misconception?: string) => void;
  onUnavailable: () => void;
}) {
  const lq = useMemo<LessonQuestion | undefined>(
    () => questionFor(item, lastSeen),
    [item, lastSeen],
  );
  // A retry repeats a form on purpose, so only first attempts count as showing one.
  useEffect(() => {
    if (lq && item.attempt === 0) onShown(item.skill, formOf(lq.question));
  }, [lq, item.skill, item.attempt, onShown]);
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
    if (!mark) return;
    continueRef.current?.focus();
    play(mark.parts.every((p) => p.status === "correct") ? "right" : "wrong", sound);
  }, [mark, sound]);
  // In a speed round the next question comes by itself. The callback is held in a ref, as the
  // clock re-renders the lesson every second and would otherwise restart the wait.
  const answered = useRef(onAnswered);
  answered.current = onAnswered;
  useEffect(() => {
    if (!quick || !mark) return;
    const right = mark.parts.every((p) => p.status === "correct");
    const code = mark.parts.find((p) => p.misconception)?.misconception?.code;
    const wait = setTimeout(() => answered.current(right, code), right ? 600 : 1400);
    return () => clearTimeout(wait);
  }, [mark, quick]);
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
        {(item.review || item.target) && (
          <p className="review-tag">
            <span>{item.target ? "Fix a mistake" : "Review"}</span> {skillText(item.skill)}
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
                <Dot
                  size={44}
                  mood={correct ? "cheer" : "oops"}
                  family={familyOfSkill(item.skill)}
                />
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
          {why ? (
            <span dangerouslySetInnerHTML={html(why, diagrams)} />
          ) : (
            describeMisconception(m.code)
          )}
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

const DONE_WORDS = {
  skill: "Lesson complete!",
  review: "Review complete!",
  unit: "Unit review complete!",
  year: "Year review complete!",
  mistakes: "Mistakes worked on!",
  speed: "Time’s up!",
};

function OutOfHearts({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <div className="lesson">
      <main className="lesson-main lesson-end">
        <Dot size={120} mood="oops" />
        <h1>Out of hearts</h1>
        <p className="end-message">
          That one was tricky. Nothing is lost: your levels and streak are just as they were.
        </p>
      </main>
      <footer className="lesson-foot">
        <div className="lesson-foot-inner end-actions">
          <button type="button" className="button primary big" onClick={onRetry} autoFocus>
            Try again
          </button>
          <button type="button" className="button big" onClick={onClose}>
            Back to the path
          </button>
        </div>
      </footer>
    </div>
  );
}

function EndStep({
  ending,
  plan,
  sound,
  onClose,
}: {
  ending: LessonEnding;
  plan: LessonPlan;
  sound: boolean;
  onClose: () => void;
}) {
  const { summary, message, streak, today, goal, badges, freeze } = ending;
  const goalMet = today >= goal;
  useEffect(() => play("done", sound), [sound]);
  return (
    <div className="lesson">
      <main className="lesson-main lesson-end">
        <Dot size={140} mood="cheer" family={plan.skill ? familyOfSkill(plan.skill) : "number"} />
        <h1>{summary.perfect ? "A perfect lesson!" : DONE_WORDS[plan.kind]}</h1>
        <p className="lesson-lead">{plan.title}</p>
        <p className="end-message">{message}</p>
        <dl className="end-stats">
          <div>
            <dt>XP</dt>
            <dd>
              <StarIcon size={22} /> +{summary.xp}
            </dd>
          </div>
          <div>
            <dt>{plan.kind === "speed" ? "Right" : "Right first time"}</dt>
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
        {freeze && (
          <p className="reward">
            <SnowflakeIcon size={22} /> You earned a streak freeze. It keeps your streak going if
            you miss a day.
          </p>
        )}
        {badges.length > 0 && (
          <ul className="new-badges" aria-label="New badges">
            {badges.map((b) => (
              <li key={b.id}>
                <BadgeMark badge={b} earned />
                <span>
                  <strong>New badge: {b.name}</strong>
                  <span className="muted small">{b.how}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
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
