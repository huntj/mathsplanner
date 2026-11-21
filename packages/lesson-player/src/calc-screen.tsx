// Work it out as in an exercise book (docs/proposals/lesson-stepped.md): lines of working, each
// with a box to type the answer into, one line at a time. A done line shows its written reason;
// a wrong try gets Dot's hint, and after two the hint gives the answer.
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Calc } from "@mathsplanner/learning/unit-lessons";
import { PictureView } from "./Picture.tsx";
import { play } from "./sounds.ts";
import { matches, tidy } from "./unit-screens.tsx";
import { Title, useChime, Verdict, W, Working, type Step } from "./unit-ui.tsx";

const NUMBER = /^-?(\d+\.?\d*|\.\d+)$/;

export function CalcStep({ screen, family, sound, onNext }: Step<Calc>) {
  const [at, setAt] = useState(0);
  const [value, setValue] = useState("");
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string>();
  const input = useRef<HTMLInputElement>(null);
  const line = screen.lines[at];
  const done = !line;
  useChime(done, sound);
  // The box moves down to the next line once one is done.
  useEffect(() => {
    if (at > 0) input.current?.focus({ preventScroll: true });
  }, [at]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!line || !value.trim()) return;
    if (matches(value, line.answer)) {
      setAt(at + 1);
      setValue("");
      setTries(0);
      setHint(undefined);
      if (at + 1 < screen.lines.length) play("right", sound);
    } else {
      const t = tries + 1;
      setTries(t);
      setHint(t >= 2 ? `${line.hint} It's ${line.answer}.` : line.hint);
      play("wrong", sound);
    }
  };

  return (
    <form className="lesson-form" onSubmit={submit}>
      <main className="lesson-main">
        <Title title={screen.title} family={family} />
        {screen.text && (
          <p className="lesson-lead">
            <W text={screen.text} />
          </p>
        )}
        {screen.picture && <PictureView picture={screen.picture} />}
        <div className="ul-working calc-working" aria-live="polite">
          {screen.lines.slice(0, at + 1).map((l, i) => (
            <div key={i} className={`calc-line${i === at ? " now" : " done"}`}>
              <p className="calc-row">
                <W text={l.before} />
                {i < at ? (
                  <span className="calc-filled">{tidy(l.answer)}</span>
                ) : (
                  <label className="calc-box">
                    <span className="visually-hidden">Your answer</span>
                    <input
                      ref={input}
                      className="ul-input calc-input"
                      value={value}
                      inputMode={NUMBER.test(tidy(l.answer)) ? "decimal" : "text"}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </label>
                )}
                {l.after && <W text={l.after} />}
              </p>
              {i < at && l.reason && (
                <p className="worked-reason">
                  <W text={`(${l.reason})`} />
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
      {done ? (
        <Verdict
          right
          text={screen.done}
          family={family}
          seed={screen.lines.length}
          action="Continue"
          onAction={onNext}
        />
      ) : (
        <Working
          note={`Line ${at + 1} of ${screen.lines.length}: type the missing number.`}
          hint={hint}
          family={family}
        >
          <button type="submit" className="button primary big" disabled={!value.trim()}>
            Check
          </button>
        </Working>
      )}
    </form>
  );
}
