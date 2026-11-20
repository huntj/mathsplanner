// The parts every unit lesson screen shares: words with maths, a heading with Dot, the panel at
// the foot, and a chime when a screen is done.
import { renderRich } from "@mathsplanner/render";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { Dot } from "./Dot.tsx";
import type { Family } from "@mathsplanner/learning";
import { play } from "./sounds.ts";
import {
  ruleText,
  type Point,
  type Rule,
  type WorkingLine,
} from "@mathsplanner/learning/unit-lessons";

export const CHEERS = ["Brilliant!", "Nice one!", "Spot on!", "Great work!", "You got it!", "Yes!"];

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

/** Words as HTML: maths between dollar signs, and **bold**. */
export function wordsHtml(words: string): string {
  return words
    .split("$")
    .map((part, i) =>
      i % 2
        ? // Fractions full size, as a pupil writes them, not shrunk to fit the line.
          renderRich([{ t: "math", v: part.replace(/\\frac/g, "\\dfrac") }])
        : part
            .replace(/[&<>"]/g, (ch) => ESCAPES[ch] ?? ch)
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
    )
    .join("");
}

export function W({ text, className }: { text: string; className?: string }) {
  return (
    <span
      {...(className ? { className } : {})}
      dangerouslySetInnerHTML={{ __html: wordsHtml(text) }}
    />
  );
}

export const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));
export const tex = (rule: Rule) => `$${ruleText(rule, "-")}$`;
export const say = (p: Point) => `(${fmt(p.x)}, ${fmt(p.y)})`;

/** Props every screen takes. */
export interface Step<S> {
  screen: S;
  family: Family;
  sound: boolean;
  onNext: () => void;
}

/** A screen's heading, with Dot. */
/** What the screen being shown is for ("Warm-up", "Your turn"…), shown over its title. */
export const ScreenTag = createContext<string | undefined>(undefined);

export function Title({
  title,
  family,
  eyebrow,
}: {
  title: string;
  family: Family;
  eyebrow?: string | undefined;
}) {
  const tag = useContext(ScreenTag);
  eyebrow ??= tag;
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
/**
 * Dot saying something that explains, in a bubble: set apart from the question and the working,
 * so a pupil can tell what they need to answer from what only explains.
 */
export function DotBubble({ text, family }: { text: string; family: Family }) {
  return (
    <div className="dot-bubble">
      <Dot size={30} family={family} />
      <p className="dot-bubble-text">
        <span className="visually-hidden">Dot says: </span>
        <W text={text} />
      </p>
    </div>
  );
}

/**
 * A line of working: the maths, the reason a pupil writes for it (in the working, as in a model
 * answer), and Dot's explainer beside it. Older lessons give a single `why` under the line.
 */
export function WorkingStep({
  step,
  family,
  className,
}: {
  step: WorkingLine;
  family: Family;
  className?: string | undefined;
}) {
  return (
    <div className={`worked-step${className ? ` ${className}` : ""}`}>
      <p className="worked-line">
        <W text={step.line} />
      </p>
      {step.reason && (
        <p className="worked-reason">
          <W text={`(${step.reason})`} />
        </p>
      )}
      {step.why && (
        <p className="worked-why">
          <W text={step.why} />
        </p>
      )}
      {step.note && <DotBubble text={step.note} family={family} />}
    </div>
  );
}

export function Verdict({
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
          {/* Dot gives the hint or the feedback, in a bubble. */}
          <div className="verdict-say">
            <Dot size={44} mood={right ? "cheer" : "oops"} family={family} />
            <div className="verdict-bubble">
              <h2>{right ? CHEERS[Math.abs(seed) % CHEERS.length] : "Not quite"}</h2>
              {text && (
                <p className="ul-feedback">
                  <W text={text} />
                </p>
              )}
            </div>
          </div>
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

/** The foot while a screen is being worked on: a nudge or Dot's hint, and any buttons. */
export function Working({
  children,
  note,
  hint,
  family,
}: {
  children?: ReactNode;
  note?: string | undefined;
  /** A hint after a wrong try, from Dot in a bubble, in place of the nudge. */
  hint?: string | undefined;
  family?: Family | undefined;
}) {
  return (
    <footer className="lesson-foot">
      <div className="lesson-foot-inner">
        {hint && family ? (
          <div role="status">
            <DotBubble text={hint} family={family} />
          </div>
        ) : (
          note && (
            <p className="ul-nudge" role="status">
              <W text={note} />
            </p>
          )
        )}
        {children && <div className="check-row">{children}</div>}
      </div>
    </footer>
  );
}

/** Plays a sound once, when `when` turns true. */
export function useChime(when: boolean, sound: boolean) {
  useEffect(() => {
    if (when) play("right", sound);
  }, [when, sound]);
}
