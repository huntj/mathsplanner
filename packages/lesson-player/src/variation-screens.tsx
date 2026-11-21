// The learning stage with variation (docs/proposals/lesson-variation.md): a worked example with a
// question just like it, and sets of short questions that change one thing at a time or move the
// unknown. Before some questions the pupil predicts what a change will do (reflect, expect,
// check); the prediction is never marked wrong, only checked against the answer.
import { createContext, useContext, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Ask, Pair, QuestionSet } from "@mathsplanner/learning/unit-lessons";
import { PictureView } from "./Picture.tsx";
import { play } from "./sounds.ts";
import { matches, shuffled, tidy } from "./unit-screens.tsx";
import { Title, useChime, Verdict, W, Working, WorkingStep, type Step } from "./unit-ui.tsx";

/** Whether the lesson has a method card the pupil can open, so hints can point to it. */
export const HasMethod = createContext(false);

const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;
/** Units written before the number, as pounds are: £40, not 40 £. */
const PREFIX = new Set(["£"]);
const withUnit = (unit?: string) => (!unit ? "" : unit === "°" ? unit : ` ${unit}`);

/** An answer as it is shown once given: the first accepted answer, with its unit. */
export const shownAnswer = (item: Ask) =>
  item.unit && PREFIX.has(item.unit)
    ? `${item.unit}${item.answers[0] ?? ""}`
    : `${item.answers[0] ?? ""}${withUnit(item.unit)}`;

/** What to say about a prediction once the answer is known. */
export function expectVerdict(item: Ask, picked: number | undefined): string {
  const options = item.expect?.options ?? [];
  const right = options.find((o) => o.correct);
  if (!right || picked === undefined) return "";
  return options[picked]?.correct
    ? `**As you expected.** ${right.feedback}`
    : `**You expected something else.** ${right.feedback}`;
}

/**
 * One short question: a prediction first if it has one, then a typed or chosen answer. Two wrong
 * tries show the answer. `onDone` runs when the pupil moves on.
 */
function AskView({
  item,
  family,
  sound,
  last,
  done,
  before,
  onDone,
}: {
  item: Ask;
  /** The question before's picture, to show beside this one while the pupil predicts. */
  before?: Ask["picture"] | undefined;
  family: Step<unknown>["family"];
  sound: boolean;
  /** Whether this is the screen's last question, so moving on leaves the screen. */
  last: boolean;
  /** Said after the last question's own reason. */
  done?: string;
  onDone: () => void;
}) {
  const hasMethod = useContext(HasMethod);
  const [picked, setPicked] = useState<number>();
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [verdict, setVerdict] = useState<"right" | "wrong">();
  const right = verdict === "right";
  const gaveUp = verdict === "wrong" && tries >= 2;
  useChime(right, sound);
  useEffect(() => {
    if (verdict === "wrong") play("wrong", sound);
  }, [verdict, tries, sound]);
  const predicting = item.expect !== undefined && picked === undefined;
  const expectOrder = useMemo(
    () =>
      shuffled(
        (item.expect?.options ?? []).map((_, i) => i),
        item.expect?.question ?? "",
      ),
    [item],
  );
  const optionOrder = useMemo(
    () => (item.options ? shuffled(item.options, item.prompt) : []),
    [item],
  );
  const numeric = item.answers.every((a) => NUMBER.test(tidy(a)) && !a.trim().startsWith("-"));

  const mark = (typed: string) => {
    if (verdict) return;
    if (item.answers.some((a) => matches(typed, a))) setVerdict("right");
    else {
      setTries(tries + 1);
      setVerdict("wrong");
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) mark(value);
  };

  const told = [expectVerdict(item, picked), item.why, last ? (done ?? "") : ""]
    .filter(Boolean)
    .join(" ");
  const nudge = `${item.hint}${hasMethod && !gaveUp ? " Tap **Method** to see the steps again." : ""}`;

  return (
    <form className="lesson-form" onSubmit={submit}>
      <main className="lesson-main ask-main">
        {!predicting && item.changed && (
          <p className="ask-changed">
            <span className="ask-changed-tag">What's changed</span> <W text={item.changed} />
          </p>
        )}
        {!predicting && (
          <p className="lesson-lead ask-prompt">
            <W text={item.prompt} />
          </p>
        )}
        {(!predicting || !before) && item.picture && <PictureView picture={item.picture} />}
        {predicting && item.expect ? (
          <div className="ask-expect">
            {/* The change, plain to see: the last diagram beside this one. */}
            {before && item.picture && (
              <div className="before-after">
                <figure>
                  <figcaption>Before</figcaption>
                  <PictureView picture={before} />
                </figure>
                <figure>
                  <figcaption>Now</figcaption>
                  <PictureView picture={item.picture} />
                </figure>
              </div>
            )}
            {/* What changed, then the question, just above the choices. */}
            {item.changed && (
              <p className="ask-changed">
                <span className="ask-changed-tag">What's changed</span> <W text={item.changed} />
              </p>
            )}
            <p className="ul-prompt">
              <W text={item.expect.question} />
            </p>
            <div className="ul-options" role="group" aria-label="What do you expect?">
              {expectOrder.map((i) => {
                const o = item.expect?.options[i];
                return o ? (
                  <button
                    key={i}
                    type="button"
                    data-i={i}
                    className="ul-option"
                    onClick={() => setPicked(i)}
                  >
                    <W text={o.text} />
                  </button>
                ) : null;
              })}
            </div>
          </div>
        ) : item.options ? (
          <div className="ul-options" role="group" aria-label="Your answer">
            {optionOrder.map((o, i) => (
              <button
                key={`${tries}-${i}`}
                type="button"
                // Its place in the lesson's list, as on other screens, whatever order it's shown in.
                data-i={item.options?.indexOf(o)}
                className={`ul-option${verdict && item.answers.includes(o) && (right || gaveUp) ? " right" : ""}`}
                disabled={verdict !== undefined}
                onClick={() => mark(o)}
              >
                <W text={o} />
              </button>
            ))}
          </div>
        ) : (
          <label className="ul-answer">
            <span className="visually-hidden">Your answer</span>
            {item.unit && PREFIX.has(item.unit) && <span className="ul-unit">{item.unit}</span>}
            <input
              className="ul-input"
              value={value}
              inputMode={numeric ? "decimal" : "text"}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              readOnly={right || gaveUp}
              onChange={(e) => {
                setValue(e.target.value);
                if (verdict === "wrong" && !gaveUp) setVerdict(undefined);
              }}
            />
            {item.unit && !PREFIX.has(item.unit) && <span className="ul-unit">{item.unit}</span>}
          </label>
        )}
      </main>
      {verdict ? (
        <Verdict
          right={right}
          text={
            right
              ? told
              : gaveUp
                ? `${item.hint} The answer is ${shownAnswer(item)}. ${told}`
                : nudge
          }
          family={family}
          seed={tries + value.length}
          action={right || gaveUp ? (last ? "Continue" : "Next question") : "Try again"}
          onAction={() => (right || gaveUp ? onDone() : setVerdict(undefined))}
        />
      ) : predicting ? (
        <Working note="Before you work it out: what do you expect?" />
      ) : item.options ? (
        <Working note="Choose your answer." />
      ) : (
        <Working>
          <button type="submit" className="button primary big" disabled={!value.trim()}>
            Check
          </button>
        </Working>
      )}
    </form>
  );
}

