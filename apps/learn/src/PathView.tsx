// The path through a year: a banner for each unit in its topic's colour, then its skills as a
// winding line of nodes, ending in the unit review, and the year review at the very end. Dot waits
// beside the current skill; a finished skill due for review fades until it is refreshed.
import type { CourseSection } from "@mathsplanner/core";
import { useEffect, useRef, type CSSProperties } from "react";
import { skillText, topicName, type PathNode, type PathUnit, type ReviewState } from "./course.ts";
import { Dot } from "./Dot.tsx";
import { familyOf } from "./families.ts";
import {
  CheckIcon,
  FamilyIcon,
  IdeaIcon,
  LockIcon,
  RefreshIcon,
  ReviewIcon,
  StarIcon,
} from "./Icons.tsx";
import { yearReviewId } from "./practice.ts";
import { pathFor } from "./path.ts";
import type { Progress } from "./progress.ts";
import { unitLessonFor, type UnitLesson } from "./unit-lessons/index.ts";

/** How far each node sits from the middle, in rem, repeating down the path. */
const SWAY = [0, 2.6, 4, 2.6, 0, -2.6, -4, -2.6];

export type Selection =
  | { kind: "skill"; unit: PathUnit; node: PathNode; before?: string }
  | { kind: "review"; unit: PathUnit }
  | { kind: "lesson"; unit: PathUnit; lesson: UnitLesson; done: boolean }
  | { kind: "year"; section: CourseSection; state: ReviewState };

const REVIEW_WORDS: Record<ReviewState, string> = {
  locked: "locked",
  open: "open",
  done: "done",
};

/** The levels done, as segments around the node. */
function Ring({ done, total }: { done: number; total: number }) {
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const gap = total > 1 ? 7 : 0;
  const length = circumference / total - gap;
  return (
    <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <circle
          key={i}
          cx="50"
          cy="50"
          r={r}
          className={i < done ? "ring-done" : "ring-todo"}
          strokeDasharray={`${length} ${circumference - length}`}
          strokeDashoffset={-(i * (length + gap)) + circumference / 4}
        />
      ))}
    </svg>
  );
}

const STATE_WORDS: Record<PathNode["state"], string> = {
  locked: "locked",
  current: "up next",
  started: "started",
  done: "finished",
  mastered: "mastered",
  legendary: "legendary",
};

function NodeFace({ node, family }: { node: PathNode; family: ReturnType<typeof familyOf> }) {
  if (node.state === "locked") return <LockIcon size={26} />;
  if (node.state === "legendary") return <StarIcon size={30} />;
  if (node.state === "mastered") return <CheckIcon size={30} />;
  return <FamilyIcon family={family} size={30} />;
}

export function PathView({
  section,
  progress,
  today,
  onSelect,
}: {
  section: CourseSection;
  progress: Progress;
  today: string;
  onSelect: (selection: Selection) => void;
}) {
  const units = pathFor(section, progress, today);
  const yearState: ReviewState = units.some((u) => u.review === "locked")
    ? "locked"
    : yearReviewId(section) in progress.reviews
      ? "done"
      : "open";
  const currentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, [section.stage, progress.example]);

  let step = 0;
  let previous: string | undefined;
  return (
    <div className="path">
      {units.map((u) => {
        const family = familyOf(u.unit.topic);
        const done = u.nodes.filter((n) => n.level >= n.info.pathLevels).length;
        const lesson = unitLessonFor(u.unit.id, progress.settings.teacher);
        const lessonDone = u.unit.id in progress.unitLessons;
        return (
          <section key={u.unit.id} className={`unit fam-${family}`} aria-labelledby={u.unit.id}>
            <header className="unit-banner">
              <div>
                <p className="eyebrow">
                  Unit {u.number} · {topicName(u.unit.topic)}
                </p>
                <h2 id={u.unit.id}>{u.unit.name}</h2>
              </div>
              <p className="unit-count">
                {done}/{u.nodes.length}
                <span className="visually-hidden"> skills finished</span>
              </p>
            </header>
            <ol className="nodes">
              {lesson && (
                <li className="node-row" style={{ "--sway": "0rem" } as CSSProperties}>
                  <div className="node-wrap">
                    <button
                      type="button"
                      className={`lesson-stop${lessonDone ? " lesson-stop-done" : ""}`}
                      onClick={() =>
                        onSelect({ kind: "lesson", unit: u, lesson, done: lessonDone })
                      }
                    >
                      {lessonDone ? <CheckIcon size={30} /> : <IdeaIcon size={32} />}
                      <span className="visually-hidden">
                        Lesson: {lesson.title}, {lessonDone ? "done" : "start here"}
                      </span>
                    </button>
                    <span className="node-label" aria-hidden="true">
                      Lesson: {lesson.title}
                    </span>
                  </div>
                </li>
              )}
              {u.nodes.map((node) => {
                const sway = SWAY[step++ % SWAY.length] ?? 0;
                const before = previous;
                previous = node.skill;
                const style = { "--sway": `${sway}rem` } as CSSProperties;
                const current = node.state === "current";
                return (
                  <li key={node.skill} className="node-row" style={style}>
                    <div className="node-wrap" ref={current ? currentRef : undefined}>
                      {current && (
                        <div className={`dot-beside ${sway > 0 ? "left" : "right"}`}>
                          <Dot size={58} family={family} />
                          <span className="bubble">
                            {node.level > 0 ? "Keep going" : "Start here"}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className={`node node-${node.state}${node.due ? " node-due" : ""}`}
                        onClick={() =>
                          onSelect({ kind: "skill", unit: u, node, ...(before ? { before } : {}) })
                        }
                      >
                        {node.state !== "locked" && (
                          <Ring done={node.level} total={node.info.levels.length} />
                        )}
                        <span className="node-face">
                          <NodeFace node={node} family={family} />
                        </span>
                        {node.due && (
                          <span className="due-badge" aria-hidden="true">
                            <RefreshIcon size={16} />
                          </span>
                        )}
                        <span className="visually-hidden">
                          {skillText(node.skill)}, {STATE_WORDS[node.state]}, level {node.level} of{" "}
                          {node.info.levels.length}
                          {node.due ? ", due for review" : ""}
                        </span>
                      </button>
                      <span className="node-label" aria-hidden="true">
                        {skillText(node.skill)}
                      </span>
                    </div>
                  </li>
                );
              })}
              <li className="node-row" style={{ "--sway": "0rem" } as CSSProperties}>
                <div className="node-wrap">
                  <button
                    type="button"
                    className={`review review-${u.review}`}
                    onClick={() => onSelect({ kind: "review", unit: u })}
                  >
                    {u.review === "done" ? <CheckIcon size={30} /> : <ReviewIcon size={28} />}
                    <span className="visually-hidden">
                      Unit {u.number} review, {REVIEW_WORDS[u.review]}
                    </span>
                  </button>
                  <span className="node-label" aria-hidden="true">
                    Unit review
                  </span>
                </div>
              </li>
            </ol>
          </section>
        );
      })}
      <footer className="path-end">
        <button
          type="button"
          className={`review year-review review-${yearState}`}
          onClick={() => onSelect({ kind: "year", section, state: yearState })}
        >
          {yearState === "done" ? <StarIcon size={34} /> : <ReviewIcon size={34} />}
          <span className="visually-hidden">
            {section.name} review, {REVIEW_WORDS[yearState]}
          </span>
        </button>
        <span className="node-label" aria-hidden="true">
          {section.name} review
        </span>
        <Dot size={72} mood="cheer" />
        <p>That is the end of {section.name}.</p>
      </footer>
    </div>
  );
}
