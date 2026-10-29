// The sheet that opens from a node: the skill, its levels and what each asks, and the way in. Lessons
// arrive in the next step, so for now the sheet says so instead of starting one.
import { useEffect, useRef } from "react";
import { skillText, topicName, type Level } from "./course.ts";
import { familyOf } from "./families.ts";
import { CheckIcon, FamilyIcon, LockIcon, ReviewIcon } from "./Icons.tsx";
import type { Selection } from "./PathView.tsx";

const NUMBERS_WORDS = {
  friendly: "friendly numbers",
  standard: "standard numbers",
  stretch: "stretch numbers",
};

const LEVEL_WORDS: Record<Level["name"], string> = {
  Learn: "A worked example, then try it yourself",
  Practise: "The skill in different forms",
  Picture: "Diagrams, words and symbols",
  Reason: "Explain, justify or spot the mistake",
  Legendary: "The hardest questions, for a real challenge",
};

export function SkillSheet({
  selection,
  onClose,
}: {
  selection: Selection | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (selection && !dialog.open) dialog.showModal();
    if (!selection && dialog.open) dialog.close();
  }, [selection]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="sheet-title"
    >
      {selection && <SheetBody selection={selection} onClose={onClose} />}
    </dialog>
  );
}

function SheetBody({ selection, onClose }: { selection: Selection; onClose: () => void }) {
  const { unit } = selection;
  const family = familyOf(unit.unit.topic);
  if (selection.kind === "review") {
    return (
      <div className={`sheet-body fam-${family}`}>
        <p className="eyebrow">
          Unit {unit.number} · {unit.unit.name}
        </p>
        <h2 id="sheet-title" className="sheet-title">
          <span className="sheet-icon">
            <ReviewIcon size={26} />
          </span>
          Unit review
        </h2>
        <p>
          A mixed lesson on every skill in this unit, to check it has stuck.{" "}
          {unit.review === "open"
            ? "Reviews open in a later update."
            : "It opens when you have finished every skill in the unit."}
        </p>
        <button type="button" className="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  const { node, before } = selection;
  const locked = node.state === "locked";
  return (
    <div className={`sheet-body fam-${family}`}>
      <p className="eyebrow">
        Unit {unit.number} · {topicName(unit.unit.topic)}
      </p>
      <h2 id="sheet-title" className="sheet-title">
        <span className="sheet-icon">
          <FamilyIcon family={family} size={26} />
        </span>
        {skillText(node.skill)}
      </h2>
      <p className="skill-id">{node.skill}</p>

      {locked && before ? (
        <p className="locked-note">
          <LockIcon size={18} /> Finish “{skillText(before)}” to open this skill.
        </p>
      ) : null}

      <ol className="levels">
        {node.info.levels.map((level, i) => {
          const n = i + 1;
          const state =
            n <= node.level ? "done" : n === node.level + 1 && !locked ? "next" : "todo";
          const mastery = node.info.mastery === n;
          return (
            <li key={level.name} className={`level level-${state}`}>
              <span className="level-mark" aria-hidden="true">
                {state === "done" ? <CheckIcon size={16} /> : n}
              </span>
              <span className="level-text">
                <strong>
                  {level.name}
                  {mastery && <span className="tag">Mastered</span>}
                </strong>
                <span>
                  {LEVEL_WORDS[level.name]} · depth {level.depths.join(" and ")},{" "}
                  {NUMBERS_WORDS[level.numbers]}
                </span>
              </span>
              <span className="visually-hidden">
                {state === "done" ? "done" : state === "next" ? "next" : "to do"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="sheet-actions">
        <button type="button" className="button primary" disabled>
          {node.level === 0 ? "Start lesson" : "Next lesson"}
        </button>
        <p className="muted">Lessons open in the next update.</p>
        <button type="button" className="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
