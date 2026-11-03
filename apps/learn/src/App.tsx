// Learn Maths: the first visit, the path, lessons, practice and the pupil's page. Progress is kept
// in this browser and saved after every change. Views are named in the address (#welcome,
// #practise, #you), so the back button works; the path is the start view.
import type { Stage } from "@mathsplanner/core";
import { useEffect, useState } from "react";
import { course, sectionFor, skillText } from "./course.ts";
import { exampleProgress } from "./example.ts";
import { planLesson, type LessonPlan, type LessonSummary } from "./lesson.ts";
import { LessonView, type LessonEnding } from "./LessonView.tsx";
import {
  PathIcon,
  PersonIcon,
  RefreshIcon,
  SnowflakeIcon,
  StarIcon,
  StreakIcon,
  TeacherIcon,
} from "./Icons.tsx";
import { PathView, type Selection } from "./PathView.tsx";
import {
  finishLesson as recordLesson,
  mistakesPlan,
  mistakesToFix,
  refreshPlan,
  reviewPlan,
  speedPlan,
  unitPlan,
  yearPlan,
} from "./practice.ts";
import { PractiseView, type PracticeStart } from "./PractiseView.tsx";
import {
  dayKey,
  levelOf,
  emptyProgress,
  lessonsOn,
  loadProgress,
  rememberForms,
  saveProgress,
  streak,
  withSettings,
  type DailyGoal,
  type Progress,
  type Settings,
} from "./progress.ts";
import { settleStreak } from "./rewards.ts";
import { SkillSheet, type Start } from "./SkillSheet.tsx";
import { levelsOf, misconceptionsOf, skillsShowing } from "./skills.ts";
import { WelcomeView } from "./WelcomeView.tsx";
import { YouView } from "./YouView.tsx";

type View = "path" | "welcome" | "practise" | "you";

