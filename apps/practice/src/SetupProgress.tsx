// Where the teacher is in setting up: the timetable, classes and their periods, homework, then
// schemes of work. Each done step is ticked and every step can be opened again.
import { setupProgress, type Workspace } from "./workspace.ts";

export type SetupStep = "timetable" | "classes" | "homework" | "schemes";

const STEPS: { step: SetupStep; name: string; href: string }[] = [
  { step: "timetable", name: "Your timetable", href: "#/welcome?step=1" },
  { step: "classes", name: "Classes", href: "#/timetable" },
  { step: "homework", name: "Homework", href: "#/homework" },
  { step: "schemes", name: "Schemes of work", href: "#/" },
];

export function SetupProgress({ ws, current }: { ws: Workspace | undefined; current: SetupStep }) {
  const progress = ws ? setupProgress(ws) : undefined;
  const done: Record<SetupStep, boolean> = {
    timetable: !!ws,
    classes: !!progress?.classes,
    homework: !!progress?.homework,
    schemes: !!progress?.schemes,
  };
  return (
    <nav className="setup-progress no-print" aria-label="Setting up">
      <ol>
        {STEPS.map(({ step, name, href }, i) => (
          <li key={step} className={done[step] ? "done" : undefined}>
            <a
              href={ws || i === 0 ? href : undefined}
              aria-current={step === current ? "step" : undefined}
            >
              <span className="step-number" aria-hidden="true">
                {done[step] ? "✓" : i + 1}
              </span>
              {name}
              {done[step] && <span className="visually-hidden"> (done)</span>}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
