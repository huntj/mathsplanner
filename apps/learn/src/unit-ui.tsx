// The parts every unit lesson screen shares: words with maths, a heading with Dot, the panel at
// the foot, and a chime when a screen is done.
import { renderRich } from "@mathsplanner/render";
import { useEffect, type ReactNode } from "react";
import { Dot } from "./Dot.tsx";
import type { Family } from "./families.ts";
import { play } from "./sounds.ts";
import { ruleText, type Point, type Rule } from "./unit-lessons/index.ts";

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
export function Title({
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
export function Working({ children, note }: { children?: ReactNode; note?: string | undefined }) {
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
export function useChime(when: boolean, sound: boolean) {
  useEffect(() => {
    if (when) play("right", sound);
  }, [when, sound]);
}