const viewFromHash = (): View => {
  const name = location.hash.replace(/^#\/?/, "");
  return name === "welcome" || name === "practise" || name === "you" ? name : "path";
};

const newSeed = () => 1 + Math.floor(Math.random() * 2_147_483_000);

/** Makes a lesson from a seed; undefined when there is nothing to practise. */
type Make = (seed: number) => LessonPlan | undefined;

/** The theme the page was opened with (a host page may set one), kept when "Match device" is chosen. */
const initialTheme = document.documentElement.getAttribute("data-theme");

function GoalRing({ done, goal }: { done: number; goal: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  const part = Math.min(done / goal, 1);
  return (
    <svg className="goal-ring" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} className="goal-track" />
      <circle
        cx="12"
        cy="12"
        r={r}
        className="goal-fill"
        strokeDasharray={`${part * c} ${c}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

export function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [view, setView] = useState<View>(viewFromHash);
  const [selection, setSelection] = useState<Selection>();
  /** The lesson being played, how to make another like it (for "Try again"), and its ending. */
  const [lesson, setLesson] = useState<{ plan: LessonPlan; make: Make; ending?: LessonEnding }>();
  const today = dayKey(new Date());
  // Freezes spent on missed days when the app opened, to say so once.
  const [frozeDays, setFrozeDays] = useState(0);

  // On opening, and when the day changes: spend freezes on missed days to keep the streak going.
  useEffect(() => {
    setProgress((p) => {
      const settled = settleStreak(p, today);
      if (settled.used) setFrozeDays(settled.used);
      return settled.progress;
    });
  }, [today]);

  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const theme = progress.settings.theme;
  useEffect(() => {
    const root = document.documentElement;
    if (theme !== "system") root.setAttribute("data-theme", theme);
    else if (initialTheme) root.setAttribute("data-theme", initialTheme);
    else root.removeAttribute("data-theme");
  }, [theme]);

  const go = (next: View) => {
    location.hash = next === "path" ? "" : next;
    setView(next);
    scrollTo({ top: 0 });
  };

  const section = sectionFor(progress.settings.stage);
  const showExample = () => {
    // The example is of the pilot year, whichever year the pupil chose.
    const pilot = sectionFor("Y7") ?? course.sections[0];
    if (!pilot) return;
    setProgress(withSettings(exampleProgress(pilot, levelsOf, today, misconceptionsOf), { theme }));
    go("path");
  };

  /** Starts a lesson made with a fresh seed, keeping the recipe for "Try again". */
  const begin = (make: Make) => {
    const plan = make(newSeed());
    if (!plan || plan.items.length === 0) return;
    setSelection(undefined);
    setLesson({ plan, make });
    scrollTo({ top: 0 });
  };

  /** A lesson from a sheet on the path. */
  const startFromPath = (start: Start) => {
    if (!section) return;
    if (start.kind === "skill") {
      // Review questions come from the skills already finished in this year.
      const reviewFrom = section.units
        .flatMap((u) => u.skills)
        .filter((s) => s !== start.skill && levelOf(progress, s) >= levelsOf(s).pathLevels)
        .map((s) => ({ skill: s, info: levelsOf(s) }));
      const info = levelsOf(start.skill);
      // A level a teacher picked, or the skill's next one.
      const done = start.level ? start.level - 1 : levelOf(progress, start.skill);
      const picked = start.level ? { picked: true as const } : {};
      begin((seed) => ({ ...planLesson(start.skill, info, done, reviewFrom, seed), ...picked }));
    } else if (start.kind === "refresh")
      begin((seed) => refreshPlan(start.skill, skillText(start.skill), levelsOf, seed));
    else if (start.kind === "unit") begin((seed) => unitPlan(start.unit, levelsOf, seed));
    else begin((seed) => yearPlan(progress, section, levelsOf, seed));
  };

  /** A lesson from the Practise tab. */
  const startPractice = (start: PracticeStart) => {
    if (!section) return;
    if (start.kind === "review")
      begin((seed) => reviewPlan(progress, section, levelsOf, today, seed));
    else if (start.kind === "unit") begin((seed) => unitPlan(start.unit, levelsOf, seed));
    else if (start.kind === "speed") begin((seed) => speedPlan(progress, section, levelsOf, seed));
    else
      begin((seed) =>
        mistakesPlan(mistakesToFix(progress, section, skillsShowing), levelsOf, seed),
      );
  };

  const finishLesson = (summary: LessonSummary, shown: Record<string, string[]>) => {
    if (!lesson) return;
    const recorded = recordLesson(progress, lesson.plan, summary, levelsOf, today);
    const { message, badges, freeze } = recorded;
    const next = rememberForms(recorded.progress, shown);
    setProgress(next);
    setLesson({
      ...lesson,
      ending: {
        summary,
        message,
        streak: streak(next, today),
        today: lessonsOn(next, today),
        goal: next.settings.dailyGoal,
        badges,
        freeze,
      },
    });
  };

  if (lesson && section) {
    return (
      <LessonView
        key={lesson.plan.items[0]?.seed}
        plan={lesson.plan}
        ending={lesson.ending}
        challenge={progress.settings.challenge}
        recent={[...new Set(lesson.plan.items.flatMap((i) => progress.recent[i.skill] ?? []))]}
        sound={progress.settings.sound}
        onComplete={finishLesson}
        onRetry={() => begin(lesson.make)}
        onClose={() => setLesson(undefined)}
      />
    );
  }

  if (!section || view === "welcome") {
    return (
      <WelcomeView
        onDone={(stage: Stage, dailyGoal: DailyGoal, teacher: boolean) => {
          setProgress((p) =>
            withSettings(p.example ? emptyProgress() : p, { stage, dailyGoal, teacher }),
          );
          go("path");
        }}
        onExample={showExample}
      />
    );
  }

  const done = lessonsOn(progress, today);
  const goal = progress.settings.dailyGoal;
  const days = streak(progress, today);

  return (
    <div className="app">
      <header className="top-bar">
        <div className="top-left">
          <button type="button" className="year-chip" onClick={() => go("you")}>
            {section.name}
          </button>
          {progress.settings.teacher && (
            <button type="button" className="teacher-chip" onClick={() => go("you")}>
              <TeacherIcon size={16} />
              Teacher
            </button>
          )}
        </div>
        <div className="top-stats">
          <span className="stat streak" title="Days in a row you met your goal">
            <StreakIcon size={20} />
            {days}
            <span className="visually-hidden"> day streak</span>
          </span>
          <span className="stat xp">
            <StarIcon size={20} />
            {progress.xp}
            <span className="visually-hidden"> XP</span>
          </span>
          <span className="stat goal">
            <GoalRing done={done} goal={goal} />
            {Math.min(done, goal)}/{goal}
            <span className="visually-hidden"> lessons today</span>
          </span>
        </div>
      </header>

      {frozeDays > 0 && (
        <div className="freeze-banner" role="status">
          <SnowflakeIcon size={22} />
          <p>
            Dot used {frozeDays === 1 ? "a streak freeze" : `${frozeDays} streak freezes`} to keep
            your streak going.
          </p>
          <button type="button" className="button small-button" onClick={() => setFrozeDays(0)}>
            OK
          </button>
        </div>
      )}

      {progress.example && view === "path" && (
        <div className="example-banner" role="note">
          <p>
            <strong>Example progress.</strong> This is {section.name} about halfway through.
          </p>
          <button
            type="button"
            className="button small-button"
            onClick={() => {
              setProgress(withSettings(emptyProgress(), { theme }));
              go("welcome");
            }}
          >
            Start my own
          </button>
        </div>
      )}

      {view === "practise" ? (
        <PractiseView section={section} progress={progress} today={today} onStart={startPractice} />
      ) : view === "you" ? (
        <YouView
          section={section}
          progress={progress}
          today={today}
          onSettings={(s: Partial<Settings>) => setProgress((p) => withSettings(p, s))}
          onExample={showExample}
          onReset={() => {
            setProgress(withSettings(emptyProgress(), { theme }));
            go("welcome");
          }}
        />
      ) : (
        <main>
          <PathView section={section} progress={progress} today={today} onSelect={setSelection} />
        </main>
      )}

      <nav className="tabs" aria-label="Main">
        <button
          type="button"
          className={view === "path" ? "on" : undefined}
          aria-current={view === "path" ? "page" : undefined}
          onClick={() => go("path")}
        >
          <PathIcon />
          Path
        </button>
        <button
          type="button"
          className={view === "practise" ? "on" : undefined}
          aria-current={view === "practise" ? "page" : undefined}
          onClick={() => go("practise")}
        >
          <RefreshIcon />
          Practise
        </button>
        <button
          type="button"
          className={view === "you" ? "on" : undefined}
          aria-current={view === "you" ? "page" : undefined}
          onClick={() => go("you")}
        >
          <PersonIcon />
          You
        </button>
      </nav>

      <SkillSheet
        selection={selection}
        teacher={progress.settings.teacher}
        onClose={() => setSelection(undefined)}
        onStart={startFromPath}
      />
    </div>
  );
}
