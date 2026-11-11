// The Practise tab: a review of what is due (or extra practice once nothing is), the pupil's own
// mistakes to fix, the unit reviews waiting, and how well the year's finished skills are
// remembered.
import type { CourseSection, CourseUnit } from "@mathsplanner/core";
import { skillText } from "@mathsplanner/learning";
import { Dot } from "@mathsplanner/lesson-player";
import { familyOf } from "@mathsplanner/learning";
import { ClockIcon, FamilyIcon, RefreshIcon, ReviewIcon } from "@mathsplanner/lesson-player";
import { SPEED_SECONDS } from "@mathsplanner/learning";
import { memoryOf, strengthOf, type Strength } from "@mathsplanner/learning";
import { describeMisconception } from "@mathsplanner/learning";
import { pathFor } from "@mathsplanner/learning";
import { dueIn, finishedSkills, mistakesToFix, MISTAKES_AT_ONCE } from "@mathsplanner/learning";
import type { Progress } from "@mathsplanner/learning";
import { levelsOf, skillsShowing } from "@mathsplanner/learning";

export type PracticeStart =
  | { kind: "review" }
  | { kind: "mistakes" }
  | { kind: "speed" }
  | { kind: "unit"; unit: CourseUnit };

const STRENGTHS: { key: Strength; name: string; detail: string }[] = [
  { key: "due", name: "Due", detail: "ready for review" },
  { key: "fresh", name: "Fresh", detail: "learnt recently" },
  { key: "strong", name: "Strong", detail: "remembered for weeks" },
  { key: "solid", name: "Rock solid", detail: "remembered for months" },
];

const times = (n: number) => (n === 1 ? "once" : n === 2 ? "twice" : `${n} times`);

export function PractiseView({
  section,
  progress,
  today,
  onStart,
}: {
  section: CourseSection;
  progress: Progress;
  today: string;
  onStart: (start: PracticeStart) => void;
}) {
  const due = dueIn(progress, section, levelsOf, today);
  const finished = finishedSkills(progress, section, levelsOf);
  const mistakes = mistakesToFix(progress, section, skillsShowing);
  const openReviews = pathFor(section, progress, today).filter((u) => u.review === "open");
  const counts: Record<Strength, number> = { due: 0, fresh: 0, strong: 0, solid: 0 };
  for (const skill of finished) {
    const memory = memoryOf(progress.skills[skill], levelsOf(skill).pathLevels);
    if (memory) counts[strengthOf(memory, today)]++;
  }

  return (
    <main className="practise">
      <header className="practise-head">
        <Dot size={64} />
        <div>
          <h1>Practise</h1>
          <p className="muted">A little and often keeps maths in your memory.</p>
        </div>
      </header>

      <section className="card" aria-labelledby="review-title">
        <h2 id="review-title">
          <RefreshIcon size={22} /> Review
        </h2>
        {due.length > 0 ? (
          <>
            <p>
              {due.length === 1 ? "1 skill is" : `${due.length} skills are`} due for review. Five
              minutes now keeps {due.length === 1 ? "it" : "them"} fresh.
            </p>
            <ul className="skill-list">
              {due.slice(0, 4).map((s) => (
                <li key={s}>{skillText(s)}</li>
              ))}
              {due.length > 4 && <li className="muted">and {due.length - 4} more</li>}
            </ul>
            <button
              type="button"
              className="button primary big"
              onClick={() => onStart({ kind: "review" })}
            >
              Start review
            </button>
          </>
        ) : finished.length > 0 ? (
          <>
            <p>
              Nothing is due today. Want extra practice on the skills you have not seen for a while?
            </p>
            <button
              type="button"
              className="button big"
              onClick={() => onStart({ kind: "review" })}
            >
              Extra practice
            </button>
          </>
        ) : (
          <p className="muted">
            Finish your first skill on the path, and it will come back here to keep it fresh.
          </p>
        )}
      </section>

      <section className="card" aria-labelledby="speed-title">
        <h2 id="speed-title">
          <ClockIcon size={22} /> Speed round
        </h2>
        {finished.length > 0 ? (
          <>
            <p>
              As many quick questions as you can in {SPEED_SECONDS} seconds, from the skills you
              have finished.{" "}
              {progress.speedBest > 0 && <strong>Your best: {progress.speedBest} right.</strong>}
            </p>
            <button type="button" className="button big" onClick={() => onStart({ kind: "speed" })}>
              Start a speed round
            </button>
          </>
        ) : (
          <p className="muted">Finish a skill to race the clock on it.</p>
        )}
      </section>

      <section className="card" aria-labelledby="mistakes-title">
        <h2 id="mistakes-title">Fix my mistakes</h2>
        {mistakes.length > 0 ? (
          <>
            <p>
              Questions that offer the mistakes you have made before, so you can put them right.
            </p>
            <ul className="mistake-list">
              {mistakes.slice(0, MISTAKES_AT_ONCE).map((m) => (
                <li key={m.code}>
                  <span>{describeMisconception(m.code) ?? m.code}</span>
                  <span className="muted small">Made {times(m.count)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="button primary big"
              onClick={() => onStart({ kind: "mistakes" })}
            >
              Fix my mistakes
            </button>
          </>
        ) : (
          <p className="muted">
            No mistakes to fix. When one of your answers shows a common mistake, it comes here so
            you can put it right.
          </p>
        )}
      </section>

      <section className="card" aria-labelledby="units-title">
        <h2 id="units-title">
          <ReviewIcon size={22} /> Unit reviews
        </h2>
        {openReviews.length > 0 ? (
          <ul className="unit-list">
            {openReviews.map((u) => {
              const family = familyOf(u.unit.topic);
              return (
                <li key={u.unit.id} className={`fam-${family}`}>
                  <span className="unit-chip" aria-hidden="true">
                    <FamilyIcon family={family} size={20} />
                  </span>
                  <span className="unit-list-name">
                    <span className="muted small">Unit {u.number}</span>
                    {u.unit.name}
                  </span>
                  <button
                    type="button"
                    className="button small-button"
                    onClick={() => onStart({ kind: "unit", unit: u.unit })}
                  >
                    Start
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="muted">Finish every skill in a unit to open its review.</p>
        )}
      </section>

      <section className="card" aria-labelledby="memory-title">
        <h2 id="memory-title">Your memory</h2>
        {finished.length > 0 ? (
          <>
            <div className="memory-bar" aria-hidden="true">
              {STRENGTHS.map(({ key }) =>
                counts[key] > 0 ? (
                  <span key={key} className={`memory-${key}`} style={{ flexGrow: counts[key] }} />
                ) : null,
              )}
            </div>
            <dl className="memory-key">
              {STRENGTHS.map(({ key, name, detail }) => (
                <div key={key}>
                  <dt>
                    <span className={`swatch memory-${key}`} aria-hidden="true" />
                    {name}
                  </dt>
                  <dd>
                    <strong>{counts[key]}</strong> <span className="muted small">{detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        ) : (
          <p className="muted">Skills you finish show here, with how well you remember them.</p>
        )}
      </section>
    </main>
  );
}