/** A worked example, all its steps shown, with a question just like it underneath. */
export function PairStep({ screen, family, sound, onNext }: Step<Pair>) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="lesson-main lesson-top">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        <section className="ul-working worked pair-example" aria-label="Example">
          <button
            type="button"
            className="pair-toggle"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="eyebrow">Example</span>
            <span className="pair-toggle-text">{open ? "Hide" : "Show"}</span>
          </button>
          <p className="worked-problem">
            <W text={screen.example.problem} />
          </p>
          {open && (
            <>
              {screen.example.picture && <PictureView picture={screen.example.picture} />}
              {screen.example.steps.map((s, i) => (
                <WorkingStep key={i} step={s} family={family} />
              ))}
            </>
          )}
        </section>
        <p className="eyebrow pair-now">Now you</p>
      </div>
      <AskView
        item={screen.question}
        family={family}
        sound={sound}
        last
        done={screen.done}
        onDone={onNext}
      />
    </>
  );
}

/** Short questions one at a time, the earlier ones and their answers kept above. */
export function SetStep({ screen, family, sound, onNext }: Step<QuestionSet>) {
  const [at, setAt] = useState(0);
  const item = screen.items[at];
  const picture = item?.picture ? undefined : screen.picture;
  return (
    <>
      <div className="lesson-main lesson-top">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        {picture && <PictureView picture={picture} />}
        {at > 0 && (
          // The last two answers, to compare with: enough to see what changed, without pushing
          // the question and its picture off the screen.
          <ol className="set-done" aria-label="The last answers" start={Math.max(0, at - 2) + 1}>
            {screen.items.slice(Math.max(0, at - 2), at).map((it, i) => (
              <li key={i}>
                <W text={it.prompt} className="set-done-prompt" />
                <span className="set-done-answer">
                  <W text={shownAnswer(it)} />
                </span>
              </li>
            ))}
          </ol>
        )}
        <p className="quiz-count">
          Question {at + 1} of {screen.items.length}
        </p>
      </div>
      {item && (
        <AskView
          // A fresh question each time.
          key={at}
          item={item}
          family={family}
          sound={sound}
          before={screen.items[at - 1]?.picture}
          last={at + 1 === screen.items.length}
          done={screen.done}
          onDone={() => {
            if (at + 1 < screen.items.length) {
              setAt(at + 1);
              play("right", sound);
            } else onNext();
          }}
        />
      )}
    </>
  );
}
