// The pupil's page: their progress at a glance, then their preferences, the example progress and a
// way to start again.
import type { CourseSection } from "@mathsplanner/core";
import { useState } from "react";
import { buildPath } from "./course.ts";
import { Dot } from "./Dot.tsx";
import { StarIcon, StreakIcon } from "./Icons.tsx";
import {
  DAILY_GOALS,
  levelOf,
  streak,
  THEMES,
  type Progress,
  type Settings,
  type Theme,
} from "./progress.ts";
import { levelsOf } from "./skills.ts";
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
  const nodes = buildPath(section, (s) => levelOf(progress, s), levelsOf).flatMap((u) => u.nodes);
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
      </dl>

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
          detail="A cheer for right answers, once lessons arrive."
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
