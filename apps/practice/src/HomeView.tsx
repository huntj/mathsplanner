// The home page once the timetable is set up: where the year is, the next thing to set up, each
// class's scheme of work, and the backup. (When every class is planned, this becomes the
// dashboard of the week.)
import { useState } from "react";
import type { Navigate } from "./SchemeDialogs.tsx";
import { courseById } from "./scheme.ts";
import { SetupProgress } from "./SetupProgress.tsx";
import { className, Swatch } from "./TimetableGrid.tsx";
import {
  readWorkspaceFile,
  setupProgress,
  today,
  whereWeAre,
  workspaceFile,
  type Workspace,
} from "./workspace.ts";

export function HomeView({
  ws,
  save,
  clear,
  navigate,
}: {
  ws: Workspace;
  save: (ws: Workspace) => void;
  clear: () => void;
  navigate: Navigate;
}) {
  const progress = setupProgress(ws);
  const [error, setError] = useState("");
  const current = !progress.classes ? "classes" : !progress.homework ? "homework" : "schemes";

  const download = () => {
    const url = URL.createObjectURL(new Blob([workspaceFile(ws)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mathsplanner-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="setup-page">
      <SetupProgress ws={ws} current={current} />
      <h1>Your planner</h1>
      <p className="lede">{whereWeAre(ws, today())}</p>

      {!progress.classes ? (
        <NextStep
          title="Add your classes"
          text="Add each class you teach and click the lessons you teach it in."
          button="Add your classes"
          onClick={() => navigate({ page: "timetable" })}
        />
      ) : !progress.homework ? (
        <NextStep
          title="Choose your homework lessons"
          text="For each class, choose the lesson homework is set in and the one it's handed in."
          button="Choose homework lessons"
          onClick={() => navigate({ page: "homework" })}
        />
      ) : (
        <section className="next-step">
          <h2>Plan what each class learns</h2>
          <p>
            Choose the topics for each half-term, and MathsPlanner suggests the learning objectives,
            with what the class needs from earlier years. Each lesson then gets its own objectives
            and questions.
          </p>
          <ul className="class-plans">
            {ws.classes.map((c) => {
              const planned = c.scheme.halfTerms.filter((h) => h.items.length > 0).length;
              const course = courseById.get(c.scheme.course);
              const status =
                planned === 0
                  ? "Nothing planned yet"
                  : planned === c.scheme.halfTerms.length
                    ? "Every half-term planned"
                    : `${planned} of ${c.scheme.halfTerms.length} half-terms planned`;
              return (
                <li key={c.id}>
                  <Swatch cls={c} />
                  <span>
                    <strong>{className(c)}</strong>{" "}
                    <span className="muted small">
                      {course?.name} · {status}
                    </span>
                  </span>
                  <button
                    type="button"
                    className={planned === 0 ? "primary" : undefined}
                    onClick={() => navigate({ page: "class", id: c.id })}
                  >
                    {planned === 0 ? "Start planning" : "Open the plan"}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="muted small">
            Once every class has a plan, this page shows your week: its lessons, topics, homework
            and tests.
          </p>
        </section>
      )}

      <section className="backup">
        <h2>Your set-up</h2>
        <p className="muted small">
          Everything is kept in this browser. Download a backup now and then, and to use your
          planner on another computer, open the backup there.
        </p>
        <div className="session-buttons">
          <button type="button" onClick={download}>
            Download a backup
          </button>
          <label className="file-button">
            <input
              type="file"
              accept=".json,application/json"
              className="visually-hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  const next = readWorkspaceFile(await file.text());
                  if (window.confirm("Replace your set-up in this browser with the backup?")) {
                    save(next);
                    setError("");
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : String(err));
                }
              }}
            />
            Open a backup
          </label>
          <button type="button" onClick={() => navigate({ page: "welcome", step: 1 })}>
            Timetable settings
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Delete your timetable, classes and plans from this browser? Download a backup first if you might want them again.",
                )
              )
                clear();
            }}
          >
            Start again
          </button>
        </div>
        {error && <p className="banner error">{error}</p>}
      </section>
    </div>
  );
}

function NextStep({
  title,
  text,
  button,
  onClick,
}: {
  title: string;
  text: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <section className="next-step">
      <h2>Next: {title.toLowerCase()}</h2>
      <p>{text}</p>
      <button type="button" className="primary big" onClick={onClick}>
        {button} →
      </button>
    </section>
  );
}
