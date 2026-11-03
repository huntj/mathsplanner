// A unit lesson, full screen: the screens of a lesson one at a time, each something to do rather
// than read. A function machine to feed, points to plot, a picture to notice something in, a
// slider to nudge until a line hits a star, an equation to build from chips, and a line to drag
// into place. Each screen opens the next once it is done; a wrong try gets a nudge, never a
// penalty. The lesson ends on a summary, like any other lesson.
import { renderRich } from "@mathsplanner/render";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { course } from "./course.ts";
import { Dot } from "./Dot.tsx";
import { familyOf, type Family } from "./families.ts";
import { StarIcon, StreakIcon } from "./Icons.tsx";
import { latticeOn, LineGraph, type GraphLine, type GraphPoint } from "./LineGraph.tsx";
import { play } from "./sounds.ts";
import {
  makesLine,
  onLine,
  ruleText,
  ruleThrough,
  samePoint,
  yOn,
  type Build,
  type Choice,
  type DragLine,
  type Explain,
  type Machine,
  type Plot,
  type Point,
  type Rule,
  type Scene,
  type Screen,
  type Slider,
  type UnitLesson,
} from "./unit-lessons/index.ts";

const CHEERS = ["Brilliant!", "Nice one!", "Spot on!", "Great work!", "You got it!", "Yes!"];

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

/** Words as HTML: maths between dollar signs, and **bold**. */
export function wordsHtml(words: string): string {
  return words
    .split("$")
    .map((part, i) =>
      i % 2
        ? renderRich([{ t: "math", v: part }])
        : part
            .replace(/[&<>"]/g, (ch) => ESCAPES[ch] ?? ch)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
    )
    .join("");
}

function W({ text, className }: { text: string; className?: string }) {
  return (
    <span
      {...(className ? { className } : {})}
      dangerouslySetInnerHTML={{ __html: wordsHtml(text) }}
    />
  );
}

const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));
const tex = (rule: Rule) => `$${ruleText(rule, "-")}$`;
const say = (p: Point) => `(${fmt(p.x)}, ${fmt(p.y)})`;

/** What the end screen shows, worked out once progress is saved. */
export interface UnitLessonEnding {
  xp: number;
  streak: number;
  today: number;
  goal: number;
}

/** Props every screen takes. */
interface Step<S> {
  screen: S;
  family: Family;
  sound: boolean;
  onNext: () => void;
}

