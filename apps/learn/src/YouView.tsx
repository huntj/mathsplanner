// The pupil's page: their progress at a glance, then their preferences, the example progress and a
// way to start again.
import type { CourseSection, Stage } from "@mathsplanner/core";
import { useState } from "react";
import { BadgeMark } from "@mathsplanner/lesson-player";
import { sectionFor, YEARS, yearsReady } from "@mathsplanner/learning";
import { Dot } from "@mathsplanner/lesson-player";
import { FEEDBACK_URL } from "./feedback.ts";
import { BADGES, FREEZE_EVERY } from "@mathsplanner/learning";
import { pathFor } from "@mathsplanner/learning";
import { SnowflakeIcon, StarIcon, StreakIcon } from "@mathsplanner/lesson-player";
import {
  DAILY_GOALS,
  MAX_FREEZES,
  streak,
  THEMES,
  type Progress,
  type Settings,
  type Theme,
} from "@mathsplanner/learning";
import { GOAL_WORDS } from "./WelcomeView.tsx";

const THEME_WORDS: Record<Theme, string> = { system: "Match device", light: "Light", dark: "Dark" };

function Switch({
  id,
  label,
  detail,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  detail: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <div className="pref">
      <label htmlFor={id} className="pref-text">
        <strong>{label}</strong>
        <span className="muted">{detail}</span>
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

export function YouView({
  section,
  progress,
  today,
  onSettings,
  onExample,
  onReset,
}: {
  section: CourseSection;
  progress: Progress;
  today: string;
  onSettings: (settings: Partial<Settings>) => void;
  onExample: () => void;
  onReset: () => void;
}) {
  const [confirm, setConfirm] = useState<"reset" | "example">();
  const nodes = pathFor(section, progress, today).flatMap((u) => u.nodes);
  const finished = nodes.filter((n) => n.level >= n.info.pathLevels).length;
  const mastered = nodes.filter((n) => n.state === "mastered" || n.state === "legendary").length;
  const settings = progress.settings;

  return (
    <main className="you">
      <header className="you-head">
        <Dot size={72} />
        <div>
          <h1>{section.name}</h1>
          <p className="muted">
            {progress.example ? "Example progress" : "Your progress, kept on this device"}
          </p>
        </div>
      </header>

      <dl className="stats">
        <div>
          <dt>Streak</dt>
          <dd>
            <StreakIcon size={20} /> {streak(progress, today)}{" "}
            {streak(progress, today) === 1 ? "day" : "days"}
          </dd>
        </div>
        <div>
          <dt>XP</dt>
          <dd>
            <StarIcon size={20} /> {progress.xp}
          </dd>
        </div>
        <div>
          <dt>Skills finished</dt>
          <dd>
            {finished} of {nodes.length}
          </dd>
        </div>
        <div>
          <dt>Mastered</dt>
          <dd>{mastered}</dd>
        </div>
        <div>
          <dt>Streak freezes</dt>
          <dd>
            <SnowflakeIcon size={20} /> {progress.freezes} of {MAX_FREEZES}
          </dd>
        </div>
        <div>
          <dt>Speed round best</dt>
          <dd>{progress.speedBest > 0 ? `${progress.speedBest} right` : "None yet"}</dd>
        </div>
      </dl>

      <p className="muted small freeze-help">
        Every {FREEZE_EVERY} days of streak earns a streak freeze, up to {MAX_FREEZES}. If you miss
        a day, Dot uses one to keep your streak going.
      </p>

      <section className="card" aria-labelledby="badges-title">
        <h2 id="badges-title">
          Badges{" "}
          <span className="muted small">
            {Object.keys(progress.badges).length} of {BADGES.length}
          </span>
        </h2>
        <ul className="badges">
          {BADGES.map((b) => {
            const earned = b.id in progress.badges;
            return (
              <li key={b.id} className={earned ? "earned" : undefined}>
                <BadgeMark badge={b} earned={earned} />
                <strong>{b.name}</strong>
                <span className="muted small">{b.how}</span>
                <span className="visually-hidden">{earned ? "Earned" : "Not earned yet"}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="prefs" aria-labelledby="prefs">
        <h2 id="prefs">Preferences</h2>

        <fieldset className="pref-group">
          <legend>Daily goal</legend>
          <div className="segmented">
            {DAILY_GOALS.map((g) => (
              <label key={g} className={settings.dailyGoal === g ? "on" : undefined}>
                <input
                  type="radio"
                  name="goal"
                  id={`goal-${g}`}
                  checked={settings.dailyGoal === g}
                  onChange={() => onSettings({ dailyGoal: g })}
                />
                <span>{GOAL_WORDS[g]}</span>
                <span className="muted small">{g} a day</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pref-group">
          <label htmlFor="year-select" className="pref-label">
            Year
          </label>
          <select
            id="year-select"
            className="select"
            value={settings.stage ?? section.stage}
            onChange={(e) => onSettings({ stage: e.target.value as Stage })}
          >
            {YEARS.filter((y) => sectionFor(y.stage)).map((y) => (
              <option key={y.stage} value={y.stage}>
                {y.name}
              </option>
            ))}
          </select>
          <span className="muted small">Your progress in every year is kept when you switch.</span>
        </div>

        <fieldset className="pref-group">
          <legend>Colours</legend>
          <div className="segmented three">
            {THEMES.map((t) => (
              <label key={t} className={settings.theme === t ? "on" : undefined}>
                <input
                  type="radio"
                  name="theme"
                  id={`theme-${t}`}
                  checked={settings.theme === t}
                  onChange={() => onSettings({ theme: t })}
                />
                <span>{THEME_WORDS[t]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Switch
          id="sound"
          label="Sounds"
          detail="A chime for right answers and a tune when you finish a lesson."
          checked={settings.sound}
          onChange={(sound) => onSettings({ sound })}
        />
        <Switch
          id="challenge"
          label="Challenge mode"
          detail="Start each lesson with three hearts and earn double XP if you keep one."
          checked={settings.challenge}
          onChange={(challenge) => onSettings({ challenge })}
        />
        <Switch
          id="teacher"
          label="Teacher mode"
          detail="Opens every skill, unit review and year review, and lets you try any level of a skill. For teachers looking through the course."
          checked={settings.teacher}
          onChange={(teacher) => onSettings({ teacher })}
        />
      </section>

      <section className="card test-version" aria-labelledby="test-version">
        <h2 id="test-version">About this test version</h2>
        <p className="muted">
          Learn Maths is new. Only {yearsReady()} ready so far, and other years will follow. Your
          progress is kept in this browser on this device, so it will not follow you to another
          device, and clearing your browsing data clears it.
        </p>
        {FEEDBACK_URL && (
          <a className="button" href={FEEDBACK_URL} target="_blank" rel="noreferrer">
            Tell us what you think
          </a>
        )}
      </section>

      <section className="danger" aria-labelledby="start-again">
        <h2 id="start-again">{progress.example ? "Example progress" : "Start again"}</h2>
        {progress.example ? (
          <>
            <p className="muted">
              You are looking at example progress: about halfway through {section.name}.
            </p>
            <button type="button" className="button primary" onClick={onReset}>
              Start my own progress
            </button>
          </>
        ) : confirm ? (
          <div className="confirm">
            <p>
              {confirm === "reset"
                ? "This clears your levels, XP and streak on this device. It cannot be undone."
                : "This replaces your progress with the example. Your own progress will be cleared."}
            </p>
            <div className="row">
              <button
                type="button"
                className="button danger-button"
                onClick={() => {
                  setConfirm(undefined);
                  if (confirm === "reset") onReset();
                  else onExample();
                }}
              >
                {confirm === "reset" ? "Clear my progress" : "Show the example"}
              </button>
              <button type="button" className="button" onClick={() => setConfirm(undefined)}>
                Keep my progress
              </button>
            </div>
          </div>
        ) : (
          <div className="row">
            <button type="button" className="button" onClick={() => setConfirm("example")}>
              Show example progress
            </button>
            <button type="button" className="button" onClick={() => setConfirm("reset")}>
              Clear my progress
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
