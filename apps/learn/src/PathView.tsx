// The path through a year: a banner for each unit in its topic's colour, then its skills as a
// winding line of nodes, ending in the unit review. Dot waits beside the current skill.
import type { CourseSection } from "@mathsplanner/core";
import { useEffect, useRef, type CSSProperties } from "react";
import { buildPath, skillText, topicName, type PathNode, type PathUnit } from "./course.ts";
import { Dot } from "./Dot.tsx";
import { familyOf } from "./families.ts";
import { CheckIcon, FamilyIcon, LockIcon, ReviewIcon, StarIcon } from "./Icons.tsx";
import { levelOf, type Progress } from "./progress.ts";
import { levelsOf } from "./skills.ts";

/** How far each node sits from the middle, in rem, repeating down the path. */
const SWAY = [0, 2.6, 4, 2.6, 0, -2.6, -4, -2.6];

export type Selection =
  | { kind: "skill"; unit: PathUnit; node: PathNode; before?: string }
  | { kind: "review"; unit: PathUnit };

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
  onSelect,
}: {
  section: CourseSection;
  progress: Progress;
  onSelect: (selection: Selection) => void;
}) {
  const units = buildPath(section, (s) => levelOf(progress, s), levelsOf);
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
                          <Dot size={58} />
                          <span className="bubble">
                            {node.level > 0 ? "Keep going" : "Start here"}
                          </span>
                        </div>
                      )}
                      <button
                        type="button"
                        className={`node node-${node.state}`}
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
                        <span className="visually-hidden">
                          {skillText(node.skill)}, {STATE_WORDS[node.state]}, level {node.level} of{" "}
                          {node.info.levels.length}
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
                    <ReviewIcon size={28} />
                    <span className="visually-hidden">
                      Unit {u.number} review, {u.review === "open" ? "open" : "locked"}
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
        <Dot size={72} mood="cheer" />
        <p>That is the end of {section.name}.</p>
      </footer>
    </div>
  );
}