export function UnitLessonView({
  lesson,
  ending,
  sound,
  onComplete,
  onClose,
}: {
  lesson: UnitLesson;
  ending: UnitLessonEnding | undefined;
  sound: boolean;
  onComplete: () => void;
  onClose: () => void;
}) {
  const [at, setAt] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const family = useMemo(() => {
    const unit = course.sections.flatMap((s) => s.units).find((u) => u.id === lesson.unit);
    return familyOf(unit?.topic ?? "");
  }, [lesson.unit]);
  const screen = lesson.screens[at];

  const next = () => {
    scrollTo({ top: 0 });
    if (at + 1 < lesson.screens.length) setAt(at + 1);
    else onComplete();
  };

  if (ending)
    return (
      <UnitLessonEnd
        lesson={lesson}
        ending={ending}
        family={family}
        sound={sound}
        onClose={onClose}
      />
    );

  return (
    <div className={`lesson unit-lesson fam-${family}`}>
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
          aria-valuemax={lesson.screens.length}
          aria-valuenow={at}
        >
          <span style={{ width: `${(at / lesson.screens.length) * 100}%` }} />
        </div>
      </header>

      {screen && (
        <ScreenStep
          // A fresh screen each time, so nothing carries over from the last one.
          key={at}
          screen={screen}
          first={at === 0}
          lessonTitle={lesson.title}
          family={family}
          sound={sound}
          onNext={next}
        />
      )}

      {leaving && (
        <div className="leave" role="alertdialog" aria-labelledby="leave-title">
          <div className="leave-card">
            <Dot size={64} family={family} />
            <h2 id="leave-title">Leave this lesson?</h2>
            <p className="muted">You can start it again from the path.</p>
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

function ScreenStep({
  screen,
  first,
  lessonTitle,
  ...step
}: {
  screen: Screen;
  first: boolean;
  lessonTitle: string;
  family: Family;
  sound: boolean;
  onNext: () => void;
}) {
  switch (screen.kind) {
    case "explain":
      return <ExplainStep screen={screen} eyebrow={first ? lessonTitle : undefined} {...step} />;
    case "machine":
      return <MachineStep screen={screen} {...step} />;
    case "plot":
      return <PlotStep screen={screen} {...step} />;
    case "choice":
      return <ChoiceStep screen={screen} {...step} />;
    case "slider":
      return <SliderStep screen={screen} {...step} />;
    case "build":
      return <BuildStep screen={screen} {...step} />;
    case "drag-line":
      return <DragLineStep screen={screen} {...step} />;
  }
}

/** A screen's heading, with Dot. */
function Title({
  title,
  family,
  eyebrow,
}: {
  title: string;
  family: Family;
  eyebrow?: string | undefined;
}) {
  return (
    <div className="lesson-intro">
      <Dot size={52} family={family} />
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="lesson-skill">
          <W text={title} />
        </h1>
      </div>
    </div>
  );
}

/** The panel at the foot once a screen is done (or a try was wrong). */
function Verdict({
  right,
  text,
  family,
  seed,
  action,
  onAction,
}: {
  right: boolean;
  text: string;
  family: Family;
  seed: number;
  action: string;
  onAction: () => void;
}) {
  return (
    <footer className={`lesson-foot ${right ? "right" : "wrong"}`}>
      <div className="lesson-foot-inner">
        <div className="verdict" role="status">
          <div className="verdict-head">
            <Dot size={44} mood={right ? "cheer" : "oops"} family={family} />
            <h2>{right ? CHEERS[Math.abs(seed) % CHEERS.length] : "Not quite"}</h2>
          </div>
          <p className="ul-feedback">
            <W text={text} />
          </p>
          <div className="verdict-actions">
            <button type="button" className="button primary big" onClick={onAction} autoFocus>
              {action}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** The foot while a screen is being worked on: a nudge, and any buttons. */
function Working({ children, note }: { children?: ReactNode; note?: string | undefined }) {
  return (
    <footer className="lesson-foot">
      <div className="lesson-foot-inner">
        {note && (
          <p className="ul-nudge" role="status">
            <W text={note} />
          </p>
        )}
        {children && <div className="check-row">{children}</div>}
      </div>
    </footer>
  );
}

/** Plays a sound once, when `when` turns true. */
function useChime(when: boolean, sound: boolean) {
  useEffect(() => {
    if (when) play("right", sound);
  }, [when, sound]);
}

function sceneProps(scene: Scene, rise = true) {
  const first = scene.lines?.[0];
  return {
    range: scene.range,
    lines: (scene.lines ?? []).map((rule): GraphLine => ({ rule })),
    points: (scene.points ?? []).map((at): GraphPoint => ({ at })),
    star: scene.star,
    steps: scene.steps && first ? stepsFor(first, scene) : [],
    rise,
  };
}

/**
 * Where to draw a line's steps: between the points shown, if any are on it; otherwise from where
 * it crosses the y-axis, a few steps along, as a pupil would draw it.
 */
export function stepsFor(rule: Rule, scene: Scene): Point[] {
  const shown = (scene.points ?? []).filter((p) => onLine(rule, p)).sort((a, b) => a.x - b.x);
  if (shown.length > 1) return shown;
  return latticeOn(rule, scene.range)
    .filter((p) => p.x >= 0)
    .slice(0, 4);
}

function describeScene(scene: Scene): string {
  const parts = [
    ...(scene.lines ?? []).map((l) => `the line ${ruleText(l)}`),
    ...(scene.points?.length ? [`points at ${scene.points.map(say).join(", ")}`] : []),
  ];
  return parts.length ? `A grid showing ${parts.join(" and ")}.` : "An empty grid.";
}

function ExplainStep({
  screen,
  family,
  onNext,
  eyebrow,
}: Step<Explain> & { eyebrow?: string | undefined }) {
  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} eyebrow={eyebrow} />
        {screen.scene && (
          <LineGraph {...sceneProps(screen.scene)} label={describeScene(screen.scene)} />
        )}
        <div className="ul-text">
          {screen.text.map((t, i) => (
            <p key={i}>
              <W text={t} />
            </p>
          ))}
        </div>
      </main>
      <footer className="lesson-foot">
        <div className="lesson-foot-inner">
          <button type="button" className="button primary big ul-wide" onClick={onNext} autoFocus>
            Continue
          </button>
        </div>
      </footer>
    </>
  );
}

/** The outputs a machine offers for an input: the right one and the decoys, smallest first. */
export function machineChoices(screen: Machine, x: number): number[] {
  return [...new Set([yOn(screen.rule, x), ...(screen.decoys[x] ?? [])])].sort((a, b) => a - b);
}

function MachineStep({ screen, family, sound, onNext }: Step<Machine>) {
  const { inputs, shown, rule } = screen;
  const [fed, setFed] = useState(0);
  /** The input waiting in the machine for the pupil to say what comes out. */
  const [waiting, setWaiting] = useState(false);
  const [wrong, setWrong] = useState<number[]>([]);
  const [last, setLast] = useState<number>();
  const done = fed === inputs.length;
  useChime(done, sound);
  const x = inputs[fed];

  const feed = () => {
    if (x === undefined) return;
    if (fed < shown) {
      setLast(x);
      setFed(fed + 1);
    } else setWaiting(true);
  };
  const choose = (y: number) => {
    if (x === undefined) return;
    if (y === yOn(rule, x)) {
      setWaiting(false);
      setWrong([]);
      setLast(x);
      setFed(fed + 1);
      if (fed + 1 < inputs.length) play("right", sound);
    } else {
      setWrong([...wrong, y]);
      play("wrong", sound);
    }
  };

  const nudge = done
    ? undefined
    : waiting
      ? wrong.length
        ? "Look down the y row: each time x goes up 1, y goes up by the same amount."
        : `What will come out for $x = ${x}$? Look for the pattern in the table.`
      : fed < shown
        ? "Tap the glowing number to feed it into the machine."
        : "Now you say what comes out. Feed in the next number.";

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <div className="machine" aria-label="A function machine">
          <div className="machine-hopper">
            {inputs.map((input, i) => (
              <button
                key={input}
                type="button"
                className={`ul-chip machine-in${i < fed ? " used" : i === fed && !waiting ? " next" : ""}`}
                disabled={i !== fed || waiting}
                onClick={feed}
              >
                <span className="visually-hidden">Feed in x = </span>
                {fmt(input)}
              </button>
            ))}
          </div>
          <div className={`machine-box${waiting ? " busy" : ""}${done ? " open" : ""}`}>
            <span className="machine-port">x</span>
            <span className="machine-rule">
              {done ? <W text={tex(rule)} /> : <span aria-label="a hidden rule">?</span>}
            </span>
            <span className="machine-port">y</span>
          </div>
          <div className="machine-out" aria-live="polite">
            {waiting && x !== undefined ? (
              <div
                className="machine-choices"
                role="group"
                aria-label={`What comes out for x = ${x}?`}
              >
                {machineChoices(screen, x).map((y) => (
                  <button
                    key={y}
                    type="button"
                    className={`ul-chip${wrong.includes(y) ? " tried" : ""}`}
                    disabled={wrong.includes(y)}
                    onClick={() => choose(y)}
                  >
                    {fmt(y)}
                  </button>
                ))}
              </div>
            ) : last !== undefined ? (
              <p className="machine-result" key={last}>
                {fmt(last)} → <strong>{fmt(yOn(rule, last))}</strong>
              </p>
            ) : (
              <p className="machine-result muted">Nothing out yet</p>
            )}
          </div>
        </div>
        <table className="ul-table">
          <tbody>
            <tr>
              <th scope="row">x</th>
              {inputs.map((input) => (
                <td key={input}>{fmt(input)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">y</th>
              {inputs.map((input, i) => (
                <td key={input} className={i < fed ? "filled" : undefined}>
                  {i < fed ? fmt(yOn(rule, input)) : waiting && i === fed ? "?" : ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </main>
      {done ? (
        <Verdict
          right
          text={`The machine’s rule is ${tex(rule)}. Each time x goes up 1, y goes ${rule.m < 0 ? "down" : "up"} ${Math.abs(rule.m)}.`}
          family={family}
          seed={inputs.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working note={nudge} />
      )}
    </>
  );
}

function PlotStep({ screen, family, sound, onNext }: Step<Plot>) {
  const { targets, scene } = screen;
  const [placed, setPlaced] = useState<Point[]>([]);
  const [miss, setMiss] = useState<Point>();
  const [hint, setHint] = useState(false);
  const [shown, setShown] = useState<Point>();
  const done = placed.length === targets.length;
  useChime(done, sound);

  const tap = (p: Point) => {
    if (done || placed.some((q) => samePoint(p, q))) return;
    if (targets.some((t) => samePoint(t, p))) {
      setPlaced([...placed, p]);
      setMiss(undefined);
      if (shown && samePoint(shown, p)) setShown(undefined);
      if (placed.length + 1 < targets.length) play("right", sound);
    } else {
      setMiss(p);
      setHint(true);
      play("wrong", sound);
    }
  };
  const showMe = () => setShown(targets.find((t) => !placed.some((q) => samePoint(q, t))));

  // Steps join the pupil's own points, left to right, when plotting from an equation.
  const mine = [...placed].sort((a, b) => a.x - b.x);
  const steps = screen.rule ? mine : sceneProps(scene).steps;
  const lines: GraphLine[] = [
    ...(scene.lines ?? []).map((rule): GraphLine => ({ rule })),
    ...(done && screen.rule ? [{ rule: screen.rule, tone: "right" as const }] : []),
  ];
  const points: GraphPoint[] = [
    ...(scene.points ?? []).map((at): GraphPoint => ({ at })),
    ...(shown ? [{ at: shown, tone: "hint" as const }] : []),
    ...placed.map((at): GraphPoint => ({ at, tone: "mine" })),
    ...(miss ? [{ at: miss, tone: "wrong" as const }] : []),
  ];

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        {screen.table && (
          <table className="ul-table">
            <tbody>
              <tr>
                <th scope="row">x</th>
                {targets.map((t) => (
                  <td key={t.x}>{fmt(t.x)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">y</th>
                {targets.map((t) => {
                  const done = placed.some((q) => samePoint(q, t));
                  return (
                    <td key={t.x} className={done ? "plotted" : undefined}>
                      {fmt(t.y)}
                      {done && <span className="visually-hidden"> (plotted)</span>}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        )}
        <LineGraph
          range={scene.range}
          lines={lines}
          points={points}
          steps={steps}
          onTap={tap}
          label={`${describeScene(scene)} Tap a point to plot it, or use the arrow keys and Enter. ${placed.length} of ${targets.length} plotted.`}
        />
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={targets.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={
            hint
              ? `${miss ? `${say(miss)} is not one of them. ` : ""}${screen.hint}`
              : `${placed.length} of ${targets.length} plotted.`
          }
        >
          {hint && (
            <button type="button" className="button" onClick={showMe}>
              Show me one
            </button>
          )}
        </Working>
      )}
    </>
  );
}

function ChoiceStep({ screen, family, sound, onNext }: Step<Choice>) {
  const [picked, setPicked] = useState<number>();
  const [checked, setChecked] = useState<number>();
  const [tried, setTried] = useState<number[]>([]);
  const option = checked === undefined ? undefined : screen.options[checked];
  const right = option?.correct === true;
  useEffect(() => {
    if (checked !== undefined && !right) play("wrong", sound);
  }, [checked, right, sound]);
  useChime(right, sound);
  const scene = right && screen.reveal ? screen.reveal : screen.scene;

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        {scene ? (
          <div
            className={right && screen.reveal ? "ul-reveal" : undefined}
            key={right ? "after" : "before"}
          >
            <LineGraph {...sceneProps(scene, right)} label={describeScene(scene)} />
          </div>
        ) : (
          <div className="ul-mystery" aria-hidden="true">
            <span>?</span>
          </div>
        )}
        <div className="ul-options" role="radiogroup" aria-label="Your answer">
          {screen.options.map((o, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={picked === i}
              className={`ul-option${picked === i ? " picked" : ""}${tried.includes(i) ? " tried" : ""}${right && o.correct ? " right" : ""}`}
              disabled={right || tried.includes(i)}
              onClick={() => setPicked(i)}
            >
              <W text={o.text} />
            </button>
          ))}
        </div>
      </main>
      {option ? (
        <Verdict
          right={right}
          text={option.feedback}
          family={family}
          seed={tried.length}
          action={right ? "Continue" : "Try again"}
          onAction={() => {
            if (right) return onNext();
            if (checked !== undefined) setTried([...tried, checked]);
            setChecked(undefined);
            setPicked(undefined);
          }}
        />
      ) : (
        <Working>
          <button
            type="button"
            className="button primary big"
            disabled={picked === undefined}
            onClick={() => setChecked(picked)}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

function SliderStep({ screen, family, sound, onNext }: Step<Slider>) {
  const { vary, start, star } = screen;
  const [value, setValue] = useState(start[vary]);
  const rule = { ...start, [vary]: value };
  const hit = onLine(rule, star);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (hit) setDone(true);
  }, [hit]);
  useChime(done, sound);

  const shownValue = vary === "m" ? fmt(value) : `${value < 0 ? "−" : "+"} ${Math.abs(value)}`;
  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        <p className="lesson-lead">
          <W text={screen.text} />
        </p>
        <LineGraph
          range={screen.range}
          lines={[
            ...(value !== start[vary] ? [{ rule: start, tone: "ghost" as const }] : []),
            { rule, tone: hit ? "right" : "main" },
          ]}
          star={star}
          points={vary === "c" ? [{ at: { x: 0, y: rule.c }, tone: "mine" }] : []}
          steps={
            vary === "m"
              ? [
                  { x: 0, y: rule.c },
                  { x: 1, y: rule.c + rule.m },
                ]
              : []
          }
          label={`The line ${ruleText(rule)} and a star at ${say(star)}.`}
        />
        <p className="ul-equation" aria-live="polite">
          {vary === "m" ? (
            <>
              y = <b className="live">{shownValue}</b>x {start.c < 0 ? "−" : "+"}{" "}
              {Math.abs(start.c)}
            </>
          ) : (
            <>
              y = {start.m === 1 ? "" : fmt(start.m)}x <b className="live">{shownValue}</b>
            </>
          )}
        </p>
        <label className="ul-slider">
          <span className="ul-slider-name">{vary}</span>
          <input
            type="range"
            min={screen.min}
            max={screen.max}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-valuetext={`${vary} = ${fmt(value)}`}
          />
          <span className="ul-slider-ends" aria-hidden="true">
            <span>{fmt(screen.min)}</span>
            <span>{fmt(screen.max)}</span>
          </span>
        </label>
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={value}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working note="Drag the slider until the line goes through the star." />
      )}
    </>
  );
}

function BuildStep({ screen, family, sound, onNext }: Step<Build>) {
  const { rule } = screen;
  const [m, setM] = useState<number>();
  const [c, setC] = useState<number>();
  const [checked, setChecked] = useState<Rule>();
  const right = checked !== undefined && checked.m === rule.m && checked.c === rule.c;
  useEffect(() => {
    if (checked && !right) play("wrong", sound);
  }, [checked, right, sound]);
  useChime(right, sound);

  const feedback = !checked
    ? ""
    : right
      ? `It is ${tex(rule)}. It crosses the y-axis at ${fmt(rule.c)}, and each 1 across goes ${rule.m < 0 ? "down" : "up"} ${Math.abs(rule.m)}.`
      : checked.m === rule.m
        ? "The steepness is right: your dashed line is parallel. Where does the line cross the y-axis?"
        : checked.c === rule.c
          ? "It does cross the y-axis there. Now count one step: 1 across, then how far up or down?"
          : screen.hint;
  const lines: GraphLine[] = [
    { rule, ...(right ? { tone: "right" as const } : {}) },
    ...(checked && !right ? [{ rule: checked, tone: "guess" as const }] : []),
  ];

  const slot = (value: number | undefined, sign: boolean) =>
    value === undefined ? "?" : sign ? `${value < 0 ? "−" : "+"} ${Math.abs(value)}` : fmt(value);

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        <LineGraph
          range={screen.range}
          lines={lines}
          label={`A grid showing a straight line through ${latticeOn(rule, screen.range).map(say).join(", ")}.`}
        />
        <p className="ul-equation build">
          y ={" "}
          <button
            type="button"
            className={`ul-slot${m === undefined ? " empty" : ""}`}
            onClick={() => setM(undefined)}
            disabled={right}
            aria-label={m === undefined ? "Gradient, empty" : `Gradient ${fmt(m)}, tap to clear`}
          >
            {slot(m, false)}
          </button>
          x{" "}
          <button
            type="button"
            className={`ul-slot${c === undefined ? " empty" : ""}`}
            onClick={() => setC(undefined)}
            disabled={right}
            aria-label={c === undefined ? "Intercept, empty" : `Intercept ${fmt(c)}, tap to clear`}
          >
            {slot(c, true)}
          </button>
        </p>
        <div className="ul-banks">
          <div className="ul-bank" role="group" aria-label="Gradient m">
            <span className="ul-bank-name">m</span>
            {screen.ms.map((v) => (
              <button
                key={v}
                type="button"
                className={`ul-chip${m === v ? " picked" : ""}`}
                disabled={right}
                onClick={() => {
                  setM(v);
                  setChecked(undefined);
                }}
              >
                {fmt(v)}
              </button>
            ))}
          </div>
          <div className="ul-bank" role="group" aria-label="Intercept c">
            <span className="ul-bank-name">c</span>
            {screen.cs.map((v) => (
              <button
                key={v}
                type="button"
                className={`ul-chip${c === v ? " picked" : ""}`}
                disabled={right}
                onClick={() => {
                  setC(v);
                  setChecked(undefined);
                }}
              >
                {fmt(v)}
              </button>
            ))}
          </div>
        </div>
      </main>
      {checked ? (
        <Verdict
          right={right}
          text={feedback}
          family={family}
          seed={rule.c}
          action={right ? "Continue" : "Try again"}
          onAction={() => (right ? onNext() : setChecked(undefined))}
        />
      ) : (
        <Working>
          <button
            type="button"
            className="button primary big"
            disabled={m === undefined || c === undefined}
            onClick={() => m !== undefined && c !== undefined && setChecked({ m, c })}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

function DragLineStep({ screen, family, sound, onNext }: Step<DragLine>) {
  const { rule } = screen;
  const [ends, setEnds] = useState<[Point, Point]>(screen.from);
  const [checked, setChecked] = useState<boolean | undefined>();
  const right = checked === true;
  useEffect(() => {
    if (checked === false) play("wrong", sound);
  }, [checked, sound]);
  useChime(right, sound);

  const theirs = ruleThrough(ends[0], ends[1]);
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  const feedback = right
    ? `That is ${tex(rule)}. It crosses the y-axis at ${fmt(rule.c)}, and goes ${rule.m < 0 ? "down" : "up"} ${Math.abs(rule.m)} for each 1 across.`
    : samePoint(ends[0], ends[1])
      ? "Both dots are on the same point. Pull them apart to make a line."
      : !theirs
        ? "That line goes straight up. Lines like $y = mx + c$ always lean across."
        : close(theirs.m, rule.m)
          ? `The steepness is right. Now slide it so it crosses the y-axis at ${fmt(rule.c)}.`
          : close(theirs.c, rule.c)
            ? `It crosses the y-axis in the right place. Now check the steepness: 1 across, ${Math.abs(rule.m)} ${rule.m < 0 ? "down" : "up"}.`
            : screen.hint;

  return (
    <>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        <LineGraph
          range={screen.range}
          through={ends}
          handles={right ? [] : ends}
          points={right ? ends.map((at): GraphPoint => ({ at, tone: "mine" })) : []}
          lines={right ? [{ rule, tone: "right" }] : []}
          {...(right
            ? {}
            : {
                onHandle: (i: number, p: Point) => {
                  setChecked(undefined);
                  setEnds((e) => (i === 0 ? [p, e[1]] : [e[0], p]));
                },
              })}
          label={`A line through two dots you can drag, at ${say(ends[0])} and ${say(ends[1])}. With the keyboard, move the cursor with the arrow keys and press 1 or 2 to put a dot there.`}
        />
      </main>
      {checked !== undefined ? (
        <Verdict
          right={right}
          text={feedback}
          family={family}
          seed={ends[0].x + 7}
          action={right ? "Continue" : "Try again"}
          onAction={() => (right ? onNext() : setChecked(undefined))}
        />
      ) : (
        <Working note="Drag the dots. The line follows them.">
          <button
            type="button"
            className="button primary big"
            onClick={() => setChecked(makesLine(rule, ends[0], ends[1]))}
          >
            Check
          </button>
        </Working>
      )}
    </>
  );
}

function UnitLessonEnd({
  lesson,
  ending,
  family,
  sound,
  onClose,
}: {
  lesson: UnitLesson;
  ending: UnitLessonEnding;
  family: Family;
  sound: boolean;
  onClose: () => void;
}) {
  const { xp, streak, today, goal } = ending;
  useEffect(() => play("done", sound), [sound]);
  return (
    <div className="lesson">
      <main className="lesson-main lesson-end">
        <Dot size={140} mood="cheer" family={family} />
        <h1>Lesson complete!</h1>
        <p className="lesson-lead">
          <W text={lesson.title} />
        </p>
        <p className="end-message">You are ready for the unit’s skills.</p>
        <dl className="end-stats">
          <div>
            <dt>XP</dt>
            <dd>
              <StarIcon size={22} /> +{xp}
            </dd>
          </div>
          {today >= goal ? (
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
