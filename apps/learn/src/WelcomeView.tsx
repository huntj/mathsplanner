// The first visit: Dot says hello, then the pupil picks their year and a daily goal. Someone just
// looking can open the example progress instead, and a teacher can go straight into teacher mode
// with a year to look through.
import type { Stage } from "@mathsplanner/core";
import { useState } from "react";
import { sectionFor, YEARS, yearsReady } from "./course.ts";
import { Dot, Logo } from "./Dot.tsx";
import { TeacherIcon } from "./Icons.tsx";
import { DAILY_GOALS, type DailyGoal } from "./progress.ts";

const GOAL_WORDS: Record<DailyGoal, string> = {
  1: "Casual",
  2: "Regular",
  3: "Keen",
  5: "Super keen",
};

export function WelcomeView({
  onDone,
  onExample,
}: {
  onDone: (stage: Stage, goal: DailyGoal, teacher: boolean) => void;
  onExample: () => void;
}) {
  const [step, setStep] = useState(0);
  const [stage, setStage] = useState<Stage>();
  const [goal, setGoal] = useState<DailyGoal>(2);
  const [teacher, setTeacher] = useState(false);

  return (
    <main className="welcome">
      {step === 0 && (
        <section className="welcome-step" aria-labelledby="hello">
          <Logo size={30} />
          <Dot size={140} mood="cheer" />
          <h1 id="hello">Hi, I’m Dot!</h1>
          <p className="lead">
            I’ll help you practise maths a little every day, one skill at a time, all the way
            through school.
          </p>
          <div className="welcome-actions">
            <button type="button" className="button primary big" onClick={() => setStep(1)}>
              Get started
            </button>
            <button type="button" className="button big" onClick={onExample}>
              See an example
            </button>
            <button
              type="button"
              className="button link"
              onClick={() => {
                setTeacher(true);
                setStep(1);
              }}
            >
              <TeacherIcon size={18} /> I’m a teacher
            </button>
          </div>
          <p className="muted small">
            Your progress stays on this device. Nothing about you is sent anywhere.
          </p>
          <p className="test-note small">Test version · {yearsReady()} ready so far</p>
        </section>
      )}

      {step === 1 && (
        <section className="welcome-step" aria-labelledby="year">
          <Dot size={84} />
          <h1 id="year">
            {teacher ? "Which year would you like to look through?" : "Which year are you in?"}
          </h1>
          {teacher && (
            <p className="lead">
              Teacher mode opens every skill and review, and lets you try any level. You can switch
              it off, or change year, on the You page.
            </p>
          )}
          <div className="choices" role="radiogroup" aria-labelledby="year">
            {YEARS.map((y) => {
              const ready = sectionFor(y.stage) !== undefined;
              return (
                <button
                  key={y.stage}
                  type="button"
                  role="radio"
                  aria-checked={stage === y.stage}
                  className={`choice${stage === y.stage ? " chosen" : ""}`}
                  disabled={!ready}
                  onClick={() => setStage(y.stage)}
                >
                  <span>{y.name}</span>
                  {!ready && <span className="soon">Coming soon</span>}
                </button>
              );
            })}
          </div>
          <div className="welcome-actions">
            <button
              type="button"
              className="button primary big"
              disabled={!stage}
              onClick={() => (teacher && stage ? onDone(stage, goal, true) : setStep(2))}
            >
              Continue
            </button>
            <button
              type="button"
              className="button link"
              onClick={() => {
                setTeacher(false);
                setStep(0);
              }}
            >
              Back
            </button>
          </div>
        </section>
      )}

      {step === 2 && stage && (
        <section className="welcome-step" aria-labelledby="goal">
          <Dot size={84} />
          <h1 id="goal">How much practice a day?</h1>
          <p className="lead">A lesson takes about five minutes. You can change this later.</p>
          <div className="choices" role="radiogroup" aria-labelledby="goal">
            {DAILY_GOALS.map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={goal === g}
                className={`choice${goal === g ? " chosen" : ""}`}
                onClick={() => setGoal(g)}
              >
                <span>{GOAL_WORDS[g]}</span>
                <span className="choice-detail">
                  {g} {g === 1 ? "lesson" : "lessons"} · {g * 5} min
                </span>
              </button>
            ))}
          </div>
          <div className="welcome-actions">
            <button
              type="button"
              className="button primary big"
              onClick={() => onDone(stage, goal, false)}
            >
              Start learning
            </button>
            <button type="button" className="button link" onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export { GOAL_WORDS };
